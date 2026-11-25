import { adminClient } from "@/lib/adminSanity"
import AdminLayout from "../_components/AdminLayout"
import DashboardStats from "./_components/DashboardStats"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  let products: any[] = []
  let categoryCount = 0
  let recentProducts: any[] = []
  let categories: any[] = []
  try {
    const [productData, categoryTotal, recentData, categoryData] = await Promise.all([
      adminClient.fetch(`*[_type == "product"]{ _id, name, price, inStock, featured, category }`, {}, { cache: "no-store" }),
      adminClient.fetch(`count(*[_type == "category"])`, {}, { cache: "no-store" }),
      adminClient.fetch(
        `*[_type == "product"] | order(_createdAt desc)[0...3]{ _id, name, price, inStock, category, "imageUrl": image.asset->url }`,
        {},
        { cache: "no-store" }
      ),
      adminClient.fetch(
        `*[_type == "category"] | order(order asc)[0...6]{ _id, title }`,
        {},
        { cache: "no-store" }
      ),
    ])
    products = productData || []
    categoryCount = Number(categoryTotal) || 0
    recentProducts = recentData || []
    categories = categoryData || []
  } catch {
    // Keep the admin shell usable until the separate Zeva Sanity project is configured.
  }
  const stats = {
    total: products.length,
    inStock: products.filter((p: any) => p.inStock).length,
    featured: products.filter((p: any) => p.featured).length,
    outOfStock: products.filter((p: any) => !p.inStock).length,
    categories: categoryCount,
  }
  return (
    <AdminLayout>
      <DashboardStats
        stats={stats}
        recentProducts={recentProducts}
        categories={categories}
      />
    </AdminLayout>
  )
}