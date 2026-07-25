"use client";

import { useState, useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import CategoryNav from "@/components/CategoryNav";
import ProductSection from "@/components/ProductSection";

type Product = {
  categories?: number[];
};

const CATEGORIES = {
  POPULAR: 15,
  ENTERTAINMENT: 52,
  BATTLE_ROYALE: 53,
};

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // 🌟 Added loading state back

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/products`,
          { cache: "no-store" },
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setAllProducts(data.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false); // 🌟 Stop loading when done
      }
    };

    fetchProducts();
  }, []);

  const popularGames = allProducts
    .filter((p) => p.categories?.includes(CATEGORIES.POPULAR))
    .slice(0, 5);
  const entertainmentGames = allProducts.filter((p) =>
    p.categories?.includes(CATEGORIES.ENTERTAINMENT),
  );
  const battleRoyaleGames = allProducts.filter((p) =>
    p.categories?.includes(CATEGORIES.BATTLE_ROYALE),
  );

  return (
    <div className="min-h-screen text-white bg-[#0a0118]">
      {/* 1. Hero Slider */}
      <div className="pt-8 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] p-6 shadow-hard-cyan relative h-64 sm:h-96 animate-pulse flex items-center justify-center">
              <span className="font-pixel text-xs text-[#00f0ff]/50 tracking-widest">
                LOADING HERO...
              </span>
            </div>
          ) : (
            <HeroSlider />
          )}
        </div>
      </div>

      {/* 2. Sticky Category Navigation */}
      <CategoryNav />

      {/* 3. Product Sections (Passing loading prop!) */}
      <ProductSection
        id="popular"
        title="🔥 Popular Games"
        subtitle="Most topped up games this week"
        products={popularGames}
        loading={loading}
      />
      <ProductSection
        id="entertainment"
        title="🎬 Entertainment"
        subtitle="Netflix, Spotify, YouTube Premium and more"
        products={entertainmentGames}
        loading={loading}
      />
      <ProductSection
        id="battle-royale"
        title="⚔️ Battle Royale"
        subtitle="Dominate the battlefield"
        products={battleRoyaleGames}
        loading={loading}
      />
      <ProductSection
        id="all-games"
        title="🎮 All Games"
        subtitle="Browse our complete catalog"
        products={allProducts}
        loading={loading}
      />

      {/* Footer Spacer */}
      <div className="h-20" />
    </div>
  );
}
