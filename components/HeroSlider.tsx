'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
  {
    id: 1,
    badge: ' PLAYER 1 READY',
    title: 'PUBG MOBILE UC',
    subtitle: 'INSTANT UC DELIVERY. SECURE PAYMENTS. BEST RATES IN BD.',
    price: 'FROM ৳80',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80',
    accent: '#00f0ff',
    slug: 'pubg-mobile'
  },
  {
    id: 2,
    badge: '⚡ HIGH SCORE',
    title: 'FREE FIRE DIAMONDS',
    subtitle: 'LEVEL UP YOUR GAMEPLAY WITH INSTANT DIAMOND TOP-UPS.',
    price: 'FROM ৳50',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80',
    accent: '#ff00de',
    slug: 'free-fire'
  },
  {
    id: 3,
    badge: ' CHAMPION',
    title: 'CLASH ROYALE GOLD',
    subtitle: 'UNLOCK CHESTS AND UPGRADE CARDS FASTER. SAFE SERVICE.',
    price: 'FROM ৳120',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
    accent: '#fcee0a',
    slug: 'clash-royale'
  }
];

export default function HeroSlider() {
  return (
    <div className="relative w-full py-12 overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1.1}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1.5, spaceBetween: 20 },
          1024: { slidesPerView: 2.2, spaceBetween: 40 },
        }}
        className="mySwiper !pb-14"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="!h-auto !pt-4 !pb-10">
            <Link href={`/products/${slide.slug}`} className="block group h-full">
              <div 
                className="relative aspect-[16/9] w-full border-4 bg-[#1a0b2e] transition-all duration-200"
                style={{ borderColor: slide.accent, boxShadow: `8px 8px 0px 0px ${slide.accent}` }}
              >
                <img src={slide.image} alt={slide.title} className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" style={{ imageRendering: 'pixelated' }} />
                <div className="absolute inset-0 crt-overlay opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0118] via-[#0a0118]/80 to-transparent" />

                <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-6 lg:p-8">
                  <div className="flex justify-between items-start">
                    <div 
                      className="inline-flex items-center gap-2 border-2 px-2 py-1 md:px-3 md:py-1.5 bg-[#0a0118]"
                      style={{ borderColor: slide.accent }}
                    >
                      <span className="font-pixel text-[8px] md:text-[10px]" style={{ color: slide.accent }}>
                        {slide.badge}
                      </span>
                    </div>
                  </div>

                  <div className="transform transition-transform duration-200 group-hover:translate-y-[-2px]">
                    <h3 
                      className="font-pixel mb-2 md:mb-3 leading-tight"
                      style={{ 
                        fontSize: 'clamp(14px, 3vw, 32px)',
                        color: slide.accent, 
                        textShadow: `0 0 10px ${slide.accent}` 
                      }}
                    >
                      {slide.title}
                    </h3>
                    <p className="font-bold text-xs md:text-sm lg:text-base text-white mb-4 md:mb-6 max-w-md uppercase tracking-wider leading-tight">
                      {slide.subtitle}
                    </p>
                    
                    <div className="flex items-center gap-4 md:gap-6">
                      <div>
                        <p className="font-pixel text-[8px] md:text-[10px] text-gray-400 mb-1">INSERT COIN</p>
                        <p className="font-pixel text-sm md:text-lg text-white">{slide.price}</p>
                      </div>
                      <button 
                        className="flex items-center gap-1 md:gap-2 border-2 md:border-4 border-white bg-[#ff00de] px-3 py-2 md:px-6 md:py-3 font-pixel text-[8px] md:text-xs text-white shadow-hard-pink btn-press group-hover:bg-[#fcee0a] group-hover:text-black group-hover:border-black group-hover:shadow-hard-yellow transition-all"
                      >
                        START
                        <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .mySwiper .swiper-slide {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: scale(0.9);
          opacity: 0.5;
          filter: grayscale(100%);
        }
        .mySwiper .swiper-slide-active {
          transform: scale(1);
          opacity: 1;
          filter: grayscale(0%);
          z-index: 10;
        }
      `}</style>
    </div>
  );
}