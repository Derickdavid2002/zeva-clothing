"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/lib/sanity"
import { Product } from "../../../types"
import ConfirmModal from "../../_components/ConfirmModal"
import { MdSearch, MdInventory2, MdDelete } from "react-icons/md"
import { display } from "@/lib/fonts"

const fmt = (n: number) => `₦${n.toLocaleString()}`

export default function ProductList({
  initialProducts,
}: {
  initialProducts: Product[]
}) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [categories, setCategories] = useState<string[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    productId: string
    productName: string
  }>({ open: false, productId: "", productName: "" })

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((items: { title: string }[]) =>
        setCategories(items.map((i) => i.title))
      )
      .catch(() => setCategories([]))
  }, [])

  const filtered = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === "All" || p.category === category
    return matchSearch && matchCat
  })

  const openDeleteModal = (id: string, name: string) => {
    setConfirmModal({ open: true, productId: id, productName: name })
  }

  const handleDelete = async () => {
    const { productId } = confirmModal
    setDeleting(productId)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Delete failed")
      // Remove from local state immediately
      setProducts((prev) => prev.filter((p) => p._id !== productId))
      setConfirmModal({ open: false, productId: "", productName: "" })
      // Refresh server data
      router.refresh()
    } catch {
      setConfirmModal({ open: false, productId: "", productName: "" })
    }
    setDeleting(null)
  }

  const handleToggle = async (
    id: string,
    field: "inStock" | "featured",
    value: boolean
  ) => {
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, [field]: value } : p))
    )
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      })
      router.refresh()
    } catch {
      // Revert on error
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, [field]: !value } : p))
      )
    }
  }

  const pill =
    "inline-flex items-center flex-shrink-0 whitespace-nowrap h-9 px-4 rounded-full text-[13px] border transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#B9A5E8]/50"

  return (
    <div className="flex flex-col">
      {/* Confirm delete modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title="Delete product"
        message={`Are you sure you want to delete "${confirmModal.productName}"? This can't be undone, and it will be removed from the store immediately.`}
        confirmLabel="Yes, delete"
        cancelLabel="Keep it"
        variant="danger"
        loading={deleting === confirmModal.productId}
        onConfirm={handleDelete}
        onCancel={() =>
          setConfirmModal({ open: false, productId: "", productName: "" })
        }
      />

      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm text-white/60 mb-1.5">
            {products.length} total {products.length === 1 ? "product" : "products"}
          </p>
          <h1
            className={`${display.className} text-[52px] md:text-[68px] font-light leading-none tracking-[-0.01em] text-white`}
          >
            Products
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-[#B9A5E8] text-[#1a1226] text-sm font-medium transition-colors duration-200 hover:bg-[#D8C9F5] outline-none focus-visible:ring-2 focus-visible:ring-[#B9A5E8]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060606]"
        >
          Add new product
        </Link>
      </header>

      {/* Search + filters */}
      <div className="mt-10 flex flex-col gap-4">
        <div className="relative">
          <MdSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
          />
          <input
            type="text"
            aria-label="Search products"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-11 pr-5 rounded-full bg-white/[0.03] border border-[#1e1e1e] text-sm text-white placeholder:text-white/45 outline-none transition-colors focus:border-[#B9A5E8]/50"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto flex-nowrap -mx-5 px-5 pb-1 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`${pill} ${
                category === cat
                  ? "bg-[#B9A5E8]/[0.12] border-[#B9A5E8]/30 text-[#B9A5E8]"
                  : "bg-transparent border-[#1e1e1e] text-white/65 hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-[13px] text-white/60">
          Showing <span className="text-white">{filtered.length}</span> of{" "}
          {products.length}
        </p>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="mt-6 rounded-[20px] border border-[#1e1e1e] bg-white/[0.02] px-6 py-16 text-center">
          <p className={`${display.className} text-[28px] text-white`}>
            {products.length === 0 ? "Add your first product" : "No products found"}
          </p>
          <p className="mt-2 text-sm text-white/60">
            {products.length === 0
              ? "Products you add show up here, newest first."
              : "Try a different search or category."}
          </p>
          {products.length === 0 ? (
            <Link
              href="/admin/products/new"
              className="mt-6 inline-flex items-center justify-center h-11 px-5 rounded-full border border-[#2a2342] text-sm text-white/85 hover:border-[#B9A5E8]/50 hover:text-white transition-colors"
            >
              Add new product
            </Link>
          ) : (
            <button
              onClick={() => {
                setSearch("")
                setCategory("All")
              }}
              className="mt-6 inline-flex items-center justify-center h-11 px-5 rounded-full border border-[#2a2342] text-sm text-white/85 hover:border-[#B9A5E8]/50 hover:text-white transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <ul className="mt-4 border-t border-[#1e1e1e]">
          {filtered.map((product) => (
            <li
              key={product._id}
              className="flex flex-col gap-4 py-5 border-b border-[#1e1e1e] lg:flex-row lg:items-center lg:gap-6"
            >
              {/* Image + info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative w-[76px] h-[76px] rounded-2xl overflow-hidden flex-shrink-0 bg-[#1d1830] border border-[#2a2342]">
                  {product.image ? (
                    <Image
                      src={urlFor(product.image).width(152).height(152).url()}
                      alt={product.name}
                      fill
                      sizes="76px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MdInventory2 size={20} className="text-white/50" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium leading-snug text-white line-clamp-2">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-white/60 truncate">
                    {product.category}
                  </p>
                  <p className="mt-1 text-[15px] font-medium text-[#B9A5E8]">
                    {fmt(product.price)}
                  </p>
                </div>
              </div>

              {/* Toggles + actions */}
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3 lg:contents">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() =>
                      handleToggle(product._id, "inStock", !product.inStock)
                    }
                    aria-pressed={!!product.inStock}
                    className={`${pill} ${
                      product.inStock
                        ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/15"
                        : "bg-red-500/10 border-red-500/25 text-red-300 hover:bg-red-500/15"
                    }`}
                  >
                    {product.inStock ? "In stock" : "Out of stock"}
                  </button>
                  <button
                    onClick={() =>
                      handleToggle(product._id, "featured", !product.featured)
                    }
                    aria-pressed={!!product.featured}
                    className={`${pill} ${
                      product.featured
                        ? "bg-[#B9A5E8]/[0.12] border-[#B9A5E8]/30 text-[#B9A5E8] hover:bg-[#B9A5E8]/20"
                        : "bg-transparent border-[#1e1e1e] text-white/65 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {product.featured ? "Featured" : "Not featured"}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/products/${product._id}`}
                    className="inline-flex items-center justify-center h-10 px-5 rounded-full border border-[#2a2342] text-sm text-white/85 transition-colors hover:border-[#B9A5E8]/50 hover:text-white outline-none focus-visible:ring-1 focus-visible:ring-[#B9A5E8]/50 lg:h-11 lg:px-6"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => openDeleteModal(product._id, product.name)}
                    aria-label={`Delete ${product.name}`}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm text-red-400 transition-colors hover:bg-red-500/10 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-red-400/50 lg:w-auto lg:h-11 lg:px-5"
                  >
                    <MdDelete size={18} className="lg:hidden" />
                    <span className="hidden lg:inline">Delete</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}