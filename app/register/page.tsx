"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Loader2, Eye, EyeOff, Phone, AlertCircle } from "lucide-react";

interface ErrorState {
  type: string;
  message: string;
}

interface RegistrationResult {
  success: boolean;
  message?: string;
}

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ type: "", message: "" });
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError({ type: "", message: "" });

    if (password !== confirmPassword) {
      setError({ type: "error", message: "Passwords do not match." });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError({
        type: "error",
        message: "Password must be at least 6 characters.",
      });
      setLoading(false);
      return;
    }

    const cleanWhatsapp = whatsapp.replace(/[^0-9+]/g, "");
    const digitsOnly = cleanWhatsapp.replace(/\+/g, "");
    if (digitsOnly.length < 10) {
      setError({
        type: "error",
        message: "Please enter a valid WhatsApp number (minimum 10 digits).",
      });
      setLoading(false);
      return;
    }

    const result = await register(username, email, password, cleanWhatsapp);

    if (result.success) {
      router.push("/dashboard");
    } else {
      // 🌟 Smart error handling
      if (result.message?.toLowerCase().includes("email already")) {
        setError({
          type: "email_exists",
          message:
            "This email is already registered. Did you forget your password?",
        });
      } else if (result.message?.toLowerCase().includes("username already")) {
        setError({
          type: "error",
          message: "This username is already taken. Please choose another.",
        });
      } else {
        setError({
          type: "error",
          message: result.message || "Registration failed.",
        });
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border-4 border-[#ff00de] bg-[#1a0b2e] p-8 shadow-hard-pink relative">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-pixel text-2xl text-[#fcee0a] text-glow-yellow mb-2">
              NEW PLAYER
            </h1>
            <p className="font-sans text-sm text-gray-400">
              Create your account to start playing!
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
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                Email
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

            <div>
              <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                WhatsApp Number <span className="text-[#ff00de]">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#00f0ff]" />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                  className="w-full border-4 border-[#00f0ff] bg-[#0a0118] p-3 pl-10 font-sans text-sm text-white placeholder-gray-600 focus:border-[#fcee0a] focus:outline-none"
                  placeholder="e.g., +8801XXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border-4 border-[#00f0ff] bg-[#0a0118] p-3 pr-12 font-sans text-sm text-white placeholder-gray-600 focus:border-[#fcee0a] focus:outline-none"
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#fcee0a] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border-4 border-[#00f0ff] bg-[#0a0118] p-3 font-sans text-sm text-white placeholder-gray-600 focus:border-[#fcee0a] focus:outline-none"
                placeholder="Re-enter password"
              />
            </div>

            {/* 🌟 Smart Error Display */}
            {error.message && (
              <div
                className={`border-4 p-4 font-sans text-sm ${
                  error.type === "email_exists"
                    ? "border-[#fcee0a] bg-[#fcee0a]/10"
                    : "border-[#ff00de] bg-[#ff00de]/10"
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertCircle
                    className={`h-5 w-5 mt-0.5 shrink-0 ${
                      error.type === "email_exists"
                        ? "text-[#fcee0a]"
                        : "text-[#ff00de]"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`font-bold mb-2 ${
                        error.type === "email_exists"
                          ? "text-[#fcee0a]"
                          : "text-[#ff00de]"
                      }`}
                    >
                      {error.message}
                    </p>
                    {error.type === "email_exists" && (
                      <Link
                        href="/forgot-password"
                        className="inline-block border-2 border-[#fcee0a] bg-[#0a0118] px-3 py-1.5 font-pixel text-[10px] text-[#fcee0a] hover:bg-[#fcee0a] hover:text-black transition-all btn-press"
                      >
                        RESET MY PASSWORD →
                      </Link>
                    )}
                  </div>
                </div>
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
                "CREATE ACCOUNT"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-sans text-sm text-gray-400">
              Already a player?{" "}
              <Link
                href="/login"
                className="text-[#00f0ff] hover:text-[#fcee0a] font-bold"
              >
                LOGIN HERE
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
