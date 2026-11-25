
import { Suspense } from "react"
import { client } from "../../../lib/sanity"
import {
  allProductsQuery,
  allCategoriesQuery,
} from "../../../lib/queries"
import { Product, Category } from "../../types"
import ShopClient from "./_components/ShopClient"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ShopPage() {
  let products: Product[] = []
  let categories: Category[] = []

  try {
    ;[products, categories] = await Promise.all([
      client.fetch(allProductsQuery),
      client.fetch(allCategoriesQuery),
    ])
  } catch (error) {
    console.error("Failed to fetch shop data from Sanity:", error)
  }

  return (
    <Suspense
      fallback={<div className="bg-[#060606] min-h-screen" />}
    >
      <ShopClient
        products={products}
        categories={categories.map((category) => category.title)}
      />
    </Suspense>
  )
}
