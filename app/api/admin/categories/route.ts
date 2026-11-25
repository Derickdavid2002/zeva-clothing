import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { adminClient } from "../../../../lib/adminSanity"
import { revalidatePath } from "next/cache"

export async function GET() {
  if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    let categories = await adminClient.fetch(`*[_type == "category"] | order(order asc, title asc) { _id, title, slug, description, image, "imageUrl": image.asset->url, order }`)
    const seedMarker = await adminClient.fetch(`*[_type == "categorySeedMarker"][0]._id`)
    if (!seedMarker) {
      const tx = adminClient.transaction().createIfNotExists({ _id: "zeva-category-seed-marker", _type: "categorySeedMarker", createdAt: new Date().toISOString() })
      if (categories.length === 0) {
        const initial = [
          { title: "Clothes", description: "Everyday and statement fashion", order: 1 },
          { title: "Glasses", description: "Finishing touches and frames", order: 2 },
          { title: "Nails", description: "Nail essentials and designs", order: 3 },
          { title: "Lip Gloss", description: "Gloss and beauty essentials", order: 4 },
        ]
        for (const item of initial) {
          const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
          tx.createIfNotExists({ _id: `zeva-category-${slug}`, _type: "category", ...item, slug: { _type: "slug", current: slug } })
        }
      }
      await tx.commit()
      categories = await adminClient.fetch(`*[_type == "category"] | order(order asc, title asc) { _id, title, slug, description, image, "imageUrl": image.asset->url, order }`)
    }
    return NextResponse.json(categories)
  } catch { return NextResponse.json({ error: "Unable to load categories" }, { status: 500 }) }
}

export async function POST(req: Request) {
  if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { title, description = "", order = 0, image } = await req.json()
    if (!title?.trim()) return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const duplicate = await adminClient.fetch(`count(*[_type == "category" && slug.current == $slug])`, { slug })
    if (duplicate) return NextResponse.json({ error: "A category with this name already exists" }, { status: 409 })
    const category = await adminClient.create({ _type: "category", title: title.trim(), slug: { _type: "slug", current: slug }, description, ...(image ? { image } : {}), order: Number(order) || 0 })
    revalidatePath("/"); revalidatePath("/shop")
    return NextResponse.json(category)
  } catch { return NextResponse.json({ error: "Unable to create category" }, { status: 500 }) }
}
