
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "../store/cartStore";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const { items, openCart } = useCartStore();

  const cartCount = items.reduce((a, i) => a + i.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact" },
  ];

  const socials = [
    ...(process.env.NEXT_PUBLIC_WHATSAPP_URL
      ? [{
          href: process.env.NEXT_PUBLIC_WHATSAPP_URL,
          icon: FaWhatsapp,
          label: "WhatsApp",
          hoverColor: "hover:text-[#25D366]",
        }]
      : []),
    ...(process.env.NEXT_PUBLIC_INSTAGRAM_URL
      ? [{
          href: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
          icon: FaInstagram,
          label: "Instagram",
          hoverColor: "hover:text-[#E1306C]",
        }]
      : []),
    ...(process.env.NEXT_PUBLIC_TIKTOK_URL
      ? [{
          href: process.env.NEXT_PUBLIC_TIKTOK_URL,
          icon: FaTiktok,
          label: "TikTok",
          hoverColor: "hover:text-[#69C9D0]",
        }]
      : []),
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-5 md:px-12 transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-[#060606]/97 backdrop-blur-xl border-b border-[#1e1e1e] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="relative max-w-[1280px] mx-auto flex items-center justify-between h-[80px]">

          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center shrink-0">
            <Image
              src="/logo.jpg"
              alt="Zeva Collection"
              width={150}
              height={55}
              priority
              className="w-[125px] md:w-[150px] h-auto object-contain"
            />
          </Link>

          {/* Center navigation */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
            {links.map(({ href, label }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className="relative text-[11px] font-medium tracking-[2px] uppercase no-underline transition-all duration-200 pb-1"
                  style={{
                    color: active ? "#B9A5E8" : "rgba(255,255,255,0.5)",
                    textShadow: active
                      ? "0 0 12px rgba(185,165,232,0.6)"
                      : "none",
                  }}
                >
                  {label}

                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-all duration-300"
                    style={{
                      background: "#B9A5E8",
                      boxShadow: "0 0 8px #B9A5E8",
                      opacity: active ? 1 : 0,
                      transform: active ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center gap-5 ml-auto">

            {/* Social icons */}
            {socials.length > 0 && (
              <div className="flex items-center gap-4 border-r border-[#1e1e1e] pr-6">
                {socials.map(({ href, icon: Icon, label, hoverColor }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    title={label}
                    className={`text-white/30 transition-colors duration-200 ${hoverColor}`}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                cartCount > 0
                  ? "bg-[#B9A5E8]/10 border-[#B9A5E8]/40 shadow-[0_0_20px_rgba(185,165,232,0.2)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <HiOutlineShoppingBag
                size={18}
                className={cartCount > 0 ? "text-[#B9A5E8]" : "text-white/60"}
              />

              <span
                className={`text-[12px] font-semibold ${
                  cartCount > 0 ? "text-[#B9A5E8]" : "text-white/50"
                }`}
              >
                Cart
              </span>

              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#B9A5E8] text-white text-[10px] font-black flex items-center justify-center"
                  style={{ boxShadow: "0 0 10px #B9A5E8" }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile right section */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={openCart}
              aria-label="Open cart"
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl border transition-all cursor-pointer ${
                cartCount > 0
                  ? "bg-[#B9A5E8]/10 border-[#B9A5E8]/40"
                  : "bg-white/5 border-[#1e1e1e]"
              }`}
            >
              <HiOutlineShoppingBag
                size={18}
                className={cartCount > 0 ? "text-[#B9A5E8]" : "text-white/60"}
              />

              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#B9A5E8] text-white text-[9px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="w-10 h-10 flex items-center justify-center bg-white/5 border border-[#1e1e1e] rounded-xl cursor-pointer text-white/60 hover:text-white transition-colors"
            >
              {menuOpen ? <RxCross2 size={18} /> : <RxHamburgerMenu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-[80px] left-0 right-0 z-40 md:hidden bg-[#060606]/98 backdrop-blur-xl border-b border-[#1e1e1e] transition-all duration-300 ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex flex-col px-6 py-4 gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-4 no-underline transition-colors"
                style={{
                  color: active ? "#B9A5E8" : "rgba(255,255,255,0.4)",
                  borderBottom: "1px solid #1e1e1e",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {label}

                {active && (
                  <span
                    className="w-8 h-[2px] rounded-full"
                    style={{
                      background: "#B9A5E8",
                      boxShadow: "0 0 8px #B9A5E8",
                    }}
                  />
                )}
              </Link>
            );
          })}

          {/* Mobile socials */}
          {socials.length > 0 && (
            <div className="flex gap-5 pt-5 pb-2 flex-wrap">
              {socials.map(({ href, icon: Icon, label, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-2 text-white/30 text-xs tracking-widest no-underline transition-colors ${hoverColor}`}
                >
                  <Icon size={15} />
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
