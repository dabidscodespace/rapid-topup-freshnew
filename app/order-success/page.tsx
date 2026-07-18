"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order");
  const invoiceId = searchParams.get("invoice_id"); // 🌟 GRAB THE INVOICE ID FROM URL

  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      setMessage("No order ID found in the URL.");
      return;
    }

    const verifyPayment = async () => {
      try {
        // 🌟 CHANGED: rapid-topup/v1 -> headless/v1
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/uddoktapay/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: parseInt(orderId),
              invoice_id: invoiceId || "",
            }),
          },
        );

        const data = await res.json();

        if (data.success && data.status === "completed") {
          setStatus("success");
          setMessage(
            `Order #${orderId} completed successfully! Your top-up is being processed.`,
          );
        } else {
          setStatus("failed");
          setMessage(
            data.message ||
              "Payment verification failed. Please contact support with Order #" +
                orderId,
          );
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("failed");
        setMessage(
          "Network error while verifying payment. Please check your order status or contact support.",
        );
      }
    };

    verifyPayment();
  }, [orderId, invoiceId]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
            <h2 className="text-xl font-semibold text-white">
              Verifying Payment...
            </h2>
            <p className="text-zinc-400 text-sm">
              Please do not close this window.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Payment Successful!
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{message}</p>
            <Link href="/">
              <button className="mt-6 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </button>
            </Link>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Payment Failed or Pending
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{message}</p>
            <div className="flex gap-3 w-full mt-4">
              <button
                onClick={() => router.push("/")}
                className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-colors"
              >
                Home
              </button>
              <Link href="/" className="flex-1">
                <button className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors">
                  Contact Support
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
