"use client";

import { Gamepad2, Trophy, Zap, Users } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    name: "Battle Royale",
    icon: Trophy,
    count: 12,
    color: "from-orange-500 to-red-600",
    slug: "battle-royale",
    description: "PUBG, Free Fire, COD Mobile",
  },
  {
    name: "MOBA Games",
    icon: Gamepad2,
    count: 8,
    color: "from-blue-500 to-indigo-600",
    slug: "moba-games",
    description: "Mobile Legends, Arena of Valor",
  },
  {
    name: "Strategy",
    icon: Zap,
    count: 6,
    color: "from-purple-500 to-pink-600",
    slug: "strategy",
    description: "Clash Royale, Clash of Clans",
  },
  {
    name: "Sports",
    icon: Users,
    count: 5,
    color: "from-emerald-500 to-teal-600",
    slug: "sports",
    description: "FIFA Mobile, eFootball",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Browse by Category
          </h2>
          <p className="text-zinc-400">Find your favorite game type</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 p-6 transition-all hover:border-white/10 hover:bg-zinc-800/50"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 transition-opacity group-hover:opacity-10`}
              />

              {/* Icon */}
              <div
                className={`relative mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} shadow-lg`}
              >
                <category.icon className="h-7 w-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="relative text-lg font-bold text-white mb-1 group-hover:text-white">
                {category.name}
              </h3>
              <p className="relative text-sm text-zinc-400 mb-3">
                {category.description}
              </p>

              <div className="relative flex items-center gap-2 text-sm font-medium text-zinc-300 group-hover:text-white">
                <span>{category.count} Games</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
