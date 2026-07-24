"use client";

import { useEffect, ReactNode } from "react"; // 🌟 1. Added ReactNode import
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard,
  ShoppingCart,
  User,
  Wallet,
  LogOut,
  Loader2,
} from "lucide-react";

// 🌟 2. Added explicit type for children here
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#fcee0a] animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // 🌟 Use display_name with fallback to username
  const displayName = user.display_name || user.username;

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/orders", label: "Order History", icon: ShoppingCart },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] p-6 shadow-hard-cyan sticky top-24">
              <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />

              <div className="relative z-10">
                {/* User Info */}
                <div className="text-center border-b-4 border-[#ff00de] pb-4 mb-6">
                  {/* 🌟 Show uploaded avatar or fallback to icon */}
                  <div className="w-16 h-16 mx-auto mb-3 border-4 border-[#fcee0a] bg-[#0a0118] flex items-center justify-center overflow-hidden">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-[#fcee0a]" />
                    )}
                  </div>
                  {/* 🌟 Show display_name instead of username */}
                  <h3 className="font-pixel text-sm text-[#fcee0a] mb-1">
                    {displayName}
                  </h3>
                  <p className="font-sans text-xs text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 mb-6">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 p-3 border-4 transition-all btn-press font-sans font-bold text-sm ${
                          isActive
                            ? "border-[#fcee0a] bg-[#0a0118] text-[#fcee0a] shadow-hard-yellow"
                            : "border-[#00f0ff] bg-[#0a0118] text-white hover:border-[#fcee0a] hover:text-[#fcee0a]"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 p-3 border-4 border-[#ff00de] bg-[#0a0118] text-[#ff00de] font-sans font-bold text-sm hover:bg-[#ff00de] hover:text-white transition-all btn-press"
                >
                  <LogOut className="h-5 w-5" />
                  LOGOUT
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">{children}</div>
        </div>
      </div>
    </div>
  );
}
