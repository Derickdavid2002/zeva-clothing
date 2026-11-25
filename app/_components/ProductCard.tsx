"use client"

import { useState } from "react"
import type { MouseEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { Product } from "../types"
import { useCartStore } from "../store/cartStore"
import { urlFor } from "@/lib/sanity"

const fmt = (n: number) => `₦${n.toLocaleString()}`

export default function ProductCard({
  product,
}: {
  product: Product
}) {
  const router = useRouter()
  const [added, setAdded] = useState(false)

  const addItem = useCartStore((state) => state.addItem)

  const cartItem = useCartStore((state) =>
    state.items.find((item) => item._id === product._id)
  )

  const stock = Math.max(0, Number(product.stock ?? 0))

  const available = product.inStock !== false && stock > 0

  const reachedStockLimit = (cartItem?.qty || 0) >= stock

  const canAddToCart = available && !reachedStockLimit

  const handleAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!canAddToCart) return

    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug.current,
      stock,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className="group relative min-w-0 transition-transform duration-200 active:scale-[0.98]">
      <div className="rounded-2xl bg-[#14111B] p-1.5 ring-1 ring-white/[0.07] transition-all duration-300 sm:group-hover:-translate-y-1 sm:group-hover:ring-[#C4B5FD]/40 sm:group-hover:shadow-[0_18px_40px_-18px_rgba(124,58,237,0.55)]">

        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#1B1724]">
          {product.image ? (
            <Image
              src={urlFor(product.image).width(500).height(625).url()}
              alt={product.name}
              fill
              sizes="(max-width: 639px) 46vw, (max-width: 1023px) 30vw, 20vw"
              className={`object-cover transition-transform duration-700 ease-out sm:group-hover:scale-[1.07] ${
                available ? "" : "opacity-50 grayscale"
              }`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-3xl italic text-[#C4B5FD]/30">
                Z.
              </span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Category */}
          {product.category && (
            <span className="absolute left-2 top-2 max-w-[70%] truncate rounded-full bg-black/45 px-2 py-1 text-[8px] uppercase tracking-[1.5px] text-white/90 backdrop-blur-md">
              {product.category}
            </span>
          )}

          {/* Available Stock */}
          <span
            className={`absolute bottom-2 left-2 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md ${
              !available
                ? "border-white/20 bg-black/70 text-white/60"
                : stock <= 3
                  ? "border-amber-400/30 bg-black/70 text-amber-300"
                  : "border-emerald-400/30 bg-black/70 text-emerald-300"
            }`}
          >
            {!available
              ? "Out of Stock"
              : stock === 1
                ? "1 Left"
                : `${stock} Available`}
          </span>

          {/* Quick Add */}
          {available && (
            <button
              type="button"
              onClick={handleAdd}
              disabled={!canAddToCart}
              aria-label={`Add ${product.name} to cart`}
              title={
                reachedStockLimit
                  ? "You've added all available stock"
                  : "Add to cart"
              }
              className={`absolute bottom-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full text-[16px] font-medium leading-none text-[#100C18] shadow-[0_6px_18px_rgba(0,0,0,0.45)] transition-all duration-300 after:absolute after:-inset-2 after:content-[''] active:scale-90 sm:hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40 ${
                added
                  ? "bg-emerald-400"
                  : "bg-[#C4B5FD] sm:hover:bg-white"
              }`}
            >
              {added ? "✓" : reachedStockLimit ? "✓" : "+"}
            </button>
          )}
        </div>

        {/* Product Information */}
        <div className="px-1.5 pb-1.5 pt-2.5">
          <h3 className="min-h-[2.5em] font-serif text-[13px] leading-snug text-white/90 transition-colors sm:min-h-0 sm:text-[14px] sm:group-hover:text-[#D6C8FF]">
            <Link
              href={`/shop/${product.slug.current}`}
              className="line-clamp-2 no-underline after:absolute after:inset-0 after:z-10 sm:line-clamp-1"
            >
              {product.name}
            </Link>
          </h3>

          <p className="mt-0.5 text-[12px] font-medium text-[#C4B5FD]">
            {fmt(product.price)}
          </p>
        </div>
      </div>
    </article>
  )
}