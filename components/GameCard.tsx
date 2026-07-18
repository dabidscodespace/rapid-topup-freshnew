"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

interface GameCardProps {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  min_price: number;
  max_price: number;
}

export default function GameCard({
  id,
  name,
  slug,
  image_url,
  min_price,
  max_price,
}: GameCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
        <img
          src={
            image_url ||
            "https://placehold.co/400x300/18181b/52525b?text=No+Image"
          }
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Instant Delivery Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
          <Zap className="h-3 w-3 fill-current" />
          INSTANT
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
          {name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider">
              Starting from
            </span>
            <span className="text-sm font-semibold text-zinc-300">
              ৳ {min_price.toFixed(0)}
            </span>
          </div>
          <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all group-hover:bg-indigo-500 group-hover:shadow-indigo-500/40">
            Top Up
          </button>
        </div>
      </div>
    </Link>
  );
}
