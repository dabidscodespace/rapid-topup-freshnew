"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // 🌟 Import Image component
import { Search, Menu, Gamepad2, ChevronDown, Coins } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import SearchModal from "./SearchModal";
import MobileMenu from "./MobileMenu";
import UserDropdown from "./UserDropdown";

export default function Navbar() {
  const { user, loading, logout, refreshUser } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.token) {
      refreshUser();
    }
  }, []);

  // 🌟 SAFELY PARSE BALANCE AS A NUMBER TO PREVENT .toFixed ERRORS
  const displayUser = user
    ? {
        name: user.display_name || user.username,
        email: user.email,
        balance: Number(user.balance) || 0,
        avatar_url: user.avatar_url,
      }
    : null;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="z-30 w-full border-b-4 border-[#ff00de] bg-[#0a0118]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between">
            
            {/*  LOGO SECTION */}
            <Link href="/" className="flex items-center group">
              <div className="relative h-16 w-30 transition-transform group-hover:scale-105">
                <Image 
                  src="/images/logo.png" 
                  alt="8BitTopUp Logo" 
                  fill
                  priority // Loads immediately for better LCP score
                  className="object-contain pixelated" // Keeps edges sharp
                />
              </div>
            </Link>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-3 border-2 border-[#00f0ff] bg-[#1a0b2e] px-4 py-2 text-xs font-bold text-[#00f0ff] shadow-hard-cyan btn-press hover:bg-[#00f0ff] hover:text-black transition-all w-64"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left font-pixel text-[10px]">
                SEARCH GAMES...
              </span>
              <kbd className="hidden sm:inline-block rounded-none border border-[#00f0ff] bg-[#0a0118] px-1.5 py-0.5 text-[8px] font-mono text-[#00f0ff]">
                CTRL K
              </kbd>
            </button>

            <div className="hidden md:flex items-center gap-4">
              {displayUser ? (
                <div className="relative z-40" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 border-2 border-[#fcee0a] bg-[#1a0b2e] py-1.5 pl-1.5 pr-3 shadow-hard-yellow btn-press hover:bg-[#fcee0a] hover:text-black transition-all group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center border border-[#fcee0a] bg-[#0a0118] overflow-hidden group-hover:bg-black">
                      {displayUser.avatar_url ? (
                        <img
                          src={displayUser.avatar_url}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[#fcee0a] font-pixel text-xs group-hover:text-[#fcee0a]">
                          {displayUser.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-pixel text-[10px] text-[#fcee0a] leading-none group-hover:text-black">
                        {displayUser.name.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-[#00f0ff] leading-none mt-1 group-hover:text-black">
                        <Coins className="h-3 w-3" />{" "}
                        {displayUser.balance.toFixed(0)}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-[#fcee0a] transition-transform group-hover:text-black ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <UserDropdown
                    user={displayUser}
                    isOpen={isDropdownOpen}
                    onClose={() => setIsDropdownOpen(false)}
                    onLogout={logout}
                  />
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="border-2 border-[#fcee0a] bg-[#1a0b2e] px-4 py-2 font-pixel text-[10px] text-[#fcee0a] shadow-hard-yellow btn-press hover:bg-[#fcee0a] hover:text-black transition-colors"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/register"
                    className="border-2 border-[#ff00de] bg-[#1a0b2e] px-4 py-2 font-pixel text-[10px] text-[#ff00de] shadow-hard-pink btn-press hover:bg-[#ff00de] hover:text-white transition-colors"
                  >
                    SIGN UP
                  </Link>
                </>
              )}
            </div>

            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center border-2 border-[#00f0ff] bg-[#1a0b2e] text-[#00f0ff] btn-press hover:bg-[#00f0ff] hover:text-black transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center border-2 border-[#ff00de] bg-[#1a0b2e] text-[#ff00de] btn-press hover:bg-[#ff00de] hover:text-white transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={displayUser}
        onLogout={logout}
      />
    </>
  );
}