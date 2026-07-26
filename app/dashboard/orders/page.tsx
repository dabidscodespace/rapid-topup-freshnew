"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Ban,
  Wallet,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const storedUser = localStorage.getItem("arcade_user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token || "";

      const url = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/auth/orders?token=${encodeURIComponent(token)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = async (orderId: number) => {
    setSelectedOrder({ loading: true });

    try {
      const storedUser = localStorage.getItem("arcade_user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token || "";

      const url = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/auth/order/${orderId}?token=${encodeURIComponent(token)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setSelectedOrder(data.data);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      setSelectedOrder(null);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed" || status === "processing")
      return <CheckCircle className="h-4 w-4 text-[#00f0ff]" />;
    if (status === "on-hold" || status === "pending")
      return <Clock className="h-4 w-4 text-[#fcee0a]" />;
    if (status === "cancelled")
      return <Ban className="h-4 w-4 text-[#ff00de]" />;
    return <XCircle className="h-4 w-4 text-[#ff00de]" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "completed" || status === "processing")
      return "text-[#00f0ff]";
    if (status === "on-hold" || status === "pending") return "text-[#fcee0a]";
    return "text-[#ff00de]";
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header Skeleton */}
        <div className="border-4 border-[#ff00de] bg-[#1a0b2e] p-4 sm:p-6 shadow-hard-pink relative">
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-[#0a0118] border-2 border-[#ff00de]/30 animate-pulse" />
            <div className="h-5 w-32 sm:w-48 bg-[#0a0118] border-2 border-[#fcee0a]/30 animate-pulse" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] shadow-hard-cyan relative">
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10 overflow-x-auto p-2 sm:p-4">
            <table className="w-full min-w-[600px]">
              <thead className="border-b-4 border-[#ff00de] bg-[#0a0118]">
                <tr>
                  {[...Array(6)].map((_, i) => (
                    <th key={i} className="p-2 sm:p-4 text-left">
                      <div className="h-3 w-16 sm:w-24 bg-[#1a0b2e] border border-[#00f0ff]/30 animate-pulse" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(4)].map((_, rowIdx) => (
                  <tr key={rowIdx} className="border-b-2 border-gray-800">
                    {[...Array(6)].map((_, colIdx) => (
                      <td key={colIdx} className="p-2 sm:p-4">
                        <div
                          className={`h-4 bg-[#1a0b2e] border border-[#00f0ff]/20 animate-pulse ${
                            colIdx === 4 ? "w-12 sm:w-16" : "w-20 sm:w-32"
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="border-4 border-[#ff00de] bg-[#1a0b2e] p-4 sm:p-6 shadow-hard-pink relative">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-[#ff00de]" />
          <h1 className="font-pixel text-base sm:text-xl text-[#fcee0a] text-glow-yellow">
            ORDER HISTORY
          </h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] p-8 sm:p-12 text-center shadow-hard-cyan relative">
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="font-pixel text-base sm:text-lg text-gray-400 mb-2">
              NO ORDERS YET
            </h2>
            <p className="font-sans text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
              Start shopping to see your orders here!
            </p>
            <a
              href="/"
              className="inline-block border-4 border-[#fcee0a] bg-[#ff00de] px-4 sm:px-6 py-2 sm:py-3 font-sans font-bold text-white hover:bg-[#fcee0a] hover:text-black transition-all btn-press uppercase"
            >
              BROWSE GAMES
            </a>
          </div>
        </div>
      ) : (
        <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] shadow-hard-cyan relative">
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10 overflow-x-auto">
            {/* 🌟 min-w-[600px] ensures clean horizontal scroll on mobile */}
            <table className="w-full min-w-[600px]">
              <thead className="border-b-4 border-[#ff00de] bg-[#0a0118]">
                <tr>
                  <th className="p-2 sm:p-4 text-left font-pixel text-[10px] sm:text-xs text-[#00f0ff] uppercase">
                    Order ID
                  </th>
                  <th className="p-2 sm:p-4 text-left font-pixel text-[10px] sm:text-xs text-[#00f0ff] uppercase">
                    Product
                  </th>
                  <th className="p-2 sm:p-4 text-left font-pixel text-[10px] sm:text-xs text-[#00f0ff] uppercase">
                    Date
                  </th>
                  <th className="p-2 sm:p-4 text-left font-pixel text-[10px] sm:text-xs text-[#00f0ff] uppercase">
                    Status
                  </th>
                  <th className="p-2 sm:p-4 text-left font-pixel text-[10px] sm:text-xs text-[#00f0ff] uppercase">
                    Total
                  </th>
                  <th className="p-2 sm:p-4 text-left font-pixel text-[10px] sm:text-xs text-[#00f0ff] uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.order_id}
                    className="border-b-2 border-gray-800 hover:bg-[#0a0118] transition-colors"
                  >
                    <td className="p-2 sm:p-4 font-pixel text-sm sm:text-base text-[#00f0ff]">
                      #{order.order_id}
                    </td>
                    <td className="p-2 sm:p-4 font-sans text-sm sm:text-base text-white">
                      {order.product_name}
                    </td>
                    <td className="p-2 sm:p-4 font-sans text-xs sm:text-sm text-gray-400">
                      {order.date}
                    </td>
                    <td className="p-2 sm:p-4">
                      <div
                        className={`flex items-center gap-2 font-sans text-xs sm:text-sm font-bold uppercase ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)} {order.status_label}
                      </div>
                    </td>
                    <td className="p-2 sm:p-4 font-pixel text-sm sm:text-base text-[#fcee0a]">
                      ৳
                      {parseFloat(order.original_total || order.total).toFixed(
                        2,
                      )}
                    </td>
                    <td className="p-2 sm:p-4">
                      <button
                        onClick={() => handleOrderClick(order.order_id)}
                        className="w-full sm:w-auto border-2 border-[#fcee0a] bg-[#0a0118] px-3 py-1.5 sm:py-2 font-sans text-xs sm:text-sm text-[#fcee0a] hover:bg-[#fcee0a] hover:text-black transition-all btn-press"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl border-4 border-[#00f0ff] bg-[#1a0b2e] shadow-hard-cyan relative max-h-[90vh] overflow-y-auto">
            <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
            <div className="relative z-10 p-4 sm:p-6 md:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6 border-b-4 border-[#ff00de] pb-4">
                <h2 className="font-pixel text-base sm:text-lg text-[#fcee0a]">
                  ORDER DETAILS
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="border-2 border-[#ff00de] bg-[#0a0118] p-2 text-[#ff00de] hover:bg-[#ff00de] hover:text-white transition-all btn-press"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {selectedOrder.loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <LoadingSpinner size="lg" />
                  <p className="font-pixel text-xs text-[#00f0ff] animate-pulse">
                    FETCHING ORDER DETAILS...
                  </p>
                </div>
              ) : (
                <div className="space-y-4 font-sans text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-dashed border-gray-700 pb-4 gap-2">
                    <div>
                      <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider mb-1">
                        Order ID
                      </p>
                      <p className="font-pixel text-base sm:text-lg text-[#00f0ff]">
                        #{selectedOrder.order_id}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1.5 border-2 font-bold text-xs sm:text-sm uppercase ${getStatusColor(selectedOrder.status)} border-current bg-current/10`}
                    >
                      {selectedOrder.status_label}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-[10px] sm:text-xs uppercase mb-1">
                        Product & Package
                      </p>
                      <p className="text-white font-bold text-sm sm:text-base">
                        {selectedOrder.product_name}
                      </p>
                      <p className="text-[#fcee0a] text-xs">
                        {selectedOrder.variation_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] sm:text-xs uppercase mb-1">
                        Account Email
                      </p>
                      <p className="text-white font-bold break-all text-sm sm:text-base">
                        {selectedOrder.billing_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] sm:text-xs uppercase mb-1">
                        Game UID / Player ID
                      </p>
                      <p className="text-white font-bold text-sm sm:text-base">
                        {selectedOrder.game_uid}
                      </p>
                      {selectedOrder.server_id && (
                        <p className="text-gray-300 text-xs">
                          Server: {selectedOrder.server_id}
                        </p>
                      )}
                      {selectedOrder.zone_id && (
                        <p className="text-gray-300 text-xs">
                          Zone: {selectedOrder.zone_id}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] sm:text-xs uppercase mb-1">
                        Date & Time
                      </p>
                      <p className="text-white font-bold text-sm sm:text-base">
                        {selectedOrder.date}
                      </p>
                    </div>

                    <div className="sm:col-span-2" />

                    {selectedOrder.is_split_payment && (
                      <div className="sm:col-span-2 border-y-2 border-dashed border-gray-700 py-4 space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-gray-400 text-xs sm:text-sm uppercase">
                            Total Price
                          </span>
                          <span className="text-white font-bold text-sm sm:text-base">
                            ৳{" "}
                            {parseFloat(
                              selectedOrder.original_total ||
                                selectedOrder.total,
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-3 w-3 text-[#00f0ff]" />
                            <span className="text-gray-400 text-xs sm:text-sm uppercase">
                              Wallet Used
                            </span>
                          </div>
                          <span className="text-[#00f0ff] font-bold text-sm sm:text-base">
                            - ৳{" "}
                            {parseFloat(
                              selectedOrder.paid_from_wallet || 0,
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-gray-400 text-xs sm:text-sm uppercase">
                            {selectedOrder.payment_method || "Gateway"}
                          </span>
                          <span className="text-[#ff00de] font-bold text-sm sm:text-base">
                            {" "}
                            {parseFloat(
                              selectedOrder.gateway_amount || 0,
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <p className="text-gray-400 text-[10px] sm:text-xs uppercase mb-1">
                        Payment Method
                      </p>
                      <p className="text-white font-bold text-base">
                        {selectedOrder.payment_method || "N/A"}
                      </p>
                    </div>
                    {selectedOrder.transaction_id && (
                      <div>
                        <p className="text-gray-400 text-[10px] sm:text-xs uppercase mb-1">
                          Transaction ID
                        </p>
                        <p className="text-white font-bold text-sm sm:text-base font-mono tracking-wide break-all">
                          {selectedOrder.transaction_id}
                        </p>
                      </div>
                    )}
                    {selectedOrder.sender_number && (
                      <div>
                        <p className="text-gray-400 text-[10px] sm:text-xs uppercase mb-1">
                          Sender Number
                        </p>
                        <p className="text-white font-bold text-base">
                          {selectedOrder.sender_number}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center border-t-2 border-dashed border-gray-700 pt-4 mt-4">
                    <span className="font-pixel text-xs sm:text-sm text-[#00f0ff]">
                      TOTAL PAID:
                    </span>
                    <span className="font-pixel text-xl sm:text-2xl text-[#fcee0a] text-glow-yellow">
                      ৳{" "}
                      {parseFloat(
                        selectedOrder.original_total || selectedOrder.total,
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
