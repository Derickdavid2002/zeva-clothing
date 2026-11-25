
"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { display } from "@/lib/fonts"
import {
  FaBoxOpen,
  FaLayerGroup,
  FaShoppingBag,
  FaArrowRight,
  FaSignOutAlt,
  FaPalette,
  FaStore,
  FaShieldAlt,
} from "react-icons/fa"

const PALETTE = [
  { name: "Black", hex: "#0A0A0A" },
  { name: "Lilac", hex: "#B9A5E8" },
  { name: "Soft Lilac", hex: "#D8C9F5" },
  { name: "Deep Purple", hex: "#8063B5" },
]

const SHORTCUTS = [
  {
    href: "/admin/products/new",
    title: "Add a product",
    text: "Upload product photos and publish new arrivals.",
    icon: FaBoxOpen,
    number: "01",
  },
  {
    href: "/admin/categories",
    title: "Categories",
    text: "Manage the collections shoppers browse.",
    icon: FaLayerGroup,
    number: "02",
  },
  {
    href: "/admin/orders",
    title: "Orders",
    text: "View and manage customer purchases.",
    icon: FaShoppingBag,
    number: "03",
  },
]

const card =
  "rounded-2xl border border-white/[0.07] bg-[#0D0B11]"

export default function SettingsClient() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-10">

      {/* HEADER */}
      <header className="relative overflow-hidden rounded-2xl border border-[#B9A5E8]/15 bg-[#100D16] p-7 md:p-10">
        <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#8063B5]/15 blur-[100px]" />

        <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-px w-7 bg-[#B9A5E8]" />
              <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#B9A5E8]">
                Store Management
              </p>
            </div>

            <h1
              className={`${display.className} text-5xl font-light leading-none tracking-tight text-white md:text-6xl`}
            >
              Settings<span className="text-[#B9A5E8]">.</span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/40">
              Manage your store identity, explore quick actions and
              keep your Zeva administration organised.
            </p>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-[9px] uppercase tracking-[3px] text-white/30">
              Your workspace
            </p>
            <p className="mt-2 text-sm font-medium text-[#D8C9F5]">
              ZEVA COLLECTION
            </p>
          </div>
        </div>
      </header>

      {/* ADMIN PROFILE */}
      <section className={`${card} relative overflow-hidden p-6 md:p-8`}>
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#8063B5]/10 blur-[80px]" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-5">
            <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl border border-[#B9A5E8]/30 bg-gradient-to-br from-[#D8C9F5] to-[#8063B5] text-3xl font-semibold text-[#17101F] shadow-[0_8px_30px_rgba(128,99,181,0.2)]">
              Z
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[3px] text-[#B9A5E8]">
                Administrator
              </p>
              <h2 className={`${display.className} mt-1 text-3xl text-white`}>
                Zeva Admin
              </h2>
              <p className="mt-1 text-xs text-white/35">
                Store management account
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="inline-flex h-11 items-center justify-center gap-3 rounded-full border border-red-400/20 px-6 text-xs font-medium text-red-300 transition-all hover:border-red-400/50 hover:bg-red-400/[0.08]"
          >
            <FaSignOutAlt size={13} />
            Sign out
          </button>
        </div>
      </section>

      {/* STORE IDENTITY */}
      <section className={`${card} overflow-hidden`}>
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-5 md:px-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B9A5E8]/10 text-[#B9A5E8]">
            <FaStore size={16} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              Store identity
            </h2>
            <p className="mt-1 text-xs text-white/35">
              Your brand and visual identity
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[3px] text-[#B9A5E8]">
                Brand name
              </p>
              <h3
                className={`${display.className} mt-2 text-4xl text-white md:text-5xl`}
              >
                Zeva Collection
              </h3>
              <p className="mt-2 text-xs text-white/35">
                Fashion · Beauty · Lifestyle
              </p>
            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#B9A5E8]/20 bg-[#B9A5E8]/[0.07]">
              <span className={`${display.className} text-4xl text-[#D8C9F5]`}>
                Z
              </span>
            </div>
          </div>

          
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[3px] text-[#B9A5E8]">
              Quick Navigation
            </p>
            <h2 className={`${display.className} mt-2 text-3xl text-white`}>
              Manage your store
            </h2>
          </div>

          <span className="text-[10px] text-white/30">
            03 SHORTCUTS
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SHORTCUTS.map((shortcut) => {
            const Icon = shortcut.icon

            return (
              <Link
                key={shortcut.href}
                href={shortcut.href}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0D0B11] p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[#B9A5E8]/40 hover:bg-[#111015]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#B9A5E8]/15 bg-[#B9A5E8]/[0.07] text-[#B9A5E8] transition-colors group-hover:bg-[#B9A5E8]/15">
                    <Icon size={18} />
                  </div>

                  <span className="text-[10px] tracking-[2px] text-white/20">
                    {shortcut.number}
                  </span>
                </div>

                <h3
                  className={`${display.className} mt-8 text-[27px] leading-tight text-white transition-colors group-hover:text-[#D8C9F5]`}
                >
                  {shortcut.title}
                </h3>

                <p className="mt-3 min-h-10 text-xs leading-6 text-white/40">
                  {shortcut.text}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
                  <span className="text-[9px] font-semibold uppercase tracking-[2px] text-white/35 transition-colors group-hover:text-[#B9A5E8]">
                    Open section
                  </span>

                  <FaArrowRight
                    size={12}
                    className="text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#B9A5E8]"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* STORE READINESS NOTE */}
    

      {/* BOTTOM BRANDING */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 sm:flex-row">
        <p className="text-[9px] uppercase tracking-[3px] text-white/25">
          ZEVA COLLECTION
        </p>
        <p className="text-[10px] text-white/25">
          Your store. Your identity. Your style.
        </p>
      </div>
    </div>
  )
}
