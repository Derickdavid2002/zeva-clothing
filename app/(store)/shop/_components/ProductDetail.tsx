
"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCartStore } from "../../../store/cartStore"
import { urlFor } from "@/lib/sanity"
import type { Product } from "../../../types/index"

const fmt = (n: number) => `₦${n.toLocaleString()}`

export default function ProductDetail({
  product,
}: {
  product: Product
}) {
  const [added, setAdded] = useState(false)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const addItem = useCartStore((state) => state.addItem)

  const gallery = [product.image, ...(product.images || [])].filter(
    Boolean
  )

  const stock = Math.max(0, Number(product.stock ?? 0))
  const available = product.inStock && stock > 0
  const canPurchase = available && qty <= stock

  const handleAddToCart = () => {
    if (!canPurchase) return

    addItem(
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug.current,
        stock,
      },
      qty
    )

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const whatsappMessage = encodeURIComponent(
    `Hello! I'd like to order ${product.name} x${qty}.`
  )

  return (
    <div className="min-h-screen w-full bg-[#060606]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-12 sm:py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/30 sm:mb-12">
          <Link
            href="/"
            className="transition-colors hover:text-[#B9A5E8]"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            href="/shop"
            className="transition-colors hover:text-[#B9A5E8]"
          >
            Shop
          </Link>

          <span>/</span>

          <span className="text-white/60">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Product Gallery */}
          <div className="min-w-0">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#111]">
              {gallery[activeImage] && (
                <Image
                  key={activeImage}
                  src={urlFor(gallery[activeImage])
                    .width(1000)
                    .height(1000)
                    .url()}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover transition-opacity duration-300"
                />
              )}

              <span className="absolute left-4 top-4 rounded-full border border-[#B9A5E8]/40 bg-black/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#B9A5E8] backdrop-blur">
                {product.category}
              </span>

              {!available && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <span className="text-lg font-bold uppercase tracking-widest text-white/60">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                {gallery.map((photo, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 sm:h-20 sm:w-20 ${
                      activeImage === index
                        ? "border-[#B9A5E8]"
                        : "border-[#30283d]"
                    }`}
                  >
                    <Image
                      src={urlFor(photo)
                        .width(160)
                        .height(160)
                        .url()}
                      alt={`${product.name} photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-black text-[#B9A5E8]">
                  {fmt(product.price)}
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${
                    available
                      ? "border-green-500/20 bg-green-500/10 text-green-500"
                      : "border-white/10 bg-white/5 text-white/40"
                  }`}
                >
                  {available
                    ? `${stock} Available`
                    : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-[#B9A5E8]/30 to-transparent" />

            {/* Description */}
            <p className="text-base leading-relaxed text-white/60">
              {product.description}
            </p>

            <div className="h-px bg-gradient-to-r from-[#B9A5E8]/30 to-transparent" />

            {/* Quantity and Cart */}
            {available && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase tracking-widest text-white/50">
                    Quantity
                  </span>

                  <div className="flex items-center gap-3 rounded-xl border border-[#1e1e1e] bg-white/5 p-1">
                    <button
                      type="button"
                      onClick={() =>
                        setQty((q) => Math.max(1, q - 1))
                      }
                      disabled={qty <= 1}
                      className="h-9 w-9 rounded-lg text-white/60 disabled:opacity-30"
                    >
                      −
                    </button>

                    <span className="min-w-7 text-center font-bold text-white">
                      {qty}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQty((q) => Math.min(q + 1, stock))
                      }
                      disabled={qty >= stock}
                      className="h-9 w-9 rounded-lg text-white/60 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canPurchase}
                  className="w-full rounded-xl py-5 text-sm font-bold uppercase tracking-[2px] text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    background: added
                      ? "linear-gradient(135deg, #166534, #15803d)"
                      : "linear-gradient(135deg, #B9A5E8, #8063B5)",
                  }}
                >
                  {added
                    ? "✓ Added to Cart"
                    : `Add ${qty > 1 ? `${qty} Items` : "to Cart"}`}
                </button>

                {/* WhatsApp order link intentionally preserved as commented code */}
                {/* {process.env.NEXT_PUBLIC_WHATSAPP_URL && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_WHATSAPP_URL}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-center text-sm text-white/50 transition-colors hover:text-[#B9A5E8]"
                  >
                    Order via WhatsApp
                  </a>
                )} */}
              </div>
            )}

            {/* Trust Tags */}
            <div className="mt-2 flex flex-wrap gap-3">
              {[
                "Premium Quality",
                "Fast Delivery",
                "100% Authentic",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#1e1e1e] px-3 py-1.5 text-[11px] text-white/40"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="mt-16">
          <Link
            href="/shop"
            className="text-sm text-white/40 transition-colors hover:text-[#B9A5E8]"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
