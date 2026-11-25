
import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "../../lib/sanity";
import { allCategoriesQuery } from "../../lib/queries";

type Category = {
  _id: string;
  title: string;
  description?: string;
  image?: any;
  slug?: {
    current: string;
  };
};

const starter: Category[] = [
  {
    _id: "starter-clothes",
    title: "Zeva Wears",
    description: "Everyday and statement fashion",
    slug: { current: "zeva-wears" },
  },
  {
    _id: "starter-glasses",
    title: "Zeva Eyewear",
    description: "Finishing touches and frames",
    slug: { current: "zeva-eyewear" },
  },
  {
    _id: "starter-pretty",
    title: "Pretty in Zeva",
    description: "Nails, lip gloss and beauty essentials",
    slug: { current: "pretty-in-zeva" },
  },
];

const fallbackImages: Record<string, string> = {
  "zeva-wears": "/polo.jpg",
  "zeva-eyewear": "/zevaglasses.jpg",
  "pretty-in-zeva": "/prettyinzeva.jpg",
};

export default async function CategoryShowcase() {
  let categories: Category[] = starter;

  try {
    const saved = await client.fetch(allCategoriesQuery);

    if (saved?.length) {
      categories = saved;
    }
  } catch {}

  return (
    <section className="relative overflow-hidden bg-[#0A090D] text-white py-12 sm:py-16">
      <div className="max-w-[1350px] mx-auto">
        <div className="px-5 sm:px-8 lg:px-12 mb-7 sm:mb-9">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-px bg-[#C4B5FD]" />
            <p className="text-[9px] tracking-[3px] uppercase text-[#C4B5FD]">
              The Zeva edit
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <h2 className="font-serif text-[30px] sm:text-[38px] lg:text-[44px] leading-tight font-normal">
              Explore the{" "}
              <span className="italic text-[#C4B5FD]">collection.</span>
            </h2>

            <p className="text-white/45 text-[11px] sm:text-xs leading-5 max-w-[250px]">
              Discover the pieces that bring your personal style to life.
            </p>
          </div>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-smooth px-5 sm:px-8 lg:px-12 pb-3 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat, index) => {
            const fallback =
              fallbackImages[cat.slug?.current || ""] || "";

            return (
              <Link
                key={cat._id}
                href={`/shop?category=${encodeURIComponent(cat.title)}`}
                className="group relative isolate flex-none w-[43vw] sm:w-auto h-[210px] sm:h-[260px] lg:h-[290px] snap-start overflow-hidden bg-[#17141D] border border-white/[0.09] hover:border-[#C4B5FD]/60 transition-colors duration-500"
              >
                {cat.image ? (
                  <Image
                    src={urlFor(cat.image).width(700).height(900).url()}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 639px) 43vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : fallback ? (
                  <Image
                    src={fallback}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 639px) 43vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#382A50] via-[#1B1722] to-[#0D0B10]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />
                <div className="absolute inset-0 bg-[#8B5CF6]/0 group-hover:bg-[#8B5CF6]/10 transition-colors duration-500" />

                <span className="absolute top-3 left-3 text-[8px] tracking-[2px] text-white/75">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                  <span className="block w-6 h-px bg-[#C4B5FD] mb-2.5 transition-all duration-500 group-hover:w-10" />

                  <h3 className="font-serif text-[19px] sm:text-[25px] lg:text-[28px] leading-tight">
                    {cat.title}
                  </h3>

                  <p className="mt-1 text-white/65 text-[9px] sm:text-[10px] leading-4 line-clamp-1">
                    {cat.description || "Explore the collection"}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/25">
                    <span className="text-[7px] sm:text-[8px] uppercase tracking-[2px] text-white/80">
                      Discover
                    </span>

                    <span className="text-[#D6C5FF] text-sm transition-transform duration-300 group-hover:translate-x-1">
                      ↗
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 border border-white/[0.06] group-hover:border-[#C4B5FD]/50 pointer-events-none transition-colors duration-500" />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-between mx-5 sm:mx-8 lg:mx-12 mt-5 pt-4 border-t border-white/[0.08]">
          <span className="text-[8px] tracking-[2px] uppercase text-white/35">
            Style without limits
          </span>

          <span className="text-[8px] tracking-[2px] uppercase text-[#C4B5FD]/70">
            {String(categories.length).padStart(2, "0")} Collections
          </span>
        </div>
      </div>
    </section>
  );
}
