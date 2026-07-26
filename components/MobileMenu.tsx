"use client";

import Link from "next/link";
import {
  X,
  User,
  ShoppingBag,
  Wallet,
  LogOut,
  Home,
  Gamepad2,
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    avatar_url?: string;
    balance: number;
  } | null;
  onLogout: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  onLogout,
}: MobileMenuProps) {
  if (!isOpen) return null;

  // 🌟 AUTHENTICATED LINKS (Matches UserDropdown exactly)
  const authLinks = [
    { name: "DASHBOARD", href: "/dashboard", icon: User },
    { name: "HISTORY", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "WALLET", href: "/dashboard/wallet", icon: Wallet },
  ];

  // 🌟 STREAMLINED GUEST LINKS (No useless fluff, just core navigation)
  const guestLinks = [
    { name: "HOME", href: "/", icon: Home },
    { name: "ALL GAMES", href: "/#all-games", icon: Gamepad2 },
  ];

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm border-l-4 border-[#00f0ff] bg-[#0a0118] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="absolute inset-0 crt-overlay opacity-20 pointer-events-none z-10" />

        <div className="relative z-20 flex items-center justify-between p-5 border-b-4 border-[#ff00de] bg-[#1a0b2e]">
          <span className="font-pixel text-sm text-[#fcee0a] text-glow-yellow">
            {user ? user.name.toUpperCase() : "GUEST"}
          </span>
          <button
            onClick={onClose}
            className="p-2 border-2 border-[#ff00de] bg-[#0a0118] text-[#ff00de] hover:bg-[#ff00de] hover:text-white transition-colors btn-press"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative z-20 flex-1 overflow-y-auto">
          {user ? (
            // 🌟 AUTHENTICATED VIEW
            <div className="p-5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 border-2 border-[#00f0ff] bg-[#1a0b2e] flex items-center justify-center overflow-hidden shadow-[3px_3px_0px_0px_#00f0ff]">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[#00f0ff] font-pixel text-xl">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-pixel text-xs text-[#fcee0a]">
                      {user.name.toUpperCase()}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="border-4 border-[#fcee0a] bg-[#1a0b2e] p-4 shadow-hard-yellow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-pixel text-[10px] text-[#ff00de] flex items-center gap-1.5">
                      <Wallet className="h-3 w-3" /> CREDITS
                    </span>
                  </div>
                  <p className="font-pixel text-xl text-[#00f0ff] text-glow-cyan tracking-wider">
                    ৳{" "}
                    {(Number(user.balance) || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {authLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center gap-4 border-2 border-[#00f0ff] bg-[#1a0b2e] px-4 py-4 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all btn-press group"
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="font-pixel text-xs">{link.name}</span>
                  </Link>
                ))}

                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="flex w-full items-center gap-4 border-2 border-[#ff00de] bg-[#1a0b2e] px-4 py-4 text-[#ff00de] hover:bg-[#ff00de] hover:text-white transition-all btn-press group"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-pixel text-xs">LOGOUT</span>
                </button>
              </div>
            </div>
          ) : (
            // 🌟 STREAMLINED GUEST VIEW
            <div className="p-5 space-y-6">
              <div className="space-y-3">
                {guestLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center gap-4 border-2 border-[#00f0ff] bg-[#1a0b2e] px-4 py-4 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all btn-press group"
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="font-pixel text-xs">{link.name}</span>
                  </Link>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t-4 border-[#ff00de]">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 border-4 border-[#fcee0a] bg-[#1a0b2e] py-4 font-pixel text-xs text-[#fcee0a] shadow-hard-yellow btn-press hover:bg-[#fcee0a] hover:text-black transition-colors"
                >
                  INSERT COIN (LOGIN)
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 border-4 border-[#ff00de] bg-[#1a0b2e] py-4 font-pixel text-xs text-[#ff00de] shadow-hard-pink btn-press hover:bg-[#ff00de] hover:text-white transition-colors"
                >
                  NEW PLAYER (SIGN UP)
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
