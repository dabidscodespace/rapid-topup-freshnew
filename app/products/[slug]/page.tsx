import { notFound } from 'next/navigation';
import Link from 'next/link';
import CheckoutForm from './CheckoutForm';

async function getProduct(slug: string) {
  const timestamp = Date.now();
  const res = await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/products/${slug}?t=${timestamp}`, {
    cache: 'no-store'
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

async function getProductFields(slug: string) {
  const timestamp = Date.now();
  const res = await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/products/${slug}/fields?t=${timestamp}`, {
    cache: 'no-store'
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data?.fields || [];
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);
  const fields = await getProductFields(resolvedParams.slug);

  if (!product) return notFound();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center gap-2 font-pixel text-[10px] text-[#00f0ff]">
          <Link href="/" className="hover:text-[#fcee0a] transition-colors">HOME</Link>
          <span className="text-[#ff00de]">&gt;</span>
          <Link href="/#all-games" className="hover:text-[#fcee0a] transition-colors">GAMES</Link>
          <span className="text-[#ff00de]">&gt;</span>
          <span className="text-[#fcee0a] truncate">{product.name.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Image & Main Description */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* 1. Product Banner Image */}
            <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] shadow-hard-cyan relative overflow-hidden">
              <div className="relative h-72 sm:h-96 w-full">
                <img 
                  src={product.image_url || 'https://placehold.co/800x400/1a0b2e/00f0ff?text=NO+IMAGE'} 
                  alt={product.name} 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-transparent to-transparent" />
              </div>
            </div>

            {/* 2. Title & Price */}
            <div>
              <h1 className="font-pixel text-2xl md:text-3xl text-[#fcee0a] text-glow-yellow mb-4 leading-tight">
                {product.name.toUpperCase()}
              </h1>

            </div>

            {/* 3. MAIN PRODUCT DESCRIPTION (Supports HTML, Images, Videos) */}
            <div className="border-4 border-[#ff00de] bg-[#1a0b2e] p-6 shadow-hard-pink relative">
              <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-pixel text-xs text-[#ff00de] mb-4 uppercase tracking-wider border-b-2 border-[#ff00de]/30 pb-2 inline-block">
                  Product Details & Instructions
                </h3>
                {/* 🌟 Renders the main description. If empty, falls back to short description */}
                <div className="font-sans text-base text-white leading-relaxed space-y-4 description-content">
                  {product.description || product.short_description ? (
                    <div dangerouslySetInnerHTML={{ __html: product.description || product.short_description }} />
                  ) : (
                    <p className="text-gray-400">
                      Instant top-up for {product.name}. Fill in your account details on the right, select your package, and complete the payment to receive your items immediately.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 3-Part Checkout Form */}
          <div className="lg:col-span-7">
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
    </div>
  );
}