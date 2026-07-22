"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(username, password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border-4 border-[#00f0ff] bg-[#1a0b2e] p-8 shadow-hard-cyan relative">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-pixel text-2xl text-[#fcee0a] text-glow-yellow mb-2">
              PLAYER LOGIN
            </h1>
            <p className="font-sans text-sm text-gray-400">
              Welcome back, gamer!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border-4 border-[#00f0ff] bg-[#0a0118] p-3 font-sans text-sm text-white placeholder-gray-600 focus:border-[#fcee0a] focus:outline-none"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-4 border-[#00f0ff] bg-[#0a0118] p-3 font-sans text-sm text-white placeholder-gray-600 focus:border-[#fcee0a] focus:outline-none"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="border-4 border-[#ff00de] bg-[#ff00de]/10 p-3 font-sans text-sm text-center font-bold text-[#ff00de]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full border-4 border-[#fcee0a] bg-[#ff00de] py-4 font-sans font-bold text-lg text-white shadow-hard-pink btn-press hover:bg-[#fcee0a] hover:text-black hover:border-black hover:shadow-hard-yellow transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "LOGIN"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <Link
              href="/forgot-password"
              className="block text-[#fcee0a] hover:text-[#00f0ff] font-sans text-sm font-bold transition-colors"
            >
              FORGOT PASSWORD?
            </Link>
            <p className="font-sans text-sm text-gray-400">
              New player?{" "}
              <Link
                href="/register"
                className="text-[#00f0ff] hover:text-[#fcee0a] font-bold"
              >
                SIGN UP HERE
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
