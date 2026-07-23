'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

const categories = [
  { id: 'popular', name: ' POPULAR' },
  { id: 'entertainment', name: '🎬 ENTERTAINMENT' },
  { id: 'battle-royale', name: '⚔️ BATTLE ROYALE' },
  { id: 'all-games', name: '🎮 ALL GAMES' },
];

export default function CategoryNav() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-30 w-full py-4 border-b-4 border-[#ff00de] bg-[#0a0118]/95 backdrop-blur-sm overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[FreeMode]}
          freeMode={true}
          slidesPerView="auto"
          spaceBetween={12}
          className="!overflow-visible"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.id} className="!w-auto">
              <button
                onClick={() => scrollToSection(cat.id)}
                className="group flex items-center gap-2 whitespace-nowrap border-4 border-[#00f0ff] bg-[#1a0b2e] px-5 py-3 font-pixel text-[10px] text-[#00f0ff] shadow-hard-cyan btn-press transition-colors hover:bg-[#fcee0a] hover:text-black hover:border-black hover:shadow-hard-yellow"
              >
                {cat.name}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}