"use client";

import { useAuth } from "@/lib/AuthContext";
import { ShoppingCart, Wallet, TrendingUp } from "lucide-react";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();

  // 🌟 FIX: Tell TypeScript that if user is null, we stop rendering here.
  // This guarantees that for the rest of the component, 'user' is 100% defined.
  if (!user) return null;

  useEffect(() => {
    if (user.token) {
      refreshUser();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="border-4 border-[#ff00de] bg-[#1a0b2e] p-6 shadow-hard-pink relative">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="font-pixel text-2xl text-[#fcee0a] text-glow-yellow mb-2">
            WELCOME BACK, {user.username.toUpperCase()}!
          </h1>
          <p className="font-sans text-base text-white">
            Ready to top up your favorite games? Check your stats below.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance */}
        <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] p-6 shadow-hard-cyan relative">
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Wallet className="h-8 w-8 text-[#00f0ff]" />
              <h3 className="font-pixel text-xs text-[#00f0ff] uppercase">
                Wallet Balance
              </h3>
            </div>
            <p className="font-pixel text-3xl text-[#fcee0a] text-glow-yellow">
              ৳{user.balance || 0}
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="border-4 border-[#ff00de] bg-[#1a0b2e] p-6 shadow-hard-pink relative">
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <ShoppingCart className="h-8 w-8 text-[#ff00de]" />
              <h3 className="font-pixel text-xs text-[#ff00de] uppercase">
                Total Orders
              </h3>
            </div>
            <p className="font-pixel text-3xl text-[#fcee0a] text-glow-yellow">
              0
            </p>
          </div>
        </div>

        {/* Total Spent */}
        <div className="border-4 border-[#fcee0a] bg-[#1a0b2e] p-6 shadow-hard-yellow relative">
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-8 w-8 text-[#fcee0a]" />
              <h3 className="font-pixel text-xs text-[#fcee0a] uppercase">
                Total Spent
              </h3>
            </div>
            <p className="font-pixel text-3xl text-[#fcee0a] text-glow-yellow">
              ৳0
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] p-6 shadow-hard-cyan relative">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="font-pixel text-sm text-[#00f0ff] mb-4 uppercase">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/dashboard/orders"
              className="border-4 border-[#ff00de] bg-[#0a0118] p-4 text-center font-sans font-bold text-white hover:bg-[#ff00de] hover:text-black transition-all btn-press"
            >
              VIEW ORDER HISTORY
            </a>
            <a
              href="/dashboard/wallet"
              className="border-4 border-[#fcee0a] bg-[#0a0118] p-4 text-center font-sans font-bold text-white hover:bg-[#fcee0a] hover:text-black transition-all btn-press"
            >
              MANAGE WALLET
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
