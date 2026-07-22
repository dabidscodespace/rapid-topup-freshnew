import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "CoinHub Arcade - Top Up",
  description: "Insert Coin to Top Up!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased relative">
        <AuthProvider>
          <div className="fixed inset-0 z-0 retro-grid opacity-40" />
          <div className="fixed inset-0 z-50 crt-overlay opacity-20" />

          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>

            <footer className="border-t-4 border-[#ff00de] bg-[#0a0118] py-8 text-center">
              <p className="font-pixel text-xs text-[#00f0ff]">
                © 2026 COINHUB ARCADE • INSERT COIN TO CONTINUE
              </p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
