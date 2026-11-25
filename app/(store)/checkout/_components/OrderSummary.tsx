
"use client"

import Image from "next/image"
import { urlFor } from "@/lib/sanity"
import { CartItem } from "../../../store/cartStore"
import {
  MdLock,
  MdShoppingBag,
  MdLocalShipping,
  MdCheckCircle,
} from "react-icons/md"

const fmt = (n: number) => `₦${n.toLocaleString("en-NG")}`

export default function OrderSummary({
  items,
  subtotal,
  deliveryFee,
  total,
  state,
}: {
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  state: string
}) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-[#39284D] bg-[#17121F] shadow-[0_20px_70px_rgba(0,0,0,0.3)]">

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#76549C]/15 blur-[85px]" />

      {/* Header */}
      <div className="relative border-b border-white/[0.07] px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[2.5px] text-[#B99AEF]">
              Your selection
            </p>

            <h3 className="text-xl font-bold tracking-tight text-white">
              Order Summary
            </h3>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#76549C]/30 bg-[#76549C]/15 text-[#C4A6F2]">
            <MdShoppingBag size={22} />
          </div>
        </div>

        <p className="mt-2 text-xs text-white/40">
          {items.length} {items.length === 1 ? "product" : "products"} in your bag
        </p>
      </div>

      {/* Products */}
      <div className="relative space-y-4 px-6 py-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-3"
          >
            <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl border border-[#49345F] bg-[#100D16]">
              {item.image && (
                <Image
                  src={urlFor(item.image).width(160).height(160).url()}
                  alt={item.name}
                  fill
                  sizes="68px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-white">
                {item.name}
              </p>

              <p className="mt-1 text-xs text-white/40">
                Quantity: {item.qty}
              </p>

              <p className="mt-1 text-[11px] text-[#B99AEF]">
                {fmt(item.price)} each
              </p>
            </div>

            <p className="shrink-0 text-sm font-bold text-white">
              {fmt(item.price * item.qty)}
            </p>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="relative mx-6 border-t border-white/[0.08] py-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-white/45">Subtotal</span>
          <span className="text-sm font-semibold text-white">
            {fmt(subtotal)}
          </span>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-white/45">
            <MdLocalShipping className="text-[#B99AEF]" size={17} />
            Delivery {state && `(${state})`}
          </span>

          {deliveryFee > 0 ? (
            <span className="text-sm font-semibold text-white">
              {fmt(deliveryFee)}
            </span>
          ) : (
            <span className="text-xs font-medium text-[#C4A6F2]">
              To be confirmed
            </span>
          )}
        </div>

        {deliveryFee === 0 && state && (
          <div className="mb-5 rounded-xl border border-[#76549C]/25 bg-[#76549C]/10 px-3 py-3">
            <p className="text-[11px] leading-5 text-white/55">
              Your delivery fee will be communicated after your order is
              confirmed.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-white/[0.08] pt-5">
          <div>
            <p className="text-sm font-semibold text-white">Total</p>
            <p className="mt-1 text-[10px] text-white/35">
              {deliveryFee > 0
                ? "Including delivery"
                : "Delivery fee pending"}
            </p>
          </div>

          <p className="text-2xl font-black tracking-tight text-[#C4A6F2]">
            {fmt(total)}
          </p>
        </div>
      </div>

      {/* Trust information */}
      <div className="relative space-y-3 border-t border-white/[0.07] bg-[#100D16]/60 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#76549C]/15 text-[#B99AEF]">
            <MdLock size={16} />
          </div>

          <div>
            <p className="text-xs font-semibold text-white">
              Secure payment process
            </p>
            <p className="mt-0.5 text-[10px] text-white/40">
              Bank transfer verified before shipping
            </p>
          </div>

          <MdCheckCircle className="ml-auto text-[#B99AEF]" size={17} />
        </div>
      </div>
    </div>
  )
}
