"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Zap, ShieldCheck, Globe, Headphones } from "lucide-react";
import CheckoutForm from "./CheckoutForm";

export default function ProductPage() {
  const { slug } = useParams();
  // Typed product & fields to avoid `any`
  type Variation = Record<string, unknown>;
  type Product = {
    id: number | string;
    name: string;
    banner_url?: string | null;
    image_url?: string | null;
    variations?: Variation[];
    description?: string | null;
    short_description?: string | null;
    delivery_title?: string | null;
    delivery_subtitle?: string | null;
    region_title?: string | null;
    region_subtitle?: string | null;
  };

  type Field = {
    id?: string | number;
    name?: string;
    label?: string;
    type?: string;
    options?: unknown;
  };

  const [product, setProduct] = useState<Product | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<"product" | "description">(
    "product",
  );

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const timestamp = Date.now();
        const [productRes, fieldsRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/products/${slug}?t=${timestamp}`,
            { cache: "no-store" },
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/products/${slug}/fields?t=${timestamp}`,
            { cache: "no-store" },
          ),
        ]);

        if (!productRes.ok) {
          setError(true);
          return;
        }

        const productData = await productRes.json();
        const fieldsData = await fieldsRes.json();

        setProduct(productData.data);
        setFields(fieldsData.data?.fields || []);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // INLINE LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-2 font-pixel text-[10px] text-[#00f0ff]">
            <div className="h-3 w-12 bg-[#1a0b2e] border-2 border-[#00f0ff]/30 animate-pulse" />
            <span className="text-[#ff00de]">&gt;</span>
            <div className="h-3 w-16 bg-[#1a0b2e] border-2 border-[#00f0ff]/30 animate-pulse" />
            <span className="text-[#ff00de]">&gt;</span>
            <div className="h-3 w-32 bg-[#1a0b2e] border-2 border-[#fcee0a]/30 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5 space-y-8">
              <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] shadow-hard-cyan relative overflow-hidden h-72 sm:h-96">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-pixel text-xs text-[#00f0ff]/50 animate-pulse">
                    LOADING IMAGE...
                  </span>
                </div>
              </div>
              <div className="h-8 w-3/4 bg-[#1a0b2e] border-4 border-[#fcee0a]/30 animate-pulse" />
              <div className="border-4 border-[#ff00de] bg-[#1a0b2e] p-6 shadow-hard-pink relative min-h-50">
                <div className="space-y-4">
                  <div className="h-4 w-1/3 bg-[#0a0118] border-2 border-[#ff00de]/30 animate-pulse" />
                  <div className="h-4 w-full bg-[#0a0118] border-2 border-[#ff00de]/20 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="border-4 border-[#fcee0a] bg-[#1a0b2e] p-6 shadow-hard-yellow relative min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div
                    className="h-10 w-10 border-4 border-[#fcee0a] border-t-transparent animate-spin mx-auto mb-4"
                    style={{ borderRadius: "0" }}
                  />
                  <p className="font-pixel text-xs text-[#fcee0a] animate-pulse">
                    INITIALIZING CHECKOUT TERMINAL...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center border-4 border-[#ff00de] bg-[#1a0b2e] p-12 shadow-hard-pink">
          <h1 className="font-pixel text-2xl text-[#ff00de] mb-4">
            GAME NOT FOUND
          </h1>
          <Link
            href="/"
            className="font-pixel text-sm text-[#00f0ff] hover:text-[#fcee0a] transition-colors"
          >
            RETURN TO ARCADE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-8xl">
        {/* Breadcrumb */}
        <div className="mb-6 sm:mb-8 flex items-center gap-2 font-pixel text-[10px] text-[#00f0ff]">
          <Link href="/" className="hover:text-[#fcee0a] transition-colors">
            HOME
          </Link>
          <span className="text-[#ff00de]">&gt;</span>
          <Link
            href="/#all-games"
            className="hover:text-[#fcee0a] transition-colors"
          >
            GAMES
          </Link>
          <span className="text-[#ff00de]">&gt;</span>
          <span className="text-[#fcee0a] truncate">
            {product.name.toUpperCase()}
          </span>
        </div>

        {/* ========================================== */}
        {/* MOBILE LAYOUT (With Tabs)                  */}
        {/* ========================================== */}
        <div className="lg:hidden space-y-6">
          {/* Banner / Image */}
          <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] shadow-hard-cyan relative overflow-hidden">
            <div className="relative h-72 w-full">
              <Image
                src={
                  product.banner_url ||
                  product.image_url ||
                  "https://placehold.co/800x400/1a0b2e/00f0ff?text=NO+IMAGE"
                }
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-pixel text-2xl text-[#fcee0a] text-glow-yellow leading-tight">
            {product.name.toUpperCase()}
          </h1>

          {/* Mobile Tabs */}
          <div className="flex border-b-4 border-[#00f0ff] bg-[#1a0b2e]">
            <button
              role="tab"
              aria-selected={activeTab === "product"}
              onClick={() => setActiveTab("product")}
              className={`flex-1 py-3 font-pixel text-xs sm:text-sm transition-colors border-r-2 border-[#00f0ff]/30 ${
                activeTab === "product"
                  ? "bg-[#00f0ff] text-[#1a0b2e]"
                  : "bg-[#1a0b2e] text-[#00f0ff] hover:text-[#fcee0a]"
              }`}
            >
              PRODUCT
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "description"}
              onClick={() => setActiveTab("description")}
              className={`flex-1 py-3 font-pixel text-xs sm:text-sm transition-colors ${
                activeTab === "description"
                  ? "bg-[#ff00de] text-[#1a0b2e]"
                  : "bg-[#1a0b2e] text-[#ff00de] hover:text-[#fcee0a]"
              }`}
            >
              DESCRIPTION
            </button>
          </div>

          {/* Mobile Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === "product" ? (
              <div>
                {/* 🌟 DYNAMIC TRUST BAR */}
                <TrustBar
                  deliveryTitle={product.delivery_title || "INSTANT"}
                  deliverySub={product.delivery_subtitle || "DELIVERY"}
                  regionTitle={product.region_title || "GLOBAL / BD"}
                  regionSub={product.region_subtitle || "REGION"}
                />
                <CheckoutForm
                  productId={
                    typeof product.id === "number"
                      ? product.id
                      : Number(product.id)
                  }
                  productName={product.name}
                  // Ensure value is string | undefined (avoid null)
                  productImage={(product.image_url ?? product.banner_url) as string | undefined}
                  variations={product.variations ?? []}
                  fields={fields}
                />
              </div>
            ) : (
              <div className="border-4 border-[#ff00de] bg-[#1a0b2e] p-4 sm:p-6 shadow-hard-pink relative">
                <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="font-pixel text-xs text-[#ff00de] mb-4 uppercase tracking-wider border-b-2 border-[#ff00de]/30 pb-2 inline-block">
                    Product Details & Instructions
                  </h3>
                  <div className="font-sans text-sm sm:text-base text-white leading-relaxed space-y-4 description-content">
                    {product.description || product.short_description ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            product.description ||
                            product.short_description ||
                            "",
                        }}
                      />
                    ) : (
                      <p className="text-gray-400">
                        Instant top-up for {product.name}. Fill in your account
                        details, select your package, and complete the payment
                        to receive your items immediately.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* DESKTOP LAYOUT (Original 2-Column Grid)    */}
        {/* ========================================== */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5 space-y-8">
            <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] shadow-hard-cyan relative overflow-hidden">
              <div className="relative h-96 w-full">
                <img
                  src={
                    product.banner_url ||
                    product.image_url ||
                    "https://placehold.co/800x400/1a0b2e/00f0ff?text=NO+IMAGE"
                  }
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
            <div>
              <h1 className="font-pixel text-3xl text-[#fcee0a] text-glow-yellow mb-4 leading-tight">
                {product.name.toUpperCase()}
              </h1>
            </div>
            <div className="border-4 border-[#ff00de] bg-[#1a0b2e] p-6 shadow-hard-pink relative">
              <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-pixel text-xs text-[#ff00de] mb-4 uppercase tracking-wider border-b-2 border-[#ff00de]/30 pb-2 inline-block">
                  Product Details & Instructions
                </h3>
                <div className="font-sans text-base text-white leading-relaxed space-y-4 description-content">
                  {product.description || product.short_description ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          product.description ||
                          product.short_description ||
                          "",
                      }}
                    />
                  ) : (
                    <p className="text-gray-400">
                      Instant top-up for {product.name}. Fill in your account
                      details on the right, select your package, and complete
                      the payment to receive your items immediately.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-24">
              {/* 🌟 DYNAMIC TRUST BAR */}
              <TrustBar
                deliveryTitle={product.delivery_title || "INSTANT"}
                deliverySub={product.delivery_subtitle || "DELIVERY"}
                regionTitle={product.region_title || "GLOBAL / BD"}
                regionSub={product.region_subtitle || "REGION"}
              />
              <CheckoutForm
                productId={
                  typeof product.id === "number"
                    ? product.id
                    : Number(product.id)
                }
                productName={product.name}
                productImage={
                  product.image_url ?? product.banner_url ?? undefined
                }
                variations={product.variations ?? []}
                fields={fields}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🌟 REUSABLE DYNAMIC TRUST BAR COMPONENT
const TrustBar = ({
  deliveryTitle = "INSTANT",
  deliverySub = "DELIVERY",
  regionTitle = "GLOBAL / BD",
  regionSub = "REGION",
}: {
  deliveryTitle?: string;
  deliverySub?: string;
  regionTitle?: string;
  regionSub?: string;
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
    <div className="flex items-center gap-2 border-2 border-[#fcee0a] bg-[#1a0b2e] p-3 shadow-hard-yellow hover:-translate-y-0.5 transition-transform">
      <Zap className="h-5 w-5 text-[#fcee0a] flex-shrink-0" />
      <div>
        <p className="font-pixel text-[9px] sm:text-[10px] text-[#fcee0a] leading-tight uppercase">
          {deliveryTitle}
        </p>
        <p className="font-pixel text-[8px] sm:text-[9px] text-gray-400 uppercase">
          {deliverySub}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 border-2 border-[#00f0ff] bg-[#1a0b2e] p-3 shadow-hard-cyan hover:-translate-y-0.5 transition-transform">
      <ShieldCheck className="h-5 w-5 text-[#00f0ff] flex-shrink-0" />
      <div>
        <p className="font-pixel text-[9px] sm:text-[10px] text-[#00f0ff] leading-tight uppercase">
          100% SAFE
        </p>
        <p className="font-pixel text-[8px] sm:text-[9px] text-gray-400 uppercase">
          GUARANTEED
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 border-2 border-[#ff00de] bg-[#1a0b2e] p-3 shadow-hard-pink hover:-translate-y-0.5 transition-transform">
      <Globe className="h-5 w-5 text-[#ff00de] flex-shrink-0" />
      <div>
        <p className="font-pixel text-[9px] sm:text-[10px] text-[#ff00de] leading-tight uppercase">
          {regionTitle}
        </p>
        <p className="font-pixel text-[8px] sm:text-[9px] text-gray-400 uppercase">
          {regionSub}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 border-2 border-[#00f0ff] bg-[#1a0b2e] p-3 shadow-hard-cyan hover:-translate-y-0.5 transition-transform">
      <Headphones className="h-5 w-5 text-[#00f0ff] flex-shrink-0" />
      <div>
        <p className="font-pixel text-[9px] sm:text-[10px] text-[#00f0ff] leading-tight uppercase">
          24/7
        </p>
        <p className="font-pixel text-[8px] sm:text-[9px] text-gray-400 uppercase">
          SUPPORT
        </p>
      </div>
    </div>
  </div>
);
