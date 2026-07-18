import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui";
import { CheckoutForm } from "./CheckoutForm";

async function getProduct(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/products/${slug}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

async function getProductFields(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/products/${slug}/fields`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.data.fields || [];
}

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const [product, fields] = await Promise.all([
    getProduct(params.slug),
    getProductFields(params.slug),
  ]);
  if (!product) notFound();

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Games
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Product Info */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="overflow-hidden !bg-zinc-900">
              {product.image_url ? (
                <div className="relative h-72 sm:h-96 w-full">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="h-72 sm:h-96 w-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                  <span className="text-8xl font-bold text-zinc-700">
                    {product.name.charAt(0)}
                  </span>
                </div>
              )}
            </Card>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl font-semibold text-indigo-400">
                  ${product.min_price}
                </span>
                {product.min_price !== product.max_price && (
                  <span className="text-lg text-zinc-500">
                    — ${product.max_price}
                  </span>
                )}
              </div>
              {product.short_description && (
                <div
                  className="text-zinc-400 leading-relaxed text-base"
                  dangerouslySetInnerHTML={{
                    __html: product.short_description,
                  }}
                />
              )}
            </div>

            {/* Variations Grid */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">
                Select Amount
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.variations.map((v: any) => {
                  const name = Object.values(v.attributes).join(" - ");
                  return (
                    <div
                      key={v.id}
                      className={`p-4 rounded-xl border text-center transition-all ${v.is_in_stock ? "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700" : "border-zinc-800/50 bg-zinc-900/20 opacity-50"}`}
                    >
                      <p className="text-sm font-medium text-zinc-200 mb-1">
                        {name}
                      </p>
                      <p className="text-lg font-bold text-white">${v.price}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Checkout Form */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <CheckoutForm
                productId={product.id}
                productName={product.name}
                variations={product.variations}
                fields={fields}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
