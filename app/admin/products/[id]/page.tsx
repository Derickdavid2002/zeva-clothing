
import { adminClient } from "@/lib/adminSanity"
import AdminLayout from "../../_components/AdminLayout"
import EditProductForm from "./_components/EditProductForm"
import { Product } from "../../../types"
import { redirect } from "next/navigation"

type EditingProduct = Product & {
  stock?: number
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let product: EditingProduct | null = null

  try {
    product = await adminClient.fetch(
      `*[_type == "product" && _id == $id][0] {
        _id,
        name,
        slug,
        category,
        price,
        description,
        image,
        images,
        sizes,
        colors,
        variants,
        stock,
        inStock,
        featured
      }`,
      { id },
      { cache: "no-store" }
    )
  } catch {
    redirect("/admin/products")
  }

  if (!product) redirect("/admin/products")

  return (
    <AdminLayout>
      <EditProductForm product={product} />
    </AdminLayout>
  )
}
