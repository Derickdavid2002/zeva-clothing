import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { adminClient } from "@/lib/adminSanity"
import { resend, RESEND_FROM_EMAIL } from "@/lib/email/resend"
import { paymentConfirmedTemplate } from "@/lib/email/templates/paymentConfirmed"
import { orderShippedTemplate } from "@/lib/email/templates/orderShipped"
import { orderDeliveredTemplate } from "@/lib/email/templates/orderDelivered"
import { paymentRejectedTemplate } from "@/lib/email/templates/paymentRejected"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await auth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const { status, reason } = await req.json()

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "rejected",
    ]

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid order status" },
        { status: 400 }
      )
    }

    if (
      status === "rejected" &&
      (!reason || typeof reason !== "string" || !reason.trim())
    ) {
      return NextResponse.json(
        { error: "A rejection reason is required" },
        { status: 400 }
      )
    }

    // Fetch the order, including its revision and stock deduction status.
    const order = await adminClient.fetch(
      `*[_type == "order" && _id == $id][0] {
        _id,
        _rev,
        orderNumber,
        status,
        stockDeducted,
        customer,
        total,
        items[] {
          productId,
          name,
          qty
        }
      }`,
      { id },
      { cache: "no-store" }
    )

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    const shouldDeductStock =
      status === "confirmed" &&
      order.status !== "confirmed" &&
      order.stockDeducted !== true

    // Build one transaction for the order and all affected products.
    let transaction = adminClient.transaction()

    const orderUpdate: Record<string, any> = {
      status,
    }

    if (reason) {
      orderUpdate.rejectionReason = reason
    }

    if (shouldDeductStock) {
      if (!Array.isArray(order.items) || order.items.length === 0) {
        return NextResponse.json(
          { error: "This order has no valid products to deduct stock from." },
          { status: 400 }
        )
      }

      // Combine quantities if the same product appears more than once.
      const quantities = new Map<string, number>()

      for (const item of order.items) {
        if (
          typeof item.productId !== "string" ||
          !item.productId ||
          !Number.isInteger(item.qty) ||
          item.qty < 1
        ) {
          return NextResponse.json(
            { error: "This order contains an invalid product quantity." },
            { status: 400 }
          )
        }

        quantities.set(
          item.productId,
          (quantities.get(item.productId) || 0) + item.qty
        )
      }

      const productIds = [...quantities.keys()]

      // Read current product stock directly from Sanity.
      const products = await adminClient.fetch(
        `*[_type == "product" && _id in $ids] {
          _id,
          _rev,
          name,
          stock,
          inStock
        }`,
        { ids: productIds },
        { cache: "no-store" }
      )

      const productMap = new Map(
        products.map((product: any) => [product._id, product])
      )

      // Validate every product before making any changes.
      for (const [productId, quantity] of quantities) {
        const product = productMap.get(productId) as any

        if (!product) {
          return NextResponse.json(
            { error: "A product in this order could not be found." },
            { status: 409 }
          )
        }

        if (
          !Number.isInteger(product.stock) ||
          product.stock < 0
        ) {
          return NextResponse.json(
            {
              error: `Stock quantity for "${product.name}" is invalid. Please check the product in your dashboard.`,
            },
            { status: 409 }
          )
        }

        if (product.stock < quantity || product.inStock === false) {
          return NextResponse.json(
            {
              error: `Insufficient stock for "${product.name}". Available: ${product.stock}, ordered: ${quantity}.`,
            },
            { status: 409 }
          )
        }
      }

      // Add every product deduction to the same transaction.
      for (const [productId, quantity] of quantities) {
        const product = productMap.get(productId) as any
        const remainingStock = product.stock - quantity

        transaction = transaction.patch(productId, (patch) =>
          patch
            .ifRevisionId(product._rev)
            .set({
              stock: remainingStock,
              inStock: remainingStock > 0,
            })
        )
      }

      // Record that this order's stock has been deducted.
      orderUpdate.stockDeducted = true
    }

    // Protect the order update against simultaneous confirmation requests.
    transaction = transaction.patch(order._id, (patch) =>
      patch
        .ifRevisionId(order._rev)
        .set(orderUpdate)
    )

    // All product deductions and the order update succeed together or fail together.
    await transaction.commit()

    // Existing email notifications remain in place.
    const fmt = (n: number) => `₦${n.toLocaleString()}`

    const emailMap: Record<
      string,
      { subject: string; html: string } | null
    > = {
      confirmed: {
        subject: `✅ Payment Confirmed — #${order.orderNumber}`,
        html: paymentConfirmedTemplate({
          customerName: order.customer.name,
          orderNumber: order.orderNumber,
        }),
      },

      shipped: {
        subject: `🚚 Your Order is On the Way — #${order.orderNumber}`,
        html: orderShippedTemplate({
          customerName: order.customer.name,
          orderNumber: order.orderNumber,
        }),
      },

      delivered: {
        subject: `🌸 Order Delivered — #${order.orderNumber}`,
        html: orderDeliveredTemplate({
          customerName: order.customer.name,
          orderNumber: order.orderNumber,
        }),
      },

      rejected: {
        subject: `❌ Payment Not Confirmed — #${order.orderNumber}`,
        html: paymentRejectedTemplate({
          customerName: order.customer.name,
          orderNumber: order.orderNumber,
          reason:
            reason ||
            `Payment mismatch. Expected ${fmt(order.total)}.`,
        }),
      },
    }

    const emailData = emailMap[status]

    if (emailData && order.customer?.email && resend && RESEND_FROM_EMAIL) {
      try {
        await resend.emails.send({
          from: RESEND_FROM_EMAIL,
          to: [order.customer.email],
          subject: emailData.subject,
          html: emailData.html,
        })
      } catch (emailError) {
        console.error(
          "Order status email failed after successful status update:",
          emailError
        )
      }
    }

    return NextResponse.json({
      success: true,
      stockDeducted: shouldDeductStock || order.stockDeducted === true,
    })
  } catch (error: any) {
    console.error("ORDER UPDATE ERROR:", error)

    // A revision conflict means another update changed the order or product
    // while this transaction was being processed.
    if (error?.statusCode === 409 || error?.status === 409) {
      return NextResponse.json(
        {
          error:
            "The order or product stock changed during confirmation. Refresh the order and try again.",
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        error: "Failed to update order",
      },
      { status: 500 }
    )
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await auth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    const order = await adminClient.fetch(
      `*[_type == "order" && _id == $id][0] {
        _id,
        orderNumber,
        status,
        stockDeducted,
        customer,
        delivery,
        items,
        subtotal,
        total,
        proofOfPayment,
        notes,
        rejectionReason,
        createdAt
      }`,
      { id }
    )

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("FETCH ORDER ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}