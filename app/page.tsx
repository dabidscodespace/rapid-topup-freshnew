import HeroSlider from "@/components/HeroSlider";
import CategoryNav from "@/components/CategoryNav";
import ProductSection from "@/components/ProductSection";

// ==========================================
// CATEGORY CONFIGURATION (Use your actual WP Category IDs)
// ==========================================
const CATEGORIES = {
  POPULAR: 15,
  ENTERTAINMENT: 52,
  BATTLE_ROYALE: 53,
};

async function getProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/products`,
    {
      next: { revalidate: 60 },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.data || [];
}

export default async function HomePage() {
  const allProducts = await getProducts();

  const popularGames = allProducts
    .filter((p: any) => p.categories?.includes(CATEGORIES.POPULAR))
    .slice(0, 5);

  const entertainmentGames = allProducts.filter((p: any) =>
    p.categories?.includes(CATEGORIES.ENTERTAINMENT),
  );

  const battleRoyaleGames = allProducts.filter((p: any) =>
    p.categories?.includes(CATEGORIES.BATTLE_ROYALE),
  );

  return (
    <div className="min-h-screen text-white">
      {/* 1. Hero Slider */}
      <div className="pt-8 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <HeroSlider />
        </div>
      </div>

      {/* 2. Sticky Category Navigation */}
      <CategoryNav />

      {/* 3. Product Sections */}
      <ProductSection
        id="popular"
        title="🔥 Popular Games"
        subtitle="Most topped up games this week"
        products={popularGames}
      />

      <ProductSection
        id="entertainment"
        title="🎬 Entertainment"
        subtitle="Netflix, Spotify, YouTube Premium and more"
        products={entertainmentGames}
      />

      <ProductSection
        id="battle-royale"
        title="⚔️ Battle Royale"
        subtitle="Dominate the battlefield"
        products={battleRoyaleGames}
      />

      <ProductSection
        id="all-games"
        title="🎮 All Games"
        subtitle="Browse our complete catalog"
        products={allProducts}
      />

      {/* Footer Spacer */}
      <div className="h-20" />
    </div>
  );
}
