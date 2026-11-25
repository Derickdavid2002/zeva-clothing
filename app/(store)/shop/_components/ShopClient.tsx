
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "../../../types";
import ProductCard from "../../../_components/ProductCard";
import { MdSearch } from "react-icons/md";

export default function ShopClient({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const categoryOptions = ["All", ...categories];
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "All"
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    const cat = searchParams.get("category") || "All";
    setActiveCategory(cat);
  }, [searchParams]);

  const filtered = products.filter((p) => {
    const matchCat =
      activeCategory === "All" || p.category === activeCategory;

    const matchSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCat && matchSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#060606] text-white">
      {/* Header */}
      <div
        className="relative w-full overflow-hidden py-12 sm:py-16 lg:py-20"
        style={{
          background: "#0a0a0a",
          borderBottom: "1px solid #1e1e1e",
        }}
      >
        {/* Purple glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(185,165,232,0.1), transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <p
            className="text-[9px] sm:text-[11px] uppercase tracking-[4px] mb-3 font-semibold"
            style={{
              color: "#B9A5E8",
              textShadow: "0 0 10px rgba(185,165,232,0.4)",
            }}
          >
            Browse
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white mb-6 tracking-wide">
            All Products
          </h1>

          {/* Search */}
          <div className="relative max-w-md mb-6">
            <MdSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-lg text-white text-xs sm:text-sm outline-none transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid #1e1e1e",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(185,165,232,0.4)")
              }
              onBlur={(e) => (e.target.style.borderColor = "#1e1e1e")}
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {categoryOptions.map((cat) => {
              const active = activeCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-3 sm:px-5 py-2 rounded-full text-[9px] sm:text-xs font-semibold uppercase tracking-wide transition-all duration-200 cursor-pointer"
                  style={{
                    background: active ? "#B9A5E8" : "transparent",
                    color: active ? "#100C18" : "rgba(255,255,255,0.5)",
                    border: active
                      ? "1px solid #B9A5E8"
                      : "1px solid #29242F",
                    boxShadow: active
                      ? "0 0 15px rgba(185,165,232,0.2)"
                      : "none",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-3 sm:px-8 lg:px-12 py-9 sm:py-12 lg:py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid #1e1e1e",
              }}
            >
              <MdSearch size={28} className="text-white/20" />
            </div>

            <p className="text-white/30 text-sm">
              No products found. Try a different category or search term.
            </p>
          </div>
        ) : (
          <>
            <p className="text-white/30 text-[11px] sm:text-sm mb-5 sm:mb-8">
              Showing{" "}
              <span className="font-semibold" style={{ color: "#B9A5E8" }}>
                {filtered.length}
              </span>{" "}
              product{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* Responsive product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2.5 gap-y-5 sm:gap-5 lg:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
