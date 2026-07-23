"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  Wallet,
  Plus,
  History,
  ArrowUpRight,
  ShoppingBag,
  RotateCcw,
  X,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function WalletPage() {
  const { user, updateUser, refreshUser } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Top-up Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bkash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
    refreshUser();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/auth/wallet-history?token=${user?.token}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        },
      );
      const data = await res.json();
      if (data.success) setHistory(data.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const amountNum = parseFloat(amount);
    if (amountNum < 10) {
      setError("Minimum top-up is ৳10.");
      setSubmitting(false);
      return;
    }
    if (amountNum > 50000) {
      setError("Maximum top-up is ৳50,000.");
      setSubmitting(false);
      return;
    }

    try {
      // 1. Create the wallet top-up order
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/auth/wallet-topup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token || ""}`,
          },
          body: JSON.stringify({
            amount: amountNum,
            payment_method: method,
            token: user?.token,
          }),
        },
      );

      const orderData = await orderRes.json();

      if (!orderData.success) {
        setError(
          orderData.message ||
            "Failed to create order. Check browser console (F12).",
        );
        setSubmitting(false);
        return;
      }

      const orderId = orderData.data.order_id;

      // 2. Initiate UddoktaPay payment
      const payRes = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/uddoktapay/initiate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: orderId, payment_method: method }),
        },
      );

      const payData = await payRes.json();

      if (payData.success && payData.data?.payment_url) {
        window.location.href = payData.data.payment_url;
      } else {
        setError(payData.message || "Payment gateway error.");
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Network Error:", err);
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type === "deposit") return <ArrowUpRight className="h-4 w-4" />;
    if (type === "purchase") return <ShoppingBag className="h-4 w-4" />;
    if (type === "refund") return <RotateCcw className="h-4 w-4" />;
    return <History className="h-4 w-4" />;
  };

  const getTransactionColor = (type: string) => {
    if (type === "deposit") return "text-[#00f0ff]";
    if (type === "purchase") return "text-[#ff00de]";
    if (type === "refund") return "text-[#fcee0a]";
    return "text-gray-400";
  };

  const getAmountPrefix = (type: string) => {
    if (type === "deposit" || type === "refund") return "+";
    return "-";
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="border-4 border-[#fcee0a] bg-[#1a0b2e] p-6 shadow-hard-yellow relative">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <Wallet className="h-8 w-8 text-[#fcee0a]" />
          <h1 className="font-pixel text-xl text-[#fcee0a] text-glow-yellow">
            WALLET & FUNDS
          </h1>
        </div>
      </div>

      {/* Balance Card */}
      <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] p-8 shadow-hard-cyan relative text-center">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <p className="font-pixel text-xs text-[#00f0ff] uppercase tracking-widest mb-2">
            Available Balance
          </p>
          <p className="font-pixel text-5xl text-[#fcee0a] text-glow-yellow mb-6">
            ৳
            {(Number(user?.balance) || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 border-4 border-[#ff00de] bg-[#1a0b2e] px-8 py-3 font-sans font-bold text-[#ff00de] hover:bg-[#ff00de] hover:text-white transition-all btn-press uppercase"
          >
            <Plus className="h-5 w-5" /> ADD FUNDS
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="border-4 border-[#ff00de] bg-[#1a0b2e] shadow-hard-pink relative">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <div className="p-5 border-b-4 border-[#ff00de] bg-[#0a0118] flex items-center gap-3">
            <History className="h-6 w-6 text-[#ff00de]" />
            <h2 className="font-pixel text-sm text-[#fcee0a] uppercase">
              Wallet History
            </h2>
          </div>

          {loadingHistory ? (
            // 🌟 RETRO SKELETON TABLE
            <div className="overflow-x-auto p-4">
              <table className="w-full">
                <thead className="bg-[#0a0118] border-b-2 border-gray-800">
                  <tr>
                    {[...Array(5)].map((_, i) => (
                      <th key={i} className="p-4 text-left">
                        <div className="h-3 w-16 bg-[#1a0b2e] border border-[#00f0ff]/30 animate-pulse" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(4)].map((_, rowIdx) => (
                    <tr key={rowIdx} className="border-b-2 border-gray-800">
                      {[...Array(5)].map((_, colIdx) => (
                        <td key={colIdx} className="p-4">
                          <div
                            className={`h-4 bg-[#1a0b2e] border border-[#00f0ff]/20 animate-pulse ${
                              colIdx === 4 ? "w-12 ml-auto" : "w-24"
                            }`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-sans text-sm text-gray-400">
                No wallet transactions yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0118] border-b-2 border-gray-800">
                  <tr>
                    <th className="p-4 text-left font-pixel text-[10px] text-[#00f0ff] uppercase">
                      Date
                    </th>
                    <th className="p-4 text-left font-pixel text-[10px] text-[#00f0ff] uppercase">
                      Type
                    </th>
                    <th className="p-4 text-left font-pixel text-[10px] text-[#00f0ff] uppercase">
                      Description
                    </th>
                    <th className="p-4 text-left font-pixel text-[10px] text-[#00f0ff] uppercase">
                      Status
                    </th>
                    <th className="p-4 text-right font-pixel text-[10px] text-[#00f0ff] uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((tx, idx) => (
                    <tr
                      key={idx}
                      className="border-b-2 border-gray-800 hover:bg-[#0a0118] transition-colors"
                    >
                      <td className="p-4 font-sans text-sm text-gray-300">
                        {tx.date}
                      </td>
                      <td className="p-4">
                        <div
                          className={`flex items-center gap-2 font-sans text-sm font-bold uppercase ${getTransactionColor(tx.type)}`}
                        >
                          {getTransactionIcon(tx.type)} {tx.type}
                        </div>
                      </td>
                      <td className="p-4 font-sans text-sm text-white">
                        {tx.description}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2 py-1 border-2 font-pixel text-[9px] uppercase ${
                            tx.status === "completed" ||
                            tx.status === "processing"
                              ? "border-[#00f0ff] text-[#00f0ff]"
                              : "border-[#fcee0a] text-[#fcee0a]"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td
                        className={`p-4 text-right font-pixel text-sm font-bold ${getTransactionColor(tx.type)}`}
                      >
                        {getAmountPrefix(tx.type)}৳
                        {parseFloat(tx.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Top-Up Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md border-4 border-[#00f0ff] bg-[#1a0b2e] shadow-hard-cyan relative">
            <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />

            <div className="relative z-10 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6 border-b-4 border-[#ff00de] pb-4">
                <h2 className="font-pixel text-lg text-[#fcee0a]">ADD FUNDS</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="border-2 border-[#ff00de] bg-[#0a0118] p-2 text-[#ff00de] hover:bg-[#ff00de] hover:text-white transition-all btn-press"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="font-sans text-sm text-gray-300 mb-6">
                Enter the amount you want to add to your wallet. You'll be
                redirected to a secure payment gateway.
              </p>

              <form onSubmit={handleTopUp} className="space-y-4">
                <div>
                  <label className="block font-pixel text-[10px] text-gray-400 mb-1 uppercase">
                    Amount (৳)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="10"
                    max="50000"
                    className="w-full border-4 border-[#00f0ff] bg-[#0a0118] p-3 font-sans text-sm text-white focus:border-[#fcee0a] focus:outline-none"
                    placeholder="e.g., 500"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Min: ৳10 • Max: ৳50,000
                  </p>
                </div>

                <div>
                  <label className="block font-pixel text-[10px] text-gray-400 mb-1 uppercase">
                    Payment Method
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full border-4 border-[#00f0ff] bg-[#0a0118] p-3 font-sans text-sm text-white focus:border-[#fcee0a] focus:outline-none"
                  >
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="upay">Upay</option>
                  </select>
                </div>

                {error && (
                  <div className="border-4 border-[#ff00de] bg-[#ff00de]/10 p-3 font-sans text-sm text-center font-bold text-[#ff00de]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full border-4 border-[#fcee0a] bg-[#ff00de] py-4 font-sans font-bold text-lg text-white shadow-hard-pink btn-press hover:bg-[#fcee0a] hover:text-black hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase flex items-center justify-center gap-2 mt-4"
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner size="sm" className="text-black" />
                      <span>REDIRECTING...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>PROCEED TO PAYMENT</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
