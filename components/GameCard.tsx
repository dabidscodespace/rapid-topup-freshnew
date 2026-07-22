'use client';

import Link from 'next/link';

interface GameCardProps {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  min_price: number;
  max_price: number;
}

export default function GameCard({ id, name, slug, image_url, min_price }: GameCardProps) {
  return (
    <Link href={`/products/${slug}`} className="group block h-full">
      {/* Hard Border Container */}
      <div className="relative h-full border-4 border-[#00f0ff] bg-[#1a0b2e] transition-all duration-100 hover:border-[#fcee0a] hover:shadow-hard-yellow hover:-translate-y-1">
        
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden border-b-4 border-[#00f0ff] group-hover:border-[#fcee0a]">
          <img 
            src={image_url || 'https://placehold.co/400x300/1a0b2e/00f0ff?text=NO+SIGNAL'} 
            alt={name} 
            className="h-full w-full object-cover pixelated" // Add image-rendering: pixelated in CSS if desired
            style={{ imageRendering: 'pixelated' }}
          />
          {/* Scanline overlay for image */}
          <div className="absolute inset-0 crt-overlay opacity-30" />
          
          {/* Pixel Badge */}
          <div className="absolute top-2 right-2 bg-[#ff00de] px-2 py-1 border-2 border-white">
            <span className="font-pixel text-[8px] text-white">NEW!</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-pixel text-xs text-[#00f0ff] leading-tight mb-3 line-clamp-2 group-hover:text-[#fcee0a]">
            {name.toUpperCase()}
          </h3>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold">STARTING AT</span>
              <span className="font-pixel text-sm text-white">৳{min_price.toFixed(0)}</span>
            </div>
            <button className="bg-[#ff00de] border-2 border-white px-3 py-2 font-pixel text-[10px] text-white shadow-hard-pink btn-press group-hover:bg-[#fcee0a] group-hover:text-black group-hover:shadow-hard-yellow transition-colors">
              PLAY
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}