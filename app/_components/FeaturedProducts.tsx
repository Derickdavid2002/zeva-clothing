import Link from "next/link";
import { client } from "../../lib/sanity";
import { Product } from "../types";
import ProductCard from "../_components/ProductCard";

const featuredQuery = `*[_type == "product" && featured == true][0...4]`;

export default async function FeaturedProducts() {
  let products: Product[] = [];

  try {
    products = await client.fetch(featuredQuery);
  } catch {
    /* Zeva CMS is configured separately. */
  }

  return (
    <section className="relative overflow-hidden bg-[#08070B] text-white">
      {/* Subtle background detail */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 bg-[#8B5CF6]/[0.07] blur-[130px]" />

      <div className="relative mx-auto max-w-[1500px] px-4 py-14 sm:px-10 sm:py-28 lg:px-20 lg:py-32">
        {/* Editorial heading */}
        <div className="mb-8 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <div className="mb-3 flex items-center gap-3 sm:mb-5">
              <span className="h-px w-8 bg-[#C4B5FD]" />
              <p className="text-[9px] uppercase tracking-[4px] text-[#C4B5FD] sm:text-[10px] sm:tracking-[5px]">
                The selection
              </p>
            </div>

            <h2 className="font-serif text-[34px] font-normal leading-[1.05] tracking-tight sm:text-[56px] lg:text-[68px]">
              Pieces worth
              <span className="block italic text-[#C4B5FD]">noticing.</span>
            </h2>
          </div>

          <div className="sm:text-right">
            <p className="max-w-[290px] text-[13px] leading-6 text-white/45 sm:ml-auto sm:text-sm sm:leading-7">
              A little something for every version of you. Discover our
              handpicked favourites.
            </p>

            <Link
              href="/shop"
              className="mt-3 inline-flex items-center gap-3 text-[10px] uppercase tracking-[2.5px] text-white/80 transition-colors hover:text-[#C4B5FD] sm:mt-5"
            >
              View everything
              <span className="text-lg">↗</span>
            </Link>
          </div>
        </div>

        {/* Products: 2 small cards per row on phones */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="border border-white/10 py-14 text-center sm:py-20">
            <p className="font-serif text-xl italic text-white/70 sm:text-2xl">
              Something beautiful is on its way.
            </p>
            <p className="mt-3 text-xs tracking-wide text-white/40">
              Our featured collection will appear here soon.
            </p>
          </div>
        )}

        {/* Bottom link */}
        <div className="mt-10 flex justify-center sm:mt-16">
          <Link
            href="/shop"
            className="group inline-flex w-full items-center justify-between gap-6 border border-[#C4B5FD]/50 px-6 py-4 text-[10px] uppercase tracking-[2.5px] text-white transition-all duration-500 hover:bg-[#C4B5FD] hover:text-[#100C18] sm:w-auto sm:justify-center sm:gap-8 sm:px-9 sm:py-5 sm:tracking-[3px]"
          >
            Explore the full collection
            <span className="text-lg transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}