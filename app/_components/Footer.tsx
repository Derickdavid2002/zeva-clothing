import Link from "next/link"
import Image from "next/image"
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa"
import { display } from "@/lib/fonts"

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop all" },
  { href: "/contact", label: "Contact" },
]

const SOCIALS = [
  { href: process.env.NEXT_PUBLIC_WHATSAPP_URL, icon: FaWhatsapp, label: "WhatsApp" },
  { href: process.env.NEXT_PUBLIC_INSTAGRAM_URL, icon: FaInstagram, label: "Instagram" },
  { href: process.env.NEXT_PUBLIC_TIKTOK_URL, icon: FaTiktok, label: "TikTok" },
].filter((s) => s.href)

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#B9A5E8]/15 bg-[#07060A] text-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-12">
        <div className="flex flex-col items-start justify-between gap-10 py-14 md:flex-row md:items-center md:py-16">
          <Link href="/" className="inline-block no-underline">
            <Image
              src="/logo.jpg"
              alt="Zeva Collection"
              width={220}
              height={120}
              className="h-auto w-[130px] object-contain md:w-[150px]"
            />
          </Link>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`${display.className} text-[26px] leading-none text-white/85 no-underline transition-colors hover:text-[#B9A5E8]`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {SOCIALS.length > 0 && (
            <div className="flex gap-2.5">
              {SOCIALS.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors duration-200 hover:border-[#B9A5E8]/50 hover:bg-[#B9A5E8]/10 hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t border-white/[0.08] py-6 text-[13px] text-white/60">
          <p>
            {/* The © is a quiet link to the admin login: only the owner knows it's there */}
            <Link href="/admin" tabIndex={-1} className="text-inherit no-underline cursor-default">
              ©
            </Link>{" "}
            {new Date().getFullYear()} Zeva Collection
          </p>
        </div>
      </div>

      {/* Giant wordmark */}
      <div aria-hidden="true" className="select-none overflow-hidden">
        <p
          className={`${display.className} -mb-[3vw] bg-gradient-to-b from-[#B9A5E8]/45 to-[#B9A5E8]/0 bg-clip-text text-center text-[28vw] font-light leading-[0.82] tracking-[0.04em] text-transparent`}
        >
          ZEVA
        </p>
      </div>
    </footer>
  )
}