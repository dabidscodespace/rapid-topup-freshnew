"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface ValidateResetKeyResponse {
  success: boolean;
  message?: string;
}

interface ResetPasswordRequest {
  key: string | null;
  email: string | null;
  new_password: string;
}

interface UserData {
  token: string;
  [key: string]: unknown;
}

interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  data?: UserData;
}

type StatusType = "loading" | "valid" | "invalid" | "success";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const key = searchParams.get("key");
  const email = searchParams.get("email");

  const [status, setStatus] = useState("loading"); // loading, valid, invalid, success
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!key || !email) {
      setStatus("invalid");
      return;
    }

    const validateKey = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/auth/validate-reset-key`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, email }),
          },
        );
        const data = await res.json();

        if (data.success) {
          setStatus("valid");
        } else {
          setStatus("invalid");
          setError(data.message || "Invalid reset link.");
        }
      } catch (err) {
        setStatus("invalid");
        setError("Failed to validate reset link.");
      }
    };

    validateKey();
  }, [key, email]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, email, new_password: newPassword }),
        },
      );
      const data: ResetPasswordResponse = await res.json();

      if (data.success) {
        setStatus("success");
        // Auto-login after reset
        if (data.data?.token) {
          localStorage.setItem("arcade_user", JSON.stringify(data.data));
        }
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md border-4 border-[#00f0ff] bg-[#1a0b2e] p-8 shadow-hard-cyan relative text-center">
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <Loader2 className="h-16 w-16 text-[#fcee0a] animate-spin mx-auto mb-4" />
            <p className="font-pixel text-sm text-[#fcee0a]">
              VALIDATING RESET LINK...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md border-4 border-[#ff00de] bg-[#1a0b2e] p-8 shadow-hard-pink relative text-center">
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <AlertTriangle className="h-20 w-20 text-[#ff00de] mx-auto mb-4" />
            <h1 className="font-pixel text-xl text-[#ff00de] mb-4">
              INVALID LINK
            </h1>
            <p className="font-sans text-sm text-white mb-6">
              {error || "This password reset link is invalid or has expired."}
            </p>
            <div className="space-y-3">
              <Link
                href="/forgot-password"
                className="w-full block border-4 border-[#fcee0a] bg-[#ff00de] py-3 font-sans font-bold text-sm text-white text-center hover:bg-[#fcee0a] hover:text-black transition-all btn-press uppercase"
              >
                REQUEST NEW LINK
              </Link>
              <Link
                href="/login"
                className="w-full block border-4 border-[#00f0ff] bg-[#0a0118] py-3 font-sans font-bold text-sm text-[#00f0ff] text-center hover:bg-[#00f0ff] hover:text-black transition-all btn-press uppercase"
              >
                BACK TO LOGIN
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md border-4 border-[#00f0ff] bg-[#1a0b2e] p-8 shadow-hard-cyan relative text-center">
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <CheckCircle className="h-20 w-20 text-[#00f0ff] mx-auto mb-4 drop-shadow-[0_0_10px_#00f0ff]" />
            <h1 className="font-pixel text-xl text-[#fcee0a] text-glow-yellow mb-4">
              PASSWORD RESET!
            </h1>
            <p className="font-sans text-sm text-white mb-6">
              Your password has been successfully reset. You are now logged in.
            </p>
            <Link
              href="/dashboard"
              className="w-full block border-4 border-[#fcee0a] bg-[#ff00de] py-3 font-sans font-bold text-sm text-white text-center hover:bg-[#fcee0a] hover:text-black transition-all btn-press uppercase"
            >
              GO TO DASHBOARD
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border-4 border-[#00f0ff] bg-[#1a0b2e] p-8 shadow-hard-cyan relative">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 border-4 border-[#fcee0a] bg-[#0a0118] flex items-center justify-center">
              <Lock className="h-10 w-10 text-[#fcee0a]" />
            </div>
            <h1 className="font-pixel text-2xl text-[#fcee0a] text-glow-yellow mb-2">
              RESET PASSWORD
            </h1>
            <p className="font-sans text-sm text-gray-400">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                placeholder="Re-enter new password"
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
                "RESET PASSWORD"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-[#fcee0a] animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
