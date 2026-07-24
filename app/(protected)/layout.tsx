"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 🌟 If done loading and NO user, kick them to login immediately
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // 🌟 Show a retro loading screen while checking auth (prevents flashing content)
  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0118]">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-[#00f0ff]/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-[#00f0ff] border-r-[#00f0ff]/60 rounded-full animate-spin" />
        </div>
        <p className="font-pixel text-[#00f0ff] text-xs animate-pulse tracking-widest">
          VERIFYING ACCESS...
        </p>
      </div>
    );
  }

  // 🌟 If user is logged in, render the actual dashboard pages
  return <>{children}</>;
}
