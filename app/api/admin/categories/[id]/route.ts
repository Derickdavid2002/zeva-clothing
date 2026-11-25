import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { adminClient } from "../../../../../lib/adminSanity"
import { revalidatePath } from "next/cache"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { id } = await params; const { title, description = "", order = 0, image } = await req.json()
    if (!title?.trim()) return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const existing = await adminClient.fetch(`*[_type == "category" && _id == $id][0]{ title }`, { id })
    const duplicate = await adminClient.fetch(`count(*[_type == "category" && slug.current == $slug && _id != $id])`, { slug, id })
    if (duplicate) return NextResponse.json({ error: "A category with this name already exists" }, { status: 409 })
    const products = existing?.title === title.trim() ? [] : await adminClient.fetch(`*[_type == "product" && category == $oldTitle]{ _id }`, { oldTitle: existing?.title })
    const tx = adminClient.transaction().patch(id, (patch: any) => patch.set({ title: title.trim(), slug: { _type: "slug", current: slug }, description, ...(image ? { image } : {}), order: Number(order) || 0 }))
    for (const product of products) tx.patch(product._id, (patch: any) => patch.set({ category: title.trim() }))
    await tx.commit()
    const category = await adminClient.fetch(`*[_type == "category" && _id == $id][0]`, { id })
    revalidatePath("/"); revalidatePath("/shop")
    return NextResponse.json(category)
  } catch { return NextResponse.json({ error: "Unable to update category" }, { status: 500 }) }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { id } = await params
    const category = await adminClient.fetch(`*[_type == "category" && _id == $id][0]{ title }`, { id })
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 })
    const used = await adminClient.fetch(`count(*[_type == "product" && category == $title])`, { title: category.title })
    if (used > 0) return NextResponse.json({ error: `Move or delete the ${used} product(s) in this category before deleting it.` }, { status: 409 })
    await adminClient.delete(id); revalidatePath("/"); revalidatePath("/shop")
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Unable to delete category" }, { status: 500 }) }
}
