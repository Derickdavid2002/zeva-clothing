
import { createHmac, randomBytes } from "node:crypto"
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { adminClient } from "@/lib/adminSanity"
import { getDeliveryFee } from "@/lib/deliveryFee"

function uploadSecret() {
  return process.env.ORDER_UPLOAD_SECRET || process.env.NEXTAUTH_SECRET || ""
}

function createCheckoutToken(sessionId: string, checkout: object) {
  const secret = uploadSecret()

  if (!secret) {
    throw new Error("ORDER_UPLOAD_SECRET or NEXTAUTH_SECRET must be configured")
  }

  const payload = Buffer.from(
    JSON.stringify({
      sessionId,
      checkout,
      exp: Date.now() + 30 * 60 * 1000,
    })
  ).toString("base64url")

  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url")

  return `${payload}.${signature}`
}

export async function POST(req: Request) {
  try {
    if (!uploadSecret()) {
      return NextResponse.json(
        { error: "Checkout is not fully configured yet. Please contact the store." },
        { status: 503 }
      )
    }

    const body = await req.json()
    const { customer, delivery, items } = body ?? {}

    if (
      !customer ||
      typeof customer.name !== "string" ||
      !customer.name.trim() ||
      typeof customer.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
      typeof customer.phone !== "string" ||
      !customer.phone.trim()
    ) {
      return NextResponse.json(
        { error: "Enter valid customer name, email and phone details." },
        { status: 400 }
      )
    }

    if (
      !delivery ||
      typeof delivery.address !== "string" ||
      !delivery.address.trim() ||
      typeof delivery.state !== "string" ||
      !delivery.state.trim()
    ) {
      return NextResponse.json(
        { error: "Enter a valid delivery address and state." },
        { status: 400 }
      )
    }

    if (!Array.isArray(items) || items.length < 1 || items.length > 50) {
      return NextResponse.json(
        { error: "Your cart is empty or contains too many line items." },
        { status: 400 }
      )
    }

    if (
      items.reduce(
        (sum: number, item: any) => sum + Number(item?.qty || 0),
        0
      ) > 50
    ) {
      return NextResponse.json(
        { error: "Your cart exceeds the maximum checkout quantity." },
        { status: 400 }
      )
    }

    const requested = items.map((item: any) => ({
      productId: typeof item?.productId === "string" ? item.productId : "",
      qty: Number(item?.qty),
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
        { error: "One or more cart items are invalid." },
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
        slug,
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

    const pricedItems = requested.map((item: any) => {
      const product = productMap.get(item.productId) as any

      if (!product || product.inStock === false) {
        throw new Error(
          `“${product?.name || "A product"}” is unavailable. Please update your cart.`
        )
      }

      if (
        !Number.isFinite(Number(product.price)) ||
        Number(product.price) < 0
      ) {
        throw new Error(
          `The current price for ${product.name} is invalid. Please contact the store.`
        )
      }

      const availableStock = Number(product.stock ?? 0)
      const requestedQty = requestedQuantities.get(product._id) || 0

      if (availableStock < requestedQty) {
        throw new Error(
          `Only ${availableStock} units of "${product.name}" are available. You requested ${requestedQty}. Please update your cart.`
        )
      }

      return {
        _id: product._id,
        name: product.name,
        price: Number(product.price),
        qty: item.qty,
        image: product.image,
        slug: product.slug?.current || "",
        selectedOptions: item.selectedOptions,
      }
    })

    const subtotal = pricedItems.reduce(
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

    // Temporary session only. No order is created in Sanity here.
    const sessionId = randomBytes(16).toString("hex")

    const checkout = {
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
      },
      delivery: {
        address: delivery.address.trim(),
        state: delivery.state.trim(),
      },
      items: requested,
    }

    const uploadToken = createCheckoutToken(sessionId, checkout)

    return NextResponse.json({
      success: true,
      sessionId,
      uploadToken,
      subtotal,
      deliveryFee,
      total,
      pricedItems,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to prepare checkout"

    console.error("CHECKOUT PREPARATION ERROR:", message)

    const isValidationError =
      message.includes("unavailable") ||
      message.includes("available") ||
      message.includes("select") ||
      message.includes("invalid")

    return NextResponse.json(
      { success: false, error: message },
      { status: isValidationError ? 400 : 500 }
    )
  }
}

export async function GET() {
  if (!(await auth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const orders = await adminClient.fetch(
      `*[_type == "order"] | order(createdAt desc) {
        _id,
        orderNumber,
        status,
        customer,
        delivery,
        items,
        subtotal,
        total,
        createdAt
      }`,
      {},
      { cache: "no-store" }
    )

    return NextResponse.json(orders)
  } catch (error) {
    console.error("FETCH ORDERS ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
