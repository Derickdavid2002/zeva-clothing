"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, MouseEvent } from "react";

const TICKER = ["FASHION", "BEAUTY", "INDIVIDUALITY", "STYLE WITHOUT LIMITS"];

// EDIT these so they match your real store policies
const PERKS = ["Secure checkout", "Fast delivery", "Easy returns"];

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export default function Hero() {
  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    e.currentTarget.style.setProperty("--mx", x.toFixed(3));
    e.currentTarget.style.setProperty("--my", y.toFixed(3));
  };

  const handleLeave = (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--mx", "0");
    e.currentTarget.style.setProperty("--my", "0");
  };

  return (
    <section
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative isolate overflow-hidden bg-[#08030D] text-white"
    >
      <style>{`
        @keyframes zevaMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes zevaSpin    { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes zevaFloat   { 0%,100% { transform: translateY(0) rotate(0deg); opacity: .9; } 50% { transform: translateY(-16px) rotate(25deg); opacity: .4; } }
        @keyframes zevaRise    { from { opacity: 0; transform: translateY(105%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zevaFade    { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zevaShine   { from { background-position: 0% 0; } to { background-position: 200% 0; } }

        .zeva-rise   { animation: zevaRise .95s cubic-bezier(.2,.7,.2,1) both; animation-delay: var(--d, 0s); }
        .zeva-fade   { animation: zevaFade .8s ease-out both; animation-delay: var(--d, 0s); }
        .zeva-shine  {
          background: linear-gradient(90deg, #B65CFF 0%, #F6E3FF 25%, #B65CFF 50%, #F6E3FF 75%, #B65CFF 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          animation: zevaRise .95s cubic-bezier(.2,.7,.2,1) .15s both, zevaShine 5s linear infinite;
        }
        .zeva-spin      { animation: zevaSpin 16s linear infinite; }
        .zeva-spin-slow { animation: zevaSpin 45s linear infinite; }
        .zeva-float     { animation: zevaFloat 5s ease-in-out infinite; animation-delay: var(--d, 0s); }
        .zeva-marquee   { animation: zevaMarquee 34s linear infinite; }
        .zeva-marquee-wrap:hover .zeva-marquee { animation-play-state: paused; }

        @media (prefers-reduced-motion: reduce) {
          .zeva-rise, .zeva-fade, .zeva-spin, .zeva-spin-slow, .zeva-float, .zeva-marquee { animation: none !important; }
          .zeva-shine { animation: none !important; }
        }
      `}</style>

      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 top-0 h-[560px] w-[560px] rounded-full bg-[#7515B8]/30 blur-[150px]" />
        <div className="absolute -left-32 bottom-10 h-[360px] w-[360px] rounded-full bg-[#501078]/25 blur-[130px]" />
      </div>

      {/* Giant outlined word behind the portrait */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-[-2%] top-1/2 -z-10 hidden -translate-y-1/2 select-none font-serif text-[clamp(220px,26vw,420px)] leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(199,122,255,0.22)] lg:block"
      >
        ZEVA
      </span>

      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 pb-14 pt-8 sm:px-10 lg:min-h-[740px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-16 lg:pb-20 lg:pt-10">
        {/* ───────── Portrait ───────── */}
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="relative w-[78%] max-w-[320px] sm:max-w-[400px] lg:w-full lg:max-w-[470px]">
            {/* Orbit ring with glowing dot */}
            <div className="pointer-events-none absolute inset-x-[-16%] top-1/2 -z-10 -translate-y-1/2">
              <div className="zeva-spin-slow relative aspect-square rounded-full border border-dashed border-[#C77AFF]/30">
                <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C77AFF] shadow-[0_0_18px_#C77AFF]" />
              </div>
            </div>

            {/* Tilting arch */}
            <div
              className="relative"
              style={{
                transform:
                  "perspective(1100px) rotateY(calc(var(--mx, 0) * 9deg)) rotateX(calc(var(--my, 0) * -9deg))",
                transition: "transform 0.18s ease-out",
              }}
            >
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-[999px] border border-[#C77AFF]/50 lg:translate-x-4 lg:translate-y-4" />

              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-[#1a0a24] shadow-[0_30px_80px_-20px_rgba(117,21,184,0.6)]">
                <Image
                  src="/zeva-model.jpg"
                  alt="ZEVA model holding a lip gloss"
                  fill
                  priority
                  quality={90}
                  sizes="(max-width: 1024px) 78vw, 470px"
                  className="object-cover object-[50%_12%]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#08030D]/70 to-transparent" />
              </div>
            </div>

            {/* Spinning shop badge */}
            <div
              className="absolute -right-3 top-6 h-[92px] w-[92px] sm:-right-6 lg:-right-10 lg:top-10 lg:h-[132px] lg:w-[132px]"
              style={{
                transform:
                  "translate(calc(var(--mx, 0) * -28px), calc(var(--my, 0) * -28px))",
                transition: "transform 0.2s ease-out",
              }}
            >
              <div className="absolute inset-0 rounded-full border border-white/15 bg-[#14091D]/90 shadow-[0_10px_40px_rgba(117,21,184,0.5)]" />
              <svg viewBox="0 0 120 120" className="zeva-spin absolute inset-0 h-full w-full">
                <defs>
                  <path
                    id="zevaBadgePath"
                    d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
                  />
                </defs>
                <text fontSize="8.5" fill="#E8C7FF" fontWeight="600">
                  <textPath
                    href="#zevaBadgePath"
                    textLength="284"
                    lengthAdjust="spacing"
                  >
                    SHOP THE COLLECTION • SHOP THE COLLECTION •
                  </textPath>
                </text>
              </svg>
              <Link
                href="/shop"
                aria-label="Shop the collection"
                className="absolute inset-0 m-auto flex h-[44%] w-[44%] items-center justify-center rounded-full bg-[#C77AFF] text-xl text-[#16091D] transition-all duration-300 hover:scale-110 hover:bg-white"
              >
                ↗
              </Link>
            </div>

            {/* Floating glass card */}
            <Link
              href="/shop"
              className="group absolute -left-2 bottom-8 flex items-center gap-4 border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md transition-colors hover:border-[#C77AFF]/70 hover:bg-white/15 sm:-left-6 lg:-left-12"
              style={{
                transform:
                  "translate(calc(var(--mx, 0) * 30px), calc(var(--my, 0) * 30px))",
                transition: "transform 0.2s ease-out, background-color .3s, border-color .3s",
              }}
            >
              <span className="flex flex-col">
                <span className="text-[9px] tracking-[3px] text-[#D69AFF]">
                  THE ZEVA EDIT
                </span>
                <span className="font-serif text-[18px] leading-tight">
                  Shop the collection
                </span>
              </span>
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>

            {/* Sparkles */}
            <span aria-hidden className="zeva-float pointer-events-none absolute -left-3 top-[6%] text-2xl text-[#E8C7FF]" style={delay(0)}>✦</span>
            <span aria-hidden className="zeva-float pointer-events-none absolute -right-4 top-[52%] text-xl text-[#C77AFF]" style={delay(1.4)}>✦</span>
            <span aria-hidden className="zeva-float pointer-events-none absolute bottom-[6%] right-8 text-lg text-[#E8C7FF]" style={delay(2.6)}>✦</span>
          </div>
        </div>

        {/* ───────── Text ───────── */}
        <div className="order-2 lg:order-1">
          <div className="zeva-fade mb-6 flex items-center gap-4" style={delay(0)}>
            <span className="h-[2px] w-[60px] bg-[#C77AFF]" />
            <span className="text-[11px] tracking-[4px] text-[#D69AFF]">
              THE WORLD OF ZEVA
            </span>
          </div>

          <h1 className="font-serif text-[clamp(52px,8vw,112px)] leading-[0.9] tracking-[-0.03em]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="zeva-rise inline-block">Dress beyond</span>
            </span>
            <span className="block overflow-hidden pb-[0.14em] pr-[0.06em]">
              <span className="zeva-shine inline-block italic">ordinary.</span>
            </span>
          </h1>

          <p
            className="zeva-fade mt-6 max-w-[460px] text-[15px] leading-[1.7] text-white/80 sm:text-[17px]"
            style={delay(0.45)}
          >
            A considered collection of fashion and beauty, made for the
            woman who creates her own definition of elegance.
          </p>

          <div
            className="zeva-fade mt-8 flex flex-wrap items-center gap-x-8 gap-y-5"
            style={delay(0.6)}
          >
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-5 overflow-hidden bg-[#C77AFF] px-7 py-4 text-[11px] font-bold tracking-[1.8px] text-[#16091D] shadow-[0_10px_40px_-8px_rgba(199,122,255,0.7)] transition-all duration-300 hover:bg-white"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/50 transition-transform duration-700 group-hover:translate-x-[400%]"
              />
              <span className="relative">DISCOVER THE COLLECTION</span>
              <span className="relative text-lg transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center gap-3 border-b border-white/60 pb-1 text-[11px] tracking-[2px] transition-colors hover:border-[#C77AFF] hover:text-[#D69AFF]"
            >
              EXPLORE ZEVA
              <span className="text-base">↗</span>
            </Link>
          </div>

          {/* Store perks */}
          <ul
            className="zeva-fade mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[10px] tracking-[2.5px] text-white/60"
            style={delay(0.8)}
          >
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span className="text-[#C77AFF]">✦</span>
                {p.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ───────── Tagline strip ───────── */}
      <div className="zeva-marquee-wrap overflow-hidden border-y border-white/10 bg-[#0D0514] py-4">
        <div className="zeva-marquee flex w-max">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-center"
              aria-hidden={dup === 1}
            >
              {TICKER.map((t, i) => (
                <span key={`${dup}-${t}`} className="flex items-center">
                  <span
                    className={`px-8 font-serif text-[24px] italic sm:text-[30px] ${
                      i % 2
                        ? "text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.7)]"
                        : "text-white"
                    }`}
                  >
                    {t}
                  </span>
                  <span className="text-[#C77AFF]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}