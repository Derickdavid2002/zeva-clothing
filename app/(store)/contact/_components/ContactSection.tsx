"use client"

import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa"
import { display } from "@/lib/fonts"

const CHANNELS = [
  {
    icon: FaWhatsapp,
    name: "WhatsApp",
    description: "Talk to us about products and orders.",
    cta: "Send a message",
    href: process.env.NEXT_PUBLIC_WHATSAPP_URL,
    color: "#25D366",
  },
  {
    icon: FaInstagram,
    name: "Instagram",
    description: "Discover our latest collections.",
    cta: "Follow along",
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    color: "#E1306C",
  },
  {
    icon: FaTiktok,
    name: "TikTok",
    description: "See more of the Zeva experience.",
    cta: "Watch now",
    href: process.env.NEXT_PUBLIC_TIKTOK_URL,
    color: "#69C9D0",
  },
]

export default function ContactSection() {
  const channels = CHANNELS.filter((c) => c.href)
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_URL

  return (
    <main className="min-h-screen overflow-hidden bg-[#070609] text-white">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(128,99,181,0.2),transparent_65%)]" />
        <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-28 text-center md:pb-28 md:pt-36">
          <p className="inline-flex items-center gap-2.5 text-sm text-[#B9A5E8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B9A5E8]" />
            We&apos;re just a message away
          </p>

          <h1
            className={`${display.className} mt-6 text-[52px] font-light leading-[1.02] tracking-[-0.01em] sm:text-7xl md:text-[88px]`}
          >
            Let&apos;s make
            <span className="block italic text-[#B9A5E8]">something happen.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-white/65 md:text-lg">
            Have a question, need a hand with an order, or just want to say hello? Pick the
            channel that suits you and we&apos;ll take it from there.
          </p>

          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#B9A5E8] px-8 text-sm font-medium text-[#1a1226] no-underline transition-colors duration-200 hover:bg-[#D8C9F5]"
            >
              <FaWhatsapp size={18} />
              Message us on WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* Channels */}
      <section className="mx-auto max-w-5xl px-6 pb-24 md:pb-32">
        <h2 className={`${display.className} mb-10 text-center text-[34px] font-normal md:text-[44px]`}>
          Find us here
        </h2>

        {channels.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4">
            {channels.map((c) => {
              const Icon = c.icon
              return (
                <a
                  key={c.name}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex w-full basis-[280px] flex-1 max-w-[360px] flex-col rounded-[28px] border border-[#2a2342] bg-[#0D0B11] p-7 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[#B9A5E8]/50 hover:bg-[#121018]"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                    <Icon size={24} style={{ color: c.color }} />
                  </span>
                  <span className={`${display.className} mt-8 text-[30px] leading-none text-white`}>
                    {c.name}
                  </span>
                  <span className="mt-3 flex-1 text-sm leading-7 text-white/60">{c.description}</span>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm text-[#B9A5E8] transition-colors group-hover:text-[#D8C9F5]">
                    {c.cta}
                    <span aria-hidden="true">↗</span>
                  </span>
                </a>
              )
            })}
          </div>
        ) : (
          <p className="mx-auto max-w-md rounded-[28px] border border-[#2a2342] bg-[#0D0B11] p-8 text-center text-sm text-white/60">
            Our social channels will be available here soon.
          </p>
        )}
      </section>

      {/* Closing note */}
      <section className="border-t border-white/[0.08] px-6 py-20 text-center md:py-28">
        <p className={`${display.className} mx-auto max-w-2xl text-[30px] font-light italic leading-snug text-[#D8C9F5] md:text-[42px]`}>
          &ldquo;Your style tells your story. We&apos;re glad to be part of it.&rdquo;
        </p>
        <p className="mt-6 text-sm text-white/60">Zeva Collection</p>
      </section>
    </main>
  )
}