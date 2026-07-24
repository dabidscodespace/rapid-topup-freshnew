"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();

      if (data.success) {
        setSent(true);
      } else {
        setError(data.message || "Failed to send reset email.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border-4 border-[#00f0ff] bg-[#1a0b2e] p-8 shadow-hard-cyan relative">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />

        <div className="relative z-10">
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 border-4 border-[#fcee0a] bg-[#0a0118] flex items-center justify-center">
                  <Mail className="h-10 w-10 text-[#fcee0a]" />
                </div>
                <h1 className="font-pixel text-2xl text-[#fcee0a] text-glow-yellow mb-2">
                  FORGOT PASSWORD?
                </h1>
                <p className="font-sans text-sm text-gray-400">
                  Enter your email and we'll send you a link to reset your
                  password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border-4 border-[#00f0ff] bg-[#0a0118] p-3 font-sans text-sm text-white placeholder-gray-600 focus:border-[#fcee0a] focus:outline-none"
                    placeholder="your@email.com"
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
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "SEND RESET LINK"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-[#00f0ff] hover:text-[#fcee0a] font-sans text-sm font-bold transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> BACK TO LOGIN
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 border-4 border-[#00f0ff] bg-[#0a0118] flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-[#00f0ff]" />
              </div>
              <h1 className="font-pixel text-xl text-[#fcee0a] text-glow-yellow mb-4">
                CHECK YOUR EMAIL!
              </h1>
              <p className="font-sans text-sm text-white mb-6">
                If an account exists with{" "}
                <span className="text-[#00f0ff] font-bold">{email}</span>, we've
                sent a password reset link.
              </p>
              <p className="font-sans text-xs text-gray-400 mb-6">
                Didn't receive it? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setSent(false)}
                  className="w-full border-4 border-[#00f0ff] bg-[#0a0118] py-3 font-sans font-bold text-sm text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all btn-press uppercase"
                >
                  SEND AGAIN
                </button>
                <Link
                  href="/login"
                  className="w-full block border-4 border-[#fcee0a] bg-[#ff00de] py-3 font-sans font-bold text-sm text-white text-center hover:bg-[#fcee0a] hover:text-black transition-all btn-press uppercase"
                >
                  BACK TO LOGIN
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
