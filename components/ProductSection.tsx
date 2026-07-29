"use client";

import { useState } from "react";
import GameCard from "./GameCard";

interface Variation {
  id: number;
  price: number;
  attributes: Record<string, string>;
  is_in_stock: boolean;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  min_price: number;
  max_price: number;
  variations?: Variation[];
  stock_status?: string;
  is_in_stock?: boolean;
}

interface ProductSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  products: Product[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="block h-full w-full border-4 border-[#00f0ff] bg-[#1a0b2e] animate-pulse">
      <div className="relative aspect-[4/3] w-full flex-shrink-0 border-b-4 border-[#00f0ff] bg-[#0a0118]">
        <div className="absolute top-2 right-2 w-10 h-4 bg-[#ff00de]/40 border-2 border-white/30" />
      </div>
      <div className="flex flex-col flex-grow p-3 sm:p-4 gap-3">
        <div className="space-y-2">
          <div className="h-3 w-full bg-[#0a0118] border border-[#00f0ff]/30" />
          <div className="h-3 w-3/4 bg-[#0a0118] border border-[#00f0ff]/30" />
        </div>
        <div className="flex items-center justify-between mt-auto pt-1 sm:pt-0">
          <div className="flex flex-col gap-1">
            <div className="h-2 w-16 bg-[#0a0118] border border-gray-700/50" />
            <div className="h-4 w-12 bg-[#0a0118] border border-[#00f0ff]/30" />
          </div>
          <div className="w-16 h-8 bg-[#ff00de]/40 border-2 border-white/30" />
        </div>
      </div>
    </div>
  );
}

export default function ProductSection({
  id,
  title,
  subtitle,
  products,
  loading = false,
}: ProductSectionProps) {
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <section className="relative py-16 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between border-b-4 border-[#00f0ff] pb-4">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-[#0a0118] border-2 border-[#fcee0a]/30 animate-pulse" />
              <div className="h-3 w-64 bg-[#0a0118] border-2 border-[#00f0ff]/30 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 auto-rows-fr">
            {[...Array(10)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  // 🌟 STRICT 2-ROW LIMIT: 5 columns (xl) x 2 rows = 10 products max initially
  const displayedProducts = showAll ? products : products.slice(0, 10);
  const hasMore = products.length > 10;

  return (
    <section id={id} className="relative py-16 scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between border-b-4 border-[#00f0ff] pb-4">
          <div>
            <h2 className="font-pixel text-lg md:text-2xl text-[#fcee0a] text-glow-yellow mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="font-bold text-sm text-[#00f0ff] uppercase tracking-widest">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 auto-rows-fr">
          {displayedProducts.map((game) => {
            const isOutOfStock =
              game.variations && game.variations.length > 0
                ? game.variations.every((v) => v.is_in_stock === false)
                : game.stock_status === "outofstock" ||
                  game.is_in_stock === false;

            return (
              <GameCard
                key={game.id}
                id={game.id}
                name={game.name}
                slug={game.slug}
                image_url={game.image_url}
                min_price={game.min_price}
                max_price={game.max_price}
                is_out_of_stock={isOutOfStock}
              />
            );
          })}
        </div>

        {/* 🌟 VIEW MORE BUTTON (Only appears if there are more than 10 products) */}
        {hasMore && !showAll && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="group relative flex items-center gap-3 border-4 border-[#00f0ff] bg-[#1a0b2e] px-8 py-4 font-pixel text-sm text-[#00f0ff] shadow-[4px_4px_0px_0px_#00f0ff] transition-all hover:bg-[#00f0ff] hover:text-black hover:shadow-[2px_2px_0px_0px_#00f0ff] btn-press"
            >
              <span>VIEW MORE</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
