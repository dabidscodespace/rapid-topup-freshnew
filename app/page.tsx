import { Suspense } from 'react';
import { Search, Shield, Zap, Headphones, TrendingUp } from 'lucide-react';
import GameCard from '@/components/GameCard';

// Fetch data directly on the server (Fast & SEO friendly)
async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/products`, {
    next: { revalidate: 60 } // Cache for 60 seconds
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data.data || [];
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-900/50 pt-20 pb-16">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 mb-6">
            <TrendingUp className="h-4 w-4" />
            <span>#1 Trusted Top-Up Platform in BD</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
            Level Up Your Game <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Instantly & Securely
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-zinc-400 mb-10">
            Get UC, Diamonds, and Credits delivered to your account in seconds. 
            Pay easily with bKash, Nagad, or Rocket.
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-2xl relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search for your game (e.g., PUBG, Free Fire)..." 
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 py-4 pl-12 pr-4 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* 2. TRUST FEATURES */}
      <section className="border-b border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">Instant Delivery</h3>
                <p className="text-sm text-zinc-400">Auto-processed in seconds.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">100% Secure</h3>
                <p className="text-sm text-zinc-400">Verified & encrypted payments.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">24/7 Support</h3>
                <p className="text-sm text-zinc-400">Always here to help you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GAMES GRID */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Popular Games</h2>
            <span className="text-sm text-zinc-500">{products.length} games available</span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              No games found. Please add products in WordPress.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((game: any) => (
                <GameCard 
                  key={game.id} 
                  id={game.id}
                  name={game.name}
                  slug={game.slug}
                  image_url={game.image_url}
                  min_price={game.min_price}
                  max_price={game.max_price}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}