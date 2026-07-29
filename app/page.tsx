"use client";

import { useState, useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import CategoryNav from "@/components/CategoryNav";
import ProductSection from "@/components/ProductSection";
import CategoryCard from "@/components/CategoryCard";
import CategoryModal from "@/components/CategoryModal";

const CATEGORIES = {
  ENTERTAINMENT: 52,
  BATTLE_ROYALE: 53,
};

const POPULAR_CATEGORY_IDS = [52, 53, 54, 56, 51]; // Your WP category IDs

// 🌟 NEW: Skeleton that perfectly matches CategoryCard
function CategorySkeletonCard() {
  return (
    <div className="block h-full w-full border-4 border-[#00f0ff] bg-[#1a0b2e] animate-pulse">
      <div className="relative aspect-[4/3] w-full flex-shrink-0 border-b-4 border-[#00f0ff] bg-[#0a0118]">
        <div className="absolute top-2 right-2 w-12 h-4 bg-[#ff00de]/40 border-2 border-white/30" />
      </div>
      <div className="flex flex-col flex-grow p-3 sm:p-4 gap-3">
        <div className="space-y-2">
          <div className="h-3 w-full bg-[#0a0118] border border-[#00f0ff]/30" />
          <div className="h-3 w-3/4 bg-[#0a0118] border border-[#00f0ff]/30" />
        </div>
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="h-3 w-16 bg-[#0a0118] border border-[#fcee0a]/30" />
          <div className="w-14 h-7 bg-[#ff00de]/40 border-2 border-white/30" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/products`,
            { cache: "no-store" },
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/categories`,
            { cache: "no-store" },
          ),
        ]);

        if (!productsRes.ok || !categoriesRes.ok)
          throw new Error("Fetch failed");

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setAllProducts(productsData.data || []);
        setAllCategories(categoriesData.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const popularCategories = allCategories.filter((cat: any) =>
    POPULAR_CATEGORY_IDS.includes(cat.id),
  );

  const entertainmentGames = allProducts.filter((p: any) =>
    p.categories?.includes(CATEGORIES.ENTERTAINMENT),
  );

  const battleRoyaleGames = allProducts.filter((p: any) =>
    p.categories?.includes(CATEGORIES.BATTLE_ROYALE),
  );

  const modalProducts = activeCategoryId
    ? allProducts.filter((p: any) => p.categories?.includes(activeCategoryId))
    : [];

  const activeCategoryName =
    allCategories.find((c: any) => c.id === activeCategoryId)?.name || "";

  return (
    <div className="min-h-screen text-white bg-[#0a0118]">
      {/* 1. Hero */}
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

      <CategoryNav />

      {/* 2. Popular Games Section (WITH PROPER SKELETONS NOW) */}
      <section id="popular" className="relative py-16 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton or Real Header */}
          {loading ? (
            <div className="mb-10 flex items-end justify-between border-b-4 border-[#00f0ff] pb-4">
              <div className="space-y-2">
                <div className="h-6 w-48 bg-[#0a0118] border-2 border-[#fcee0a]/30 animate-pulse" />
                <div className="h-3 w-64 bg-[#0a0118] border-2 border-[#00f0ff]/30 animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="mb-10 flex items-end justify-between border-b-4 border-[#00f0ff] pb-4">
              <div>
                <h2 className="font-pixel text-lg md:text-2xl text-[#fcee0a] text-glow-yellow mb-2">
                  🔥 Popular Games
                </h2>
                <p className="font-bold text-sm text-[#00f0ff] uppercase tracking-widest">
                  Most topped up games this week
                </p>
              </div>
            </div>
          )}

          {/* 🌟 GRID: Shows Skeletons when loading, Real Cards when done */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 auto-rows-fr">
            {loading
              ? [...Array(5)].map((_, i) => <CategorySkeletonCard key={i} />)
              : popularCategories.map((category: any) => (
                  <CategoryCard
                    key={category.id}
                    name={category.name}
                    image_url={category.image_url}
                    count={category.count}
                    onClick={() => setActiveCategoryId(category.id)}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* 3. Other Sections */}
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

      {/* 4. Modal */}
      <CategoryModal
        isOpen={!!activeCategoryId}
        onClose={() => setActiveCategoryId(null)}
        categoryName={activeCategoryName}
        products={modalProducts}
        loading={loading}
      />

      <div className="h-20" />
    </div>
  );
}
