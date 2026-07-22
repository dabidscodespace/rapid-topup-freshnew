import GameCard from "./GameCard";

interface Product {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  min_price: number;
  max_price: number;
}

interface ProductSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  products: Product[];
}

export default function ProductSection({
  id,
  title,
  subtitle,
  products,
}: ProductSectionProps) {
  if (products.length === 0) return null;

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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {products.map((game) => (
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
      </div>
    </section>
  );
}
