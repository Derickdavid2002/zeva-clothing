"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { MdMenu, MdClose, MdPending } from "react-icons/md"
import { display } from "@/lib/fonts"

const ADMIN_NAME = "Zeva Admin"

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", section: "main" },
  { href: "/admin/orders", label: "Orders", section: "main", badge: "orders" },
  { href: "/admin/products", label: "Products", section: "manage" },
  { href: "/admin/categories", label: "Categories", section: "manage" },
  { href: "/admin/settings", label: "Settings", section: "store" },
  { href: "/", label: "View website", section: "store" },
]

const SECTIONS = [
  { key: "main", label: "Main" },
  { key: "manage", label: "Manage" },
  { key: "store", label: "Store" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pendingOrders, setPendingOrders] = useState(0)

  // Fetch pending orders count every 30 seconds
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch("/api/orders?admin=true", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          const pending = data.filter((o: any) => o.status === "pending").length
          setPendingOrders(pending)
        }
      } catch {
        // silent fail
      }
    }

    fetchPending()
    const interval = setInterval(fetchPending, 30000)
    return () => clearInterval(interval)
  }, [])

  // Close the mobile drawer with the Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/admin/dashboard" && href !== "/" && pathname.startsWith(href))

  const renderNavItem = (item: (typeof NAV_ITEMS)[0]) => {
    const active = isActive(item.href)

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setSidebarOpen(false)}
        aria-current={active ? "page" : undefined}
        className={`group flex items-center gap-3 h-11 px-3.5 rounded-xl no-underline outline-none transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-[#B9A5E8]/50 ${
          active ? "bg-[#B9A5E8]/[0.12]" : "hover:bg-white/[0.04]"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200 ${
            active ? "bg-[#B9A5E8]" : "bg-transparent group-hover:bg-white/25"
          }`}
        />
        <span
          className={`flex-1 text-[14px] transition-colors duration-200 ${
            active
              ? "text-[#B9A5E8] font-medium"
              : "text-white/70 group-hover:text-white"
          }`}
        >
          {item.label}
        </span>

        {item.badge === "orders" && pendingOrders > 0 && (
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-medium bg-[#f59e0b] text-[#1a1000]">
            {pendingOrders > 9 ? "9+" : pendingOrders}
          </span>
        )}
      </Link>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-9">
        <p
          className={`${display.className} pl-3.5 text-[26px] font-medium tracking-[0.14em] text-[#B9A5E8] leading-none`}
        >
          ZEVA
        </p>
        <p className="pl-3.5 mt-1.5 text-[13px] text-white/60">Admin panel</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-5 pt-10 pb-6 flex flex-col gap-1">
        {NAV_ITEMS.map(renderNavItem)}
      </nav>

      <div className="mx-5 mb-7 pt-5 border-t border-[#1e1e1e] flex items-center gap-3">
        <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center flex-shrink-0 bg-[#B9A5E8] text-[#1a1226] font-medium">
          {ADMIN_NAME.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-[14px] font-medium leading-tight truncate">
            {ADMIN_NAME}
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-[13px] text-white/60 hover:text-white transition-colors cursor-pointer outline-none focus-visible:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: "#060606" }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-[232px] flex-shrink-0 sticky top-0 h-screen"
        style={{ background: "#0a0a0a", borderRight: "1px solid #1e1e1e" }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile header */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
        style={{
          background: "rgba(10,10,10,0.9)",
          borderBottom: "1px solid #1e1e1e",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <p
          className={`${display.className} text-[22px] font-medium tracking-[0.14em] text-[#B9A5E8]`}
        >
          ZEVA
        </p>
        <div className="flex items-center gap-2">
          {pendingOrders > 0 && (
            <div
              className="flex items-center gap-1.5 px-2.5 h-7 rounded-full"
              style={{
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.25)",
              }}
            >
              <MdPending size={12} className="text-amber-400" />
              <span className="text-amber-400 text-[11px] font-medium">
                {pendingOrders}
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen}
            className="w-11 h-11 flex items-center justify-center rounded-xl text-white/70 outline-none transition-colors duration-200 hover:text-white hover:bg-white/[0.08] focus-visible:ring-1 focus-visible:ring-[#B9A5E8]/50"
          >
            {sidebarOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.7)" }}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile sidebar drawer */}
      <aside
        className="md:hidden fixed top-0 left-0 h-full w-[270px] z-50 transition-transform duration-300 ease-out"
        style={{
          background: "#0a0a0a",
          borderRight: "1px solid #1e1e1e",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="md:hidden h-14" />
        <div className="w-full max-w-[1060px] mx-auto px-5 md:px-14 pt-8 md:pt-12 pb-16">
          {children}
        </div>
      </main>
    </div>
  )
}