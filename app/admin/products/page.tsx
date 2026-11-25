import { adminClient } from "@/lib/adminSanity"
import AdminLayout from "../_components/AdminLayout"
import ProductList from "./_components/ProductList"
import { Product } from "../../types"

export const dynamic = "force-dynamic" // ← ADD THIS LINE

export default async function AdminProductsPage() {
  let products: Product[] = []
  try {
    products = await adminClient.fetch(
      `*[_type == "product"] | order(_createdAt desc) { _id, name, slug, category, price, description, image, images, sizes, colors, variants, inStock, featured }`,
      {}, { cache: "no-store" }
    )
  } catch {
    // Keep the admin shell available until the independent Zeva CMS is configured.
  }

  return (
    <AdminLayout>
      <ProductList initialProducts={products} />
    </AdminLayout>
  )
}