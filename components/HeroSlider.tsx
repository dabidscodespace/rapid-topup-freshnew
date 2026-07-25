"use client";

import { useState, useEffect } from "react"; // 🌟 ADDED: useState, useEffect
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";

// 🌟 UNTOUCHED: Your exact original slides array
const slides = [
  {
    id: 1,
    badge: " PLAYER 1 READY",
    title: "PUBG MOBILE UC",
    subtitle: "INSTANT UC DELIVERY. SECURE PAYMENTS. BEST RATES IN BD.",
    price: "FROM ৳80",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    accent: "#00f0ff",
    slug: "pubg-mobile",
  },
  {
    id: 2,
    badge: "⚡ HIGH SCORE",
    title: "FREE FIRE DIAMONDS",
    subtitle: "LEVEL UP YOUR GAMEPLAY WITH INSTANT DIAMOND TOP-UPS.",
    price: "FROM ৳50",
    image:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80",
    accent: "#ff00de",
    slug: "free-fire",
  },
  {
    id: 3,
    badge: " CHAMPION",
    title: "CLASH ROYALE GOLD",
    subtitle: "UNLOCK CHESTS AND UPGRADE CARDS FASTER. SAFE SERVICE.",
    price: "FROM ৳120",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
    accent: "#fcee0a",
    slug: "clash-royale",
  },
  {
    id: 4,
    badge: "⚡ HIGH SCORE",
    title: "FREE FIRE DIAMONDS",
    subtitle: "LEVEL UP YOUR GAMEPLAY WITH INSTANT DIAMOND TOP-UPS.",
    price: "FROM ৳50",
    image:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80",
    accent: "#ff00de",
    slug: "free-fire-diamonds",
  },
  {
    id: 5,
    badge: " PLAYER 1 READY",
    title: "PUBG MOBILE UC",
    subtitle: "INSTANT UC DELIVERY. SECURE PAYMENTS. BEST RATES IN BD.",
    price: "FROM ৳80",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    accent: "#00f0ff",
    slug: "pubg-mobile",
  },
];

export default function HeroSlider() {
  // 🌟 ADDED: Prevents the initial Swiper render glitch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Wait 50ms for Swiper to apply 'swiper-slide-active' before fading in
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    // 🌟 ADDED: Conditional opacity to hide the component until Swiper is ready
    <div
      className={`relative w-full py-8 sm:py-12 overflow-hidden transition-opacity duration-500 ease-out ${isMounted ? "opacity-100" : "opacity-0"}`}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={16}
        slidesPerView={1.1}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 1.1, spaceBetween: 16 },
          640: { slidesPerView: 1.5, spaceBetween: 20 },
          1024: { slidesPerView: 2.2, spaceBetween: 20 },
        }}
        className="mySwiper !pb-14"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="!h-auto">
            <Link
              href={`/products/${slide.slug}`}
              className="block group h-full w-full"
            >
              <div
                className="relative w-full h-full min-h-[300px] sm:min-h-0 aspect-[16/9] border-4 bg-[#1a0b2e] transition-all duration-200"
                style={{
                  borderColor: slide.accent,
                  boxShadow: `8px 8px 0px 0px ${slide.accent}`,
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                  style={{ imageRendering: "pixelated" }}
                />

                <div className="absolute inset-0 crt-overlay opacity-40 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0118] via-[#0a0118]/80 to-transparent pointer-events-none" />

                <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-6 lg:p-8">
                  <div className="flex justify-between items-start">
                    <div
                      className="inline-flex items-center gap-2 border-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-[#0a0118]"
                      style={{ borderColor: slide.accent }}
                    >
                      <span
                        className="font-pixel text-[9px] sm:text-[10px] md:text-xs"
                        style={{ color: slide.accent }}
                      >
                        {slide.badge}
                      </span>
                    </div>
                  </div>

                  <div className="transform transition-transform duration-200 group-hover:translate-y-[-2px]">
                    <h3
                      className="font-pixel mb-2 sm:mb-3 leading-tight"
                      style={{
                        fontSize: "clamp(16px, 3vw, 32px)",
                        color: slide.accent,
                        textShadow: `0 0 10px ${slide.accent}`,
                      }}
                    >
                      {slide.title}
                    </h3>

                    <p className="font-bold text-[10px] sm:text-xs md:text-sm lg:text-base text-white mb-3 sm:mb-4 md:mb-6 max-w-md uppercase tracking-wider leading-tight line-clamp-2 sm:line-clamp-3">
                      {slide.subtitle}
                    </p>

                    <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mt-2 sm:mt-0">
                      <div>
                        <p className="font-pixel text-[8px] sm:text-[10px] text-gray-400 mb-0.5 sm:mb-1">
                          INSERT COIN
                        </p>
                        <p className="font-pixel text-xs sm:text-sm md:text-base text-white">
                          {slide.price}
                        </p>
                      </div>

                      <button className="flex items-center gap-1 sm:gap-2 border-2 sm:border-4 border-white bg-[#ff00de] px-2.5 py-1.5 sm:px-5 sm:py-2.5 md:px-6 md:py-3 font-pixel text-[9px] sm:text-[10px] md:text-xs text-white shadow-hard-pink btn-press group-hover:bg-[#fcee0a] group-hover:text-black group-hover:border-black group-hover:shadow-hard-yellow transition-all whitespace-nowrap">
                        START
                        <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🌟 UNTOUCHED: Your exact original styles */}
      <style jsx global>{`
        .mySwiper .swiper-slide {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: scale(0.9);
          opacity: 0.5;
          filter: grayscale(100%);
          height: auto !important;
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
