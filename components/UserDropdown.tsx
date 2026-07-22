"use client";

import Link from "next/link";
import { User, ShoppingBag, Wallet, LogOut, ArrowUpRight } from "lucide-react";

export default function UserDropdown({ user, isOpen, onClose, onLogout }) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-3 w-72 origin-top-right border-4 border-[#fcee0a] bg-[#1a0b2e] shadow-hard-yellow z-50">
      <div className="border-b-4 border-[#fcee0a] p-4 bg-[#0a0118]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 border-2 border-[#00f0ff] bg-[#1a0b2e] flex items-center justify-center overflow-hidden">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[#00f0ff] font-pixel text-lg">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-pixel text-xs text-[#fcee0a] truncate">
              {user.name.toUpperCase()}
            </p>
            <p className="text-[10px] text-gray-400 font-bold truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b-4 border-[#ff00de] bg-[#0a0118]">
        <div className="flex items-center justify-between mb-1">
          <span className="font-pixel text-[10px] text-[#ff00de] flex items-center gap-1.5">
            <Wallet className="h-3 w-3" /> CREDITS
          </span>
        </div>
        <p className="font-pixel text-xl text-[#00f0ff] text-glow-cyan tracking-wider">
          ৳{" "}
          {(Number(user.balance) || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}{" "}
        </p>
      </div>

      <div className="p-2 space-y-2 bg-[#1a0b2e]">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center justify-between rounded-none border-2 border-[#00f0ff] bg-[#0a0118] px-3 py-3 text-xs font-bold text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-colors btn-press"
        >
          <div className="flex items-center gap-3">
            <User className="h-4 w-4" />
            <span className="font-pixel text-[10px]">DASHBOARD</span>
          </div>
          <ArrowUpRight className="h-3 w-3" />
        </Link>

        <Link
          href="/dashboard/orders"
          onClick={onClose}
          className="flex items-center justify-between rounded-none border-2 border-[#00f0ff] bg-[#0a0118] px-3 py-3 text-xs font-bold text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-colors btn-press"
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-4 w-4" />
            <span className="font-pixel text-[10px]">HISTORY</span>
          </div>
          <ArrowUpRight className="h-3 w-3" />
        </Link>

        <Link
          href="/dashboard/wallet"
          onClick={onClose}
          className="flex items-center justify-between rounded-none border-2 border-[#00f0ff] bg-[#0a0118] px-3 py-3 text-xs font-bold text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-colors btn-press"
        >
          <div className="flex items-center gap-3">
            <Wallet className="h-4 w-4" />
            <span className="font-pixel text-[10px]">WALLET</span>
          </div>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="p-2 bg-[#1a0b2e]">
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="flex w-full items-center gap-3 rounded-none border-2 border-[#ff00de] bg-[#0a0118] px-3 py-3 text-xs font-bold text-[#ff00de] hover:bg-[#ff00de] hover:text-white transition-colors btn-press"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-pixel text-[10px]">LOGOUT</span>
        </button>
      </div>
    </div>
  );
}
