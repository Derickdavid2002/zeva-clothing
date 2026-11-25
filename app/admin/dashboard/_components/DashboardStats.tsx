"use client"

import Link from "next/link"
import { display } from "@/lib/fonts"

interface Stats {
  total: number
  inStock: number
  featured: number
  outOfStock: number
  categories: number
}

interface RecentProduct {
  _id: string
  name: string
  price?: number
  inStock?: boolean
  category?: string
  imageUrl?: string | null
}

interface CategoryItem {
  _id: string
  title: string
}

interface Props {
  stats: Stats
  recentProducts?: RecentProduct[]
  categories?: CategoryItem[]
}

export default function DashboardStats({
  stats,
  recentProducts = [],
  categories = [],
}: Props) {
  const statCards = [
    { label: "Total products", value: stats.total, hint: "Current catalogue", hintColor: "text-white/60" },
    { label: "In stock", value: stats.inStock, hint: "Active products", hintColor: "text-emerald-300" },
    { label: "Featured", value: stats.featured, hint: "On homepage", hintColor: "text-[#B9A5E8]" },
    {
      label: "Out of stock",
      value: stats.outOfStock,
      hint: "Needs restocking",
      hintColor: stats.outOfStock > 0 ? "text-red-400" : "text-white/60",
    },
  ]

  const cellClass = (i: number) =>
    [
      "py-7",
      i < 2 ? "border-b border-[#1e1e1e] lg:border-b-0" : "",
      i % 2 === 1 ? "pl-6 border-l border-[#1e1e1e]" : "",
      i === 0 ? "lg:pl-0 lg:border-l-0" : "lg:pl-7 lg:border-l lg:border-[#1e1e1e]",
    ].join(" ")

  const formatPrice = (price?: number) =>
    typeof price === "number" ? `₦${price.toLocaleString("en-NG")}` : ""

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm text-white/60 mb-1.5">Welcome back</p>
          <h1
            className={`${display.className} text-[52px] md:text-[68px] font-light leading-none tracking-[-0.01em] text-white`}
          >
            Dashboard
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-[#B9A5E8] text-[#1a1226] text-sm font-medium transition-colors duration-200 hover:bg-[#D8C9F5] outline-none focus-visible:ring-2 focus-visible:ring-[#B9A5E8]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060606]"
        >
          Add new product
        </Link>
      </header>

      {/* Stats strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 mt-10 md:mt-11 border-y border-[#1e1e1e]">
        {statCards.map((card, i) => (
          <div key={card.label} className={cellClass(i)}>
            <p
              className={`${display.className} text-[64px] md:text-[80px] font-light leading-none ${
                card.value === 0 ? "text-white/55" : "text-white"
              }`}
            >
              {card.value}
            </p>
            <p className="mt-2.5 text-sm font-medium text-white">{card.label}</p>
            <p className={`mt-0.5 text-[13px] ${card.hintColor}`}>{card.hint}</p>
          </div>
        ))}
      </section>

      {/* Products + categories */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-12 lg:gap-14 mt-12">
        {/* Recent products */}
        <div>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className={`${display.className} text-[32px] font-normal text-white`}>
              Recent products
            </h2>
            <Link
              href="/admin/products"
              className="text-sm text-[#B9A5E8] hover:text-[#D8C9F5] transition-colors"
            >
              View all
            </Link>
          </div>

          {recentProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {recentProducts.map((p) => (
                <Link key={p._id} href="/admin/products" className="group block">
                  <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[#1d1830] border border-[#2a2342] transition-colors duration-200 group-hover:border-[#B9A5E8]/40">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`${p.imageUrl}?w=600&auto=format`}
                        alt={p.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[13px] text-white/60">
                        No photo
                      </div>
                    )}
                    {p.inStock === false && (
                      <span className="absolute top-3 left-3 h-6 px-2.5 inline-flex items-center rounded-full bg-black/70 text-[11px] font-medium text-red-300">
                        Out of stock
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-[13px] text-white/60 truncate">
                    {[p.category, formatPrice(p.price)].filter(Boolean).join(" · ")}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[20px] border border-[#1e1e1e] bg-white/[0.02] px-6 py-12 text-center">
              <p className={`${display.className} text-[26px] text-white`}>
                Add your first product
              </p>
              <p className="mt-2 text-sm text-white/60">
                Products you add show up here, newest first.
              </p>
              <Link
                href="/admin/products/new"
                className="mt-6 inline-flex items-center justify-center h-11 px-5 rounded-full border border-[#2a2342] text-sm text-white/85 hover:border-[#B9A5E8]/50 hover:text-white transition-colors"
              >
                Add new product
              </Link>
            </div>
          )}
        </div>

        {/* Categories */}
        <div>
          <h2 className={`${display.className} text-[32px] font-normal text-white mb-2`}>
            Categories
          </h2>
          <p className="text-sm text-white/60 mb-4">
            {stats.categories} active {stats.categories === 1 ? "category" : "categories"}
          </p>

          {categories.length > 0 ? (
            <div className="border-b border-[#1e1e1e]">
              {categories.map((c) => (
                <Link
                  key={c._id}
                  href="/admin/categories"
                  className="group flex items-center justify-between min-h-14 border-t border-[#1e1e1e] transition-colors"
                >
                  <span
                    className={`${display.className} text-2xl text-white group-hover:text-[#D8C9F5] transition-colors`}
                  >
                    {c.title}
                  </span>
                  <span className="text-[13px] text-white/60 group-hover:text-white transition-colors">
                    Manage
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border-t border-b border-[#1e1e1e] py-6">
              <p className="text-sm text-white/60">
                No categories yet. Create one to organise your products.
              </p>
              <Link
                href="/admin/categories"
                className="mt-3 inline-block text-sm text-[#B9A5E8] hover:text-[#D8C9F5] transition-colors"
              >
                Add a category
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-2.5 mt-7">
            <Link
              href="/admin/products"
              className="flex items-center justify-center h-12 rounded-full border border-[#2a2342] text-sm text-white/85 transition-colors duration-200 hover:border-[#B9A5E8]/50 hover:text-white"
            >
              Manage products
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center h-12 rounded-full border border-[#2a2342] text-sm text-white/85 transition-colors duration-200 hover:border-[#B9A5E8]/50 hover:text-white"
            >
              View live website
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}