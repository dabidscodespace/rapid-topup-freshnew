"use client";

import Image from "next/image";

interface CategoryCardProps {
  name: string;
  image_url: string;
  onClick: () => void;
  count: number;
}

export default function CategoryCard({
  name,
  image_url,
  onClick,
  count,
}: CategoryCardProps) {
  return (
    <button onClick={onClick} className="group block h-full w-full text-left">
      <div className="relative h-full flex flex-col border-4 border-[#00f0ff] bg-[#1a0b2e] transition-all duration-100 hover:border-[#fcee0a] hover:shadow-hard-yellow hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full flex-shrink-0 overflow-hidden border-b-4 border-[#00f0ff] group-hover:border-[#fcee0a]">
          <Image
            src={
              image_url ||
              "https://placehold.co/400x300/1a0b2e/00f0ff?text=NO+SIGNAL"
            }
            alt={name}
            fill
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="absolute inset-0 crt-overlay opacity-30 pointer-events-none" />

          {/* Badge */}
          <div className="absolute top-2 right-2 bg-[#ff00de] px-2 py-1 border-2 border-white">
            <span className="font-pixel text-[8px] text-white">
              {count} GAMES
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-grow p-3 sm:p-4">
          <h3 className="font-pixel text-[10px] sm:text-xs leading-tight mb-2 sm:mb-3 line-clamp-2 text-[#00f0ff] group-hover:text-[#fcee0a]">
            {name.toUpperCase()}
          </h3>

          {/* Bottom Section (Mirrors GameCard's Price + Button layout) */}
          <div className="flex items-center justify-between mt-auto pt-1">
            <span className="font-pixel text-[10px] sm:text-xs text-[#fcee0a]">
              {count} GAMES
            </span>

            <div className="border-2 px-3 py-1.5 font-pixel text-[10px] whitespace-nowrap bg-[#ff00de] border-white text-white shadow-hard-pink group-hover:bg-[#fcee0a] group-hover:text-black group-hover:border-black group-hover:shadow-hard-yellow transition-all">
              VIEW
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
