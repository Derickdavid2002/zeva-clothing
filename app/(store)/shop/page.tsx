import { Suspense } from "react"
import { client } from "../../../lib/sanity"
import { allProductsQuery, allCategoriesQuery } from "../../../lib/queries"
import { Product, Category } from "../../types"
import ShopClient from "./_components/ShopClient"
export default async function ShopPage() {
  let products: Product[] = []; let categories: Category[] = []
  try { [products, categories] = await Promise.all([client.fetch(allProductsQuery), client.fetch(allCategoriesQuery)]) } catch { /* Empty until Zeva Sanity credentials are configured. */ }
  return <Suspense fallback={<div className="bg-[#060606] min-h-screen" />}><ShopClient products={products} categories={categories.map(c => c.title)} /></Suspense>
}
