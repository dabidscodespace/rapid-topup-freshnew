"use client";

import Link from "next/link";

interface GameCardProps {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  min_price: number;
  max_price: number;
  is_out_of_stock?: boolean;
}

export default function GameCard({
  id,
  name,
  slug,
  image_url,
  min_price,
  max_price,
  is_out_of_stock = false,
}: GameCardProps) {
  // Extract the inner content to avoid duplicating the massive JSX block
  const cardContent = (
    <div
      className={`relative h-full flex flex-col border-4 bg-[#1a0b2e] transition-all duration-100 ${
        is_out_of_stock
          ? "border-[#ff0000] shadow-[0_0_20px_rgba(255,0,0,0.3)]"
          : "border-[#00f0ff] hover:border-[#fcee0a] hover:shadow-hard-yellow hover:-translate-y-1"
      }`}
    >
      {/* Image */}
      <div
        className={`relative aspect-[4/3] w-full flex-shrink-0 overflow-hidden border-b-4 ${
          is_out_of_stock
            ? "border-[#ff0000]"
            : "border-[#00f0ff] group-hover:border-[#fcee0a]"
        }`}
      >
        <img
          src={
            image_url ||
            "https://placehold.co/400x300/1a0b2e/00f0ff?text=NO+SIGNAL"
          }
          alt={name}
          className={`h-full w-full object-cover transition-all duration-300 ${
            is_out_of_stock
              ? "grayscale brightness-50 contrast-125 saturate-0"
              : ""
          }`}
          style={{ imageRendering: "pixelated" }}
        />

        {/* Scanline overlay */}
        <div className="absolute inset-0 crt-overlay opacity-30 pointer-events-none" />

        {/* Out of Stock Overlay Pattern */}
        {is_out_of_stock && (
          <>
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  #ff0000 0px,
                  #ff0000 2px,
                  transparent 2px,
                  transparent 8px
                )`,
              }}
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                className="w-32 h-32 text-[#ff0000] opacity-40"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 10 L90 90 M90 10 L10 90"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="square"
                />
              </svg>
            </div>
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />
            </div>
          </>
        )}

        {/* Badge: SOLD OUT or NEW */}
        {is_out_of_stock ? (
          <>
            <div className="absolute top-3 right-3 transform rotate-6 z-10">
              <div className="relative bg-[#ff0000] border-4 border-white px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                <span className="font-pixel text-[10px] text-white tracking-wider whitespace-nowrap">
                  SOLD OUT
                </span>
                <div className="absolute top-0 left-0 w-full h-1 bg-white/50 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 transform -rotate-3 opacity-80">
              <div className="bg-black border-2 border-[#ff0000] px-2 py-1">
                <span className="font-pixel text-[6px] text-[#ff0000]">
                  OUT OF STOCK
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute top-2 right-2 bg-[#ff00de] px-2 py-1 border-2 border-white">
            <span className="font-pixel text-[8px] text-white">NEW!</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={`flex flex-col flex-grow p-3 sm:p-4 ${
          is_out_of_stock ? "bg-gradient-to-b from-[#2a0a0a] to-[#1a0b2e]" : ""
        }`}
      >
        <h3
          className={`font-pixel text-[10px] sm:text-xs leading-tight mb-2 sm:mb-3 line-clamp-2 ${
            is_out_of_stock
              ? "text-[#ff0000] drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]"
              : "text-[#00f0ff] group-hover:text-[#fcee0a]"
          }`}
        >
          {name.toUpperCase()}
        </h3>

        {/* Bottom Section */}
        <div className="flex items-center justify-between mt-auto pt-1 sm:pt-0">
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[10px] font-bold text-gray-400">
              {is_out_of_stock ? "STATUS" : "STARTING AT"}
            </span>
            <span
              className={`font-pixel text-xs sm:text-sm ${
                is_out_of_stock ? "text-[#ff0000] animate-pulse" : "text-white"
              }`}
            >
              {is_out_of_stock ? (
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#ff0000] animate-ping flex-shrink-0" />
                  UNAVAILABLE
                </span>
              ) : (
                `৳${min_price.toFixed(0)}`
              )}
            </span>
          </div>

          {/* Play Button: Completely hidden if out of stock */}
          {!is_out_of_stock && (
            <button className="border-2 px-2 py-1.5 sm:px-3 sm:py-2 font-pixel text-[9px] sm:text-[10px] whitespace-nowrap transition-all bg-[#ff00de] border-white text-white shadow-hard-pink btn-press group-hover:bg-[#fcee0a] group-hover:text-black group-hover:border-black group-hover:shadow-hard-yellow">
              PLAY
            </button>
          )}
        </div>
      </div>

      {/* Corner decorations for out of stock */}
      {is_out_of_stock && (
        <>
          <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-[#ff0000]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-[#ff0000]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-[#ff0000]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-[#ff0000]" />
        </>
      )}
    </div>
  );

  // Conditionally render a <div> instead of <Link> if out of stock
  if (is_out_of_stock) {
    return (
      <div className="group block h-full w-full cursor-not-allowed">
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/products/${slug}`}
      className="group block h-full w-full"
      prefetch={false}
    >
      {cardContent}
    </Link>
  );
}
