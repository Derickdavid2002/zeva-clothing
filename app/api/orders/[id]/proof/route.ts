
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { adminClient } from "@/lib/adminSanity"
import { getDeliveryFee } from "@/lib/deliveryFee"
import { resend, ADMIN_EMAIL, RESEND_FROM_EMAIL } from "@/lib/email/resend"
import { newOrderAlertTemplate } from "@/lib/email/templates/newOrderAlert"
import { orderPlacedTemplate } from "@/lib/email/templates/orderPlaced"

function verifyToken(token: string, sessionId: string) {
  const secret =
    process.env.ORDER_UPLOAD_SECRET || process.env.NEXTAUTH_SECRET || ""

  if (!secret) return null

  const [payload, signature] = token.split(".")
  if (!payload || !signature) return null

  const expected = createHmac("sha256", secret).update(payload).digest()

  let actual: Buffer

  try {
    actual = Buffer.from(signature, "base64url")
  } catch {
    return null
  }

  if (
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  ) {
    return null
  }

  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    )

    if (
      data.sessionId !== sessionId ||
      !Number.isFinite(Number(data.exp)) ||
      Number(data.exp) <= Date.now()
    ) {
      return null
    }

    return data.checkout
  } catch {
    return null
  }
}

function generateOrderNumber() {
  return `ZEV-${Date.now().toString().slice(-6)}-${randomBytes(2)
    .toString("hex")
    .toUpperCase()}`
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params
    const token = req.headers.get("x-order-upload-token") || ""
    const checkout = verifyToken(token, sessionId)

    if (!checkout) {
      return NextResponse.json(
        { error: "Your checkout session is invalid or expired. Please restart checkout." },
        { status: 401 }
      )
    }

    const { customer, delivery, items } = checkout

    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.phone ||
      !delivery?.address ||
      !delivery?.state ||
      !Array.isArray(items) ||
      items.length < 1
    ) {
      return NextResponse.json(
        { error: "Your checkout details are incomplete. Please restart checkout." },
        { status: 400 }
      )
    }

    // Use a deterministic Sanity ID so the same session cannot create
    // multiple orders, even if the proof request is submitted twice.
    const orderId = `zeva-order-${sessionId}`

    const existingOrder = await adminClient.fetch(
      `*[_type == "order" && _id == $orderId][0]{ _id, orderNumber }`,
      { orderId },
      { cache: "no-store" }
    )

    if (existingOrder) {
      return NextResponse.json(
        { error: "This checkout has already been submitted. Please contact the store if you need help." },
        { status: 409 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No payment screenshot was provided." },
        { status: 400 }
      )
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"]

    if (
      !allowed.includes(file.type) ||
      file.size < 1 ||
      file.size > 5 * 1024 * 1024
    ) {
      return NextResponse.json(
        { error: "Upload a JPG, PNG or WebP image under 5MB." },
        { status: 400 }
      )
    }

    // Re-fetch product information and recheck stock and prices.
    const requested = items.map((item: any) => ({
      productId: typeof item?.productId === "string" ? item.productId : "",
      qty: Number(item?.qty),
      size: item?.size,
      color: item?.color,
      selectedOptions: Array.isArray(item?.selectedOptions)
        ? item.selectedOptions
        : [],
    }))

    if (
      requested.some(
        (item: any) =>
          !item.productId ||
          !Number.isInteger(item.qty) ||
          item.qty < 1 ||
          item.qty > 20
      )
    ) {
      return NextResponse.json(
        { error: "One or more checkout items are invalid." },
        { status: 400 }
      )
    }

    const ids = [...new Set(requested.map((item: any) => item.productId))]

    const products = await adminClient.fetch(
      `*[_type == "product" && _id in $ids]{
        _id,
        name,
        price,
        image,
        stock,
        inStock
      }`,
      { ids },
      { cache: "no-store" }
    )

    const productMap = new Map(
      products.map((product: any) => [product._id, product])
    )

    const requestedQuantities = new Map<string, number>()

    for (const item of requested) {
      requestedQuantities.set(
        item.productId,
        (requestedQuantities.get(item.productId) || 0) + item.qty
      )
    }

    const orderItems = requested.map((item: any) => {
      const product = productMap.get(item.productId) as any

      if (!product || product.inStock === false) {
        throw new Error(
          `“${product?.name || "A product"}” is unavailable. Please contact the store.`
        )
      }

      if (
        !Number.isFinite(Number(product.price)) ||
        Number(product.price) < 0
      ) {
        throw new Error(`The current price for ${product.name} is invalid.`)
      }

      const availableStock = Number(product.stock ?? 0)
      const requestedQty = requestedQuantities.get(product._id) || 0

      if (availableStock < requestedQty) {
        throw new Error(
          `Only ${availableStock} units of "${product.name}" are currently available. Please contact the store.`
        )
      }

      return {
        _key: randomBytes(8).toString("hex"),
        productId: product._id,
        name: product.name,
        price: Number(product.price),
        qty: item.qty,
        image: product.image,
        ...(item.size !== undefined ? { size: item.size } : {}),
        ...(item.color !== undefined ? { color: item.color } : {}),
        ...(item.selectedOptions.length
          ? { selectedOptions: item.selectedOptions }
          : {}),
      }
    })

    const subtotal = orderItems.reduce(
      (sum: number, item: any) => sum + item.price * item.qty,
      0
    )

    const deliveryFee = getDeliveryFee(delivery.state)
    const total = subtotal + deliveryFee

    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json(
        { error: "Unable to calculate this order total." },
        { status: 400 }
      )
    }

    // Upload proof first. The order is created only after this succeeds.
    const asset = await adminClient.assets.upload(
      "image",
      Buffer.from(await file.arrayBuffer()),
      {
        filename: `payment-proof-${sessionId}`,
        contentType: file.type,
      }
    )

    const orderNumber = generateOrderNumber()

    const orderDocument = {
      _id: orderId,
      _type: "order",
      orderNumber,
      status: "pending",
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      delivery: {
        address: delivery.address,
        state: delivery.state,
        fee: deliveryFee,
      },
      items: orderItems,
      subtotal,
      total,
      proofOfPayment: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      },
      proofSubmittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    // createIfNotExists prevents duplicate orders for the same session.
    const createdOrder = await adminClient.createIfNotExists(orderDocument)

    // If another request already created this session's order, don't send
    // duplicate emails or report a second successful submission.
    if (
      createdOrder.proofOfPayment?.asset?._ref !== asset._id
    ) {
      return NextResponse.json(
        { error: "This checkout has already been submitted. Please contact the store if you need help." },
        { status: 409 }
      )
    }

    if (resend && RESEND_FROM_EMAIL) {
      try {
        await resend.emails.send({
          from: RESEND_FROM_EMAIL,
          to: [customer.email],
          subject: `Order Received — #${orderNumber}`,
          html: orderPlacedTemplate({
            customerName: customer.name,
            orderNumber,
            items: orderItems,
            subtotal,
            deliveryFee,
            total,
            address: delivery.address,
            state: delivery.state,
          }),
        })

        if (ADMIN_EMAIL) {
          await resend.emails.send({
            from: RESEND_FROM_EMAIL,
            to: [ADMIN_EMAIL],
            subject: `New Order — #${orderNumber}`,
            html: newOrderAlertTemplate({
              orderNumber,
              customerName: customer.name,
              customerEmail: customer.email,
              customerPhone: customer.phone,
              address: delivery.address,
              state: delivery.state,
              items: orderItems,
              subtotal,
              deliveryFee,
              total,
              proofUrl: asset.url,
            }),
          })
        }
      } catch (emailError) {
        console.error(
          "Order email notification failed after successful proof upload:",
          emailError
        )
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber,
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not upload payment proof. Please try again."

    console.error("PAYMENT PROOF UPLOAD ERROR:", error)

    const isValidationError =
      message.includes("unavailable") ||
      message.includes("available") ||
      message.includes("invalid") ||
      message.includes("select")

    return NextResponse.json(
      { error: message },
      { status: isValidationError ? 400 : 500 }
    )
  }
}
