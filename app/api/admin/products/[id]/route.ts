
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { adminClient } from "../../../../../lib/adminSanity"
import { revalidatePath } from "next/cache"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await auth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()

    // Get the existing product and its current stock.
    const existing = await adminClient.fetch(
      `*[_type == "product" && _id == $id][0] {
        _id,
        stock,
        slug
      }`,
      { id },
      { cache: "no-store" }
    )

    if (!existing) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Validate quantity when it is included in the update.
    if (
      body.stock !== undefined &&
      (!Number.isInteger(Number(body.stock)) || Number(body.stock) < 0)
    ) {
      return NextResponse.json(
        { error: "Stock must be a non-negative whole number" },
        { status: 400 }
      )
    }

    // Quantity determines availability.
    const stock =
      body.stock !== undefined
        ? Number(body.stock)
        : Number(existing.stock ?? 0)

    const updates = {
      ...body,
      stock,
      inStock: stock > 0,
    }

    const product = await adminClient.patch(id).set(updates).commit()

    const slug = product.slug?.current || existing.slug?.current

    // Refresh storefront and admin product data.
    revalidatePath("/")
    revalidatePath("/shop")
    revalidatePath("/admin/products")
    revalidatePath(`/admin/products/${id}`)
    revalidatePath("/shop/[slug]", "page")

    if (slug) {
      revalidatePath(`/shop/${slug}`)
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Product update error:", error)

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await auth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    // Fetch slug before deleting so we can revalidate.
    const product = await adminClient.fetch(
      `*[_type == "product" && _id == $id][0]{ slug }`,
      { id }
    )

    await adminClient.delete(id)

    revalidatePath("/")
    revalidatePath("/shop")
    revalidatePath("/admin/products")
    revalidatePath("/shop/[slug]", "page")

    if (product?.slug?.current) {
      revalidatePath(`/shop/${product.slug.current}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
