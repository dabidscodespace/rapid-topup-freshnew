"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  AlertTriangle,
  Loader2,
  Home,
  Search,
  Mail,
  Calendar,
  CreditCard,
  Gamepad2,
  Receipt,
  Phone,
  Wallet,
  Clock,
  XCircle,
  MessageCircle,
  Ban,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();

  const orderId =
    searchParams.get("order") ||
    searchParams.get("order_id") ||
    searchParams.get("orderId");
  const invoiceId =
    searchParams.get("invoice_id") || searchParams.get("invoiceId");
  const isCancel = searchParams.get("cancel") === "1"; // 🌟 Check for cancel flag

  const [status, setStatus] = useState<
    "loading" | "success" | "failed" | "missing"
  >("loading");
  const [message, setMessage] = useState("Initializing...");
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      setStatus("missing");
      setMessage("No order details found in the URL.");
      return;
    }

    const fetchData = async () => {
      setMessage("Contacting server...");
      const wpUrl = process.env.NEXT_PUBLIC_WP_URL;

      try {
        let res;
        // 🌟 If canceled, call the cancel endpoint. Otherwise, call verify.
        if (isCancel) {
          res = await fetch(
            `${wpUrl}/wp-json/headless/v1/uddoktapay/cancel-order`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order_id: parseInt(orderId) }),
            },
          );
        } else {
          res = await fetch(`${wpUrl}/wp-json/headless/v1/uddoktapay/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: parseInt(orderId),
              invoice_id: invoiceId || "",
            }),
          });
        }

        const data = await res.json();

        if (data.success && data.data) {
          setStatus("success");
          setOrderData(data.data);
        } else {
          setStatus("failed");
          setMessage(data.message || "Failed to load order details.");
        }
      } catch (error) {
        setStatus("failed");
        setMessage("Network error while contacting server.");
      }
    };

    fetchData();
  }, [orderId, invoiceId, isCancel]);

  // --- MISSING STATE ---
  if (status === "missing") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl border-4 border-[#ff00de] bg-[#1a0b2e] p-8 shadow-hard-pink relative text-center">
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <AlertTriangle className="h-20 w-20 text-[#ff00de] mx-auto mb-6" />
            <h1 className="font-pixel text-2xl text-[#ff00de] mb-4">
              NO ORDER DETAILS
            </h1>
            <p className="font-sans text-base text-white mb-8">{message}</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
              <Link
                href="/"
                className="flex-1 border-4 border-[#00f0ff] bg-[#0a0118] py-3 font-sans font-bold text-sm text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all btn-press flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" /> HOME
              </Link>
              <Link
                href="/track"
                className="flex-1 border-4 border-[#fcee0a] bg-[#ff00de] py-3 font-sans font-bold text-sm text-white hover:bg-[#fcee0a] hover:text-black transition-all btn-press flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" /> CHECK ORDERS
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- SUCCESS STATE (Handles Completed, On-Hold, Failed, Canceled) ---
  if (status === "success" && orderData) {
    const orderStatus = orderData.status;

    // 🌟 DETERMINE UI THEME BASED ON STATUS
    let headerIcon, headerTitle, headerMessage, badgeColor, borderColor;
    const isIssue = ["on-hold", "pending", "failed", "cancelled"].includes(
      orderStatus,
    );

    if (orderStatus === "completed" || orderStatus === "processing") {
      headerIcon = (
        <CheckCircle className="h-20 w-20 text-[#00f0ff] mb-4 drop-shadow-[0_0_10px_#00f0ff]" />
      );
      headerTitle = "MISSION ACCOMPLISHED!";
      headerMessage = "PAYMENT VERIFIED! YOUR TOP-UP IS BEING PROCESSED.";
      badgeColor = "border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10";
      borderColor = "border-[#00f0ff]";
    } else if (orderStatus === "on-hold" || orderStatus === "pending") {
      headerIcon = (
        <Clock className="h-20 w-20 text-[#fcee0a] mb-4 drop-shadow-[0_0_10px_#fcee0a]" />
      );
      headerTitle = "PAYMENT ON HOLD";
      headerMessage =
        "We received your request. It is currently under manual review.";
      badgeColor = "border-[#fcee0a] text-[#fcee0a] bg-[#fcee0a]/10";
      borderColor = "border-[#fcee0a]";
    } else if (orderStatus === "cancelled") {
      // 🌟 NEW: CANCELED STATE
      headerIcon = (
        <Ban className="h-20 w-20 text-[#ff00de] mb-4 drop-shadow-[0_0_10px_#ff00de]" />
      );
      headerTitle = "PAYMENT CANCELED";
      headerMessage =
        "You canceled the payment process. No money was deducted from your account.";
      badgeColor = "border-[#ff00de] text-[#ff00de] bg-[#ff00de]/10";
      borderColor = "border-[#ff00de]";
    } else {
      headerIcon = (
        <XCircle className="h-20 w-20 text-[#ff00de] mb-4 drop-shadow-[0_0_10px_#ff00de]" />
      );
      headerTitle = "PAYMENT FAILED";
      headerMessage =
        "The payment could not be processed. Please contact support immediately.";
      badgeColor = "border-[#ff00de] text-[#ff00de] bg-[#ff00de]/10";
      borderColor = "border-[#ff00de]";
    }

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div
          className={`w-full max-w-2xl border-4 ${borderColor} bg-[#1a0b2e] shadow-hard-cyan relative`}
        >
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10 p-6 md:p-10">
            <div className="flex flex-col items-center">
              {headerIcon}
              <h1 className="font-pixel text-2xl md:text-3xl text-[#fcee0a] text-glow-yellow mb-2 text-center">
                {headerTitle}
              </h1>
              <p className="font-sans text-base text-white mb-8 text-center">
                {headerMessage}
              </p>

              <div className="w-full border-4 border-[#ff00de] bg-[#0a0118] p-6 md:p-8 mb-8 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a0b2e] px-4 border-4 border-[#ff00de]">
                  <span className="font-pixel text-xs text-[#ff00de]">
                    MISSION DEBRIEF
                  </span>
                </div>

                <div className="mt-4 space-y-4 font-sans text-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-dashed border-gray-700 pb-4 mb-4 gap-2">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Order ID
                      </p>
                      <p className="font-pixel text-lg text-[#00f0ff]">
                        #{orderData.order_id}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 border-2 font-bold text-xs uppercase ${badgeColor}`}
                    >
                      {orderData.status_label}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Gamepad2 className="h-5 w-5 text-[#ff00de] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase">
                          Product & Package
                        </p>
                        <p className="text-white font-bold">
                          {orderData.product_name}
                        </p>
                        <p className="text-[#fcee0a] text-xs">
                          {orderData.variation_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-[#ff00de] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase">
                          Account Email
                        </p>
                        <p className="text-white font-bold break-all">
                          {orderData.billing_email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-[#ff00de] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase">
                          Game UID / Player ID
                        </p>
                        <p className="text-white font-bold">
                          {orderData.game_uid}
                        </p>
                        {orderData.server_id && (
                          <p className="text-gray-300 text-xs">
                            Server: {orderData.server_id}
                          </p>
                        )}
                        {orderData.zone_id && (
                          <p className="text-gray-300 text-xs">
                            Zone: {orderData.zone_id}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-[#ff00de] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase">
                          Date & Time
                        </p>
                        <p className="text-white font-bold">{orderData.date}</p>
                      </div>
                    </div>

                    <div className="sm:col-span-2 " />

                    {/* 🌟 SIMPLE SPLIT PAYMENT BREAKDOWN */}
                    {orderData.is_split_payment && (
                      <div className="sm:col-span-2 border-t-2 border-b-2 border-dashed border-gray-700 py-4 space-y-2 font-sans text-sm">
                        <div className="flex justify-between items-baseline">
                          <span className="text-gray-400">Total Price</span>
                          <span className="text-white font-bold">
                            ৳ {parseFloat(orderData.original_total).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-gray-400">Wallet</span>
                          <span className="text-[#00f0ff] font-bold">
                            - ৳{" "}
                            {parseFloat(orderData.paid_from_wallet).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-gray-400">
                            {orderData.payment_method || "Gateway"}
                          </span>
                          <span className="text-[#ff00de] font-bold">
                            ৳ {parseFloat(orderData.gateway_amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Wallet className="h-5 w-5 text-[#ff00de] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase">
                          Payment Method
                        </p>
                        <p className="text-white font-bold text-base">
                          {orderData.payment_method || "N/A"}
                        </p>
                      </div>
                    </div>
                    {orderData.transaction_id && (
                      <div className="flex items-start gap-3">
                        <Receipt className="h-5 w-5 text-[#ff00de] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-gray-400 text-[10px] uppercase">
                            Transaction ID
                          </p>
                          <p className="text-white font-bold font-mono tracking-wide text-sm break-all">
                            {orderData.transaction_id}
                          </p>
                        </div>
                      </div>
                    )}
                    {orderData.sender_number && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-[#ff00de] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-gray-400 text-[10px] uppercase">
                            Sender Number
                          </p>
                          <p className="text-white font-bold text-base">
                            {orderData.sender_number}
                          </p>
                        </div>
                      </div>
                    )}
                    {orderData.gateway_invoice && (
                      <div className="flex items-start gap-3">
                        <Receipt className="h-5 w-5 text-[#ff00de] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-gray-400 text-[10px] uppercase">
                            Gateway Invoice
                          </p>
                          <p className="text-white font-bold font-mono text-xs break-all">
                            {orderData.gateway_invoice}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center border-t-2 border-dashed border-gray-700 pt-4 mt-4">
                    <span className="font-pixel text-xs text-[#00f0ff]">
                      TOTAL:
                    </span>
                    <span className="font-pixel text-2xl text-[#fcee0a] text-glow-yellow">
                      ৳ {orderData.total}
                    </span>
                  </div>
                </div>
              </div>

              {/*  DYNAMIC ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Link
                  href="/"
                  className="flex-1 border-4 border-[#00f0ff] bg-[#0a0118] py-3 font-sans font-bold text-sm text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all btn-press flex items-center justify-center gap-2"
                >
                  <Home className="h-4 w-4" /> HOME
                </Link>

                {isIssue ? (
                  <a
                    href={`https://wa.me/8801XXXXXXXXX?text=Hi,%20I%20need%20help%20with%20Order%20%23${orderData.order_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border-4 border-[#ff00de] bg-[#0a0118] py-3 font-sans font-bold text-sm text-[#ff00de] hover:bg-[#ff00de] hover:text-white transition-all btn-press flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" /> NEED HELP?
                  </a>
                ) : (
                  <Link
                    href="/track"
                    className="flex-1 border-4 border-[#fcee0a] bg-[#ff00de] py-3 font-sans font-bold text-sm text-white hover:bg-[#fcee0a] hover:text-black transition-all btn-press flex items-center justify-center gap-2"
                  >
                    <Search className="h-4 w-4" /> CHECK ORDERS
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- FAILED STATE ---
  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl border-4 border-[#ff00de] bg-[#1a0b2e] p-8 shadow-hard-pink relative text-center">
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <XCircle className="h-20 w-20 text-[#ff00de] mx-auto mb-6" />
            <h1 className="font-pixel text-2xl text-[#ff00de] mb-4">
              VERIFICATION FAILED
            </h1>
            <p className="font-sans text-base text-white mb-8">{message}</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
              <Link
                href="/"
                className="flex-1 border-4 border-[#00f0ff] bg-[#0a0118] py-3 font-sans font-bold text-sm text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all btn-press flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" /> HOME
              </Link>
              <a
                href="https://wa.me/8801XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 border-4 border-[#ff00de] bg-[#0a0118] py-3 font-sans font-bold text-sm text-[#ff00de] hover:bg-[#ff00de] hover:text-white transition-all btn-press flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" /> NEED HELP?
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LOADING STATE ---
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg border-4 border-[#00f0ff] bg-[#1a0b2e] p-8 shadow-hard-cyan relative text-center">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
          <Loader2 className="h-16 w-16 text-[#fcee0a] animate-spin mb-6" />
          <h2 className="font-pixel text-lg text-[#fcee0a] mb-2 animate-pulse">
            VERIFYING...
          </h2>
          <p className="font-sans text-sm text-gray-400">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0a0118]">
          <Loader2 className="h-12 w-12 text-[#fcee0a] animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
