"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import GameCard from "@/components/GameCard";

type Product = {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  min_price: number;
  max_price: number;
  is_out_of_stock?: boolean;
  variations?: any[];
  stock_status?: string;
  is_in_stock?: boolean;
};

type CategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  products: Product[];
  loading: boolean;
};

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

export default function CategoryModal({
  isOpen,
  onClose,
  categoryName,
  products,
  loading,
}: CategoryModalProps) {
  // 🌟 Simple, glitch-free body scroll and Escape key lock
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    // 🌟 CSS handles the fade. pointer-events-none ensures it doesn't block clicks when hidden.
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* 
        🌟 OPTIMIZED BACKDROP: 
        1. Darker bg (95% opacity) + lighter blur (sm) = Same premium look, but renders instantly.
        2. transform-gpu forces hardware acceleration, preventing the "delayed blur" stutter.
      */}
      <div
        className="absolute inset-0 bg-[#05000a]/95 backdrop-blur-sm transition-opacity duration-300 transform-gpu"
        onClick={onClose}
      />

      {/* 🌟 Modal Container: transform-gpu ensures the scale/slide animation is handled by the GPU */}
      <div
        className={`relative w-full max-w-5xl max-h-[85vh] bg-[#1a0b2e] border-4 border-[#00f0ff] shadow-[0_0_80px_rgba(0,240,255,0.1)] flex flex-col overflow-hidden transition-all duration-300 ease-out transform-gpu ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Clean, Minimal Header */}
        <div className="relative flex-shrink-0 border-b-4 border-[#00f0ff] bg-[#0a0118] p-5 sm:p-6 flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="font-pixel text-lg sm:text-2xl text-[#fcee0a] text-glow-yellow uppercase tracking-wider leading-tight truncate">
              {categoryName}
            </h2>
            <p className="font-sans text-xs text-[#00f0ff]/70 mt-1 uppercase tracking-widest">
              Select a package to continue
            </p>
          </div>

          <button
            onClick={onClose}
            className="group flex h-12 w-12 items-center justify-center border-2 border-[#ff00de] bg-[#1a0b2e] text-[#ff00de] transition-all hover:bg-[#ff00de] hover:text-white btn-press flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-fr">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-fr">
              {products.map((product) => {
                const isOutOfStock =
                  product.variations && product.variations.length > 0
                    ? product.variations.every(
                        (v: any) => v.is_in_stock === false,
                      )
                    : product.stock_status === "outofstock" ||
                      product.is_in_stock === false;

                return (
                  <GameCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    image_url={product.image_url}
                    min_price={product.min_price}
                    max_price={product.max_price}
                    is_out_of_stock={isOutOfStock}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="font-pixel text-sm text-gray-400">
                NO GAMES FOUND IN THIS CATEGORY.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sleek Retro Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0118;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00f0ff;
          border-radius: 0;
          border: 2px solid #0a0118;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #fcee0a;
        }
      `}</style>
    </div>
  );
}
