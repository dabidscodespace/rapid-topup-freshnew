"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/lib/AuthContext";
import { Wallet, Check } from "lucide-react";
import Link from "next/link"; // 🌟 Added Link import

export default function CheckoutForm({
  productId,
  productName,
  variations,
  fields = [],
}: {
  productId: number;
  productName: string;
  variations: any[];
  fields?: any[];
}) {
  const { user, refreshUser } = useAuth();
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [useWallet, setUseWallet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const userBalance = Number(user?.balance) || 0;
  const currentPrice = selectedVariation ? Number(selectedVariation.price) : 0;
  const walletDeduction = useWallet ? Math.min(userBalance, currentPrice) : 0;
  const remainingToPay = currentPrice - walletDeduction;

  const handleFieldChange = (id: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    if (user?.token) refreshUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //  SAFETY CHECK: Prevent submission if not logged in
    if (!user) {
      return setResult({
        success: false,
        message: "Please log in to complete your purchase.",
      });
    }

    const safeFields = fields || [];

    // 1. Validate required fields
    for (const field of safeFields) {
      if (field.required && !fieldValues[field.id]) {
        return setResult({
          success: false,
          message: `${field.label} is required.`,
        });
      }
    }

    // 2. Validate variation selection AND stock status
    if (!selectedVariation) {
      return setResult({ success: false, message: "Please select a package." });
    }
    if (!selectedVariation.is_in_stock) {
      return setResult({
        success: false,
        message:
          "Sorry, this package just went out of stock. Please choose another.",
      });
    }

    // 3. Validate payment method
    if (
      remainingToPay > 0 &&
      !["bkash", "nagad", "rocket", "upay"].includes(paymentMethod)
    ) {
      return setResult({
        success: false,
        message: "Please select a valid payment gateway.",
      });
    }

    setLoading(true);
    setResult(null);

    const customFieldsPayload = safeFields
      .map((field: any) => ({
        label: field.name || field.label || "Custom Field",
        value: fieldValues[field.id] || "",
      }))
      .filter((f: any) => f.value !== "");

    let mainIdValue = "";

    for (const field of safeFields) {
      const val = fieldValues[field.id];
      const labelLower = (field.label || "").toLowerCase();
      const nameLower = (field.name || "").toLowerCase();
      if (
        val &&
        (labelLower.includes("uid") ||
          labelLower.includes("player") ||
          labelLower.includes("id") ||
          nameLower.includes("uid") ||
          nameLower.includes("player") ||
          nameLower.includes("id"))
      ) {
        mainIdValue = val;
        break;
      }
    }

    if (mainIdValue === "" && safeFields.length > 0) {
      const firstVal = Object.values(fieldValues).find(
        (v: any) => v && String(v).trim() !== "",
      );
      if (firstVal) mainIdValue = String(firstVal);
    }

    const payload = {
      variation_id: selectedVariation.id,
      game_uid: mainIdValue || null,
      player_id: mainIdValue || null,
      payment_method: remainingToPay > 0 ? paymentMethod : "wallet",
      guest_email: user ? user.email : fieldValues.email || "guest@example.com",
      user_id: user ? user.user_id : 0,
      use_wallet: useWallet,
      custom_fields: customFieldsPayload,
    };

    const token = user?.token;

    if (!token) {
      setLoading(false);
      return setResult({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/orders`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        },
      );

      if (res.status === 401) {
        setLoading(false);
        return setResult({
          success: false,
          message: "Authentication failed. Please log out and log in again.",
        });
      }

      const data = await res.json();

      if (data.success) {
        const orderId = data.data.order_id;
        const gatewayAmount = Number(data.data.gateway_amount);

        if (gatewayAmount <= 0 || isNaN(gatewayAmount)) {
          await refreshUser();
          window.location.href = `/order-success?order=${orderId}`;
          return;
        } else {
          const payRes = await fetch(
            `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/uddoktapay/initiate`,
            {
              method: "POST",
              headers,
              body: JSON.stringify({
                order_id: orderId,
                payment_method: paymentMethod,
              }),
            },
          );
          const payData = await payRes.json();

          if (payData.success && payData.data?.payment_url) {
            window.location.href = payData.data.payment_url;
            return;
          } else {
            setLoading(false);
            setResult({
              success: false,
              message: payData.message || "Payment gateway error.",
            });
          }
        }
      } else {
        setLoading(false);
        setResult({ success: false, message: data.message || "Order failed." });
      }
    } catch (error) {
      setLoading(false);
      setResult({
        success: false,
        message: "Network error. Please try again.",
      });
    }
  };

  return (
    <>
      {/* LOADING MODAL */}
      {loading &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0a0118]/80 backdrop-blur-md">
            <div className="w-full max-w-sm bg-[#1a0b2e]/90 border border-[#00f0ff]/30 p-8 text-center shadow-[0_0_40px_rgba(0,240,255,0.1)]">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border border-[#00f0ff]/20 rounded-full" />
                <div
                  className="absolute inset-0 border-2 border-t-[#00f0ff] border-r-[#00f0ff]/60 rounded-full animate-spin"
                  style={{ animationDuration: "3s" }}
                />
                <div
                  className="absolute inset-2 border border-b-[#ff00de]/40 rounded-full animate-spin"
                  style={{
                    animationDuration: "2s",
                    animationDirection: "reverse",
                  }}
                />
              </div>
              <h3 className="font-sans text-lg text-white font-semibold mb-2 tracking-wide">
                Connecting to Gateway
              </h3>
              <p className="font-mono text-xs text-[#00f0ff]/70 mb-6">
                Initializing secure handshake...
              </p>
              <div className="w-full h-1 bg-[#0a0118] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00f0ff] animate-pulse"
                  style={{ width: "60%" }}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ACTUAL FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PANEL 1: Account Details (Visible to everyone) */}
        {fields && fields.length > 0 && (
          <div
            className="border-4 bg-[#1a0b2e] p-5 relative"
            style={{
              borderColor: "#00f0ff",
              boxShadow: "6px 6px 0px 0px #00f0ff",
            }}
          >
            <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="font-pixel text-xs text-[#fcee0a] mb-4 uppercase tracking-wider flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 border-2 border-[#fcee0a] text-[#fcee0a] text-[10px]">
                  1
                </span>
                Enter Account Details
              </h3>
              <div className="space-y-4">
                {fields.map((field: any) => (
                  <div key={field.id}>
                    <label className="block font-pixel text-[10px] text-gray-400 mb-1 uppercase">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-[#ff00de]">*</span>
                      )}
                    </label>
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      value={fieldValues[field.id] || ""}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      className="w-full border-4 border-[#00f0ff] bg-[#0a0118] p-3 font-sans text-sm text-white placeholder-gray-600 focus:border-[#fcee0a] focus:outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PANEL 2: Select Package (Visible to everyone) */}
        <div
          className="border-4 bg-[#1a0b2e] p-5 relative"
          style={{
            borderColor: "#ff00de",
            boxShadow: "6px 6px 0px 0px #ff00de",
          }}
        >
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="font-pixel text-xs text-[#fcee0a] mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 border-2 border-[#fcee0a] text-[#fcee0a] text-[10px]">
                2
              </span>
              Choose a Package
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {variations.map((v: any) => {
                const isSelected = selectedVariation?.id === v.id;
                const name = Object.values(v.attributes).join(" - ");
                const stockQty = v.stock_quantity;
                const isCriticalStock =
                  v.is_in_stock && stockQty !== null && stockQty <= 3;
                const isLowStock =
                  v.is_in_stock &&
                  stockQty !== null &&
                  stockQty > 3 &&
                  stockQty <= 10;

                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={!v.is_in_stock}
                    onClick={() => v.is_in_stock && setSelectedVariation(v)}
                    className={`relative p-4 border-4 text-center transition-all btn-press font-sans overflow-hidden ${
                      !v.is_in_stock
                        ? "border-gray-700 bg-gray-900 text-gray-500 opacity-60 cursor-not-allowed"
                        : isSelected
                          ? "border-[#fcee0a] bg-[#0a0118] text-[#fcee0a] shadow-[4px_4px_0px_0px_#fcee0a]"
                          : "border-[#00f0ff] bg-[#0a0118] text-white hover:border-[#fcee0a] hover:text-[#fcee0a]"
                    }`}
                  >
                    {isCriticalStock && (
                      <div className="absolute top-0 right-0 bg-[#ff0000] text-white font-pixel text-[8px] px-2 py-1 border-l-2 border-b-2 border-white animate-pulse z-10">
                        ONLY {stockQty} LEFT!
                      </div>
                    )}
                    {isLowStock && (
                      <div className="absolute top-0 right-0 bg-[#fcee0a] text-black font-pixel text-[8px] px-2 py-1 border-l-2 border-b-2 border-white z-10">
                        {stockQty} IN STOCK
                      </div>
                    )}
                    {!v.is_in_stock && (
                      <div className="absolute top-0 right-0 bg-[#ff0000] text-white font-pixel text-[8px] px-2 py-1 border-l-2 border-b-2 border-white z-10">
                        SOLD OUT
                      </div>
                    )}
                    <div
                      className={`font-bold text-sm mb-1 uppercase leading-tight mt-2 ${!v.is_in_stock ? "line-through decoration-2 decoration-[#ff0000]" : ""}`}
                    >
                      {name}
                    </div>
                    <div
                      className={`font-pixel text-xs ${!v.is_in_stock ? "text-gray-600" : ""}`}
                    >
                      ৳{v.price}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* PANEL 3: Payment Method (LOCKED FOR GUESTS) */}
        <div
          className="border-4 bg-[#1a0b2e] p-5 relative"
          style={{
            borderColor: "#fcee0a",
            boxShadow: "6px 6px 0px 0px #fcee0a",
          }}
        >
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="font-pixel text-xs text-[#fcee0a] mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 border-2 border-[#fcee0a] text-[#fcee0a] text-[10px]">
                3
              </span>
              Payment Method
            </h3>

            {/* 🌟 LOGIN GATE FOR PAYMENT SECTION */}
            {!user ? (
              <div className="border-2 border-dashed border-[#ff00de] bg-[#0a0118] p-8 text-center">
                <h4 className="font-pixel text-sm text-[#ff00de] mb-2 uppercase">
                  Login Required
                </h4>
                <p className="font-sans text-xs text-gray-400 mb-4 max-w-md mx-auto">
                  Please log in to your account to complete your purchase, use
                  your wallet balance, and track your order status.
                </p>
                <Link
                  href="/login"
                  className="inline-block border-2 border-[#00f0ff] bg-[#1a0b2e] px-6 py-2 font-pixel text-xs text-[#00f0ff] btn-press hover:bg-[#00f0ff] hover:text-black transition-all"
                >
                  GO TO LOGIN
                </Link>
              </div>
            ) : (
              // 🌟 ACTUAL PAYMENT OPTIONS (Only visible if logged in)
              <div className="space-y-5">
                {userBalance > 0 &&
                  selectedVariation &&
                  selectedVariation.is_in_stock && (
                    <div className="border-2 border-[#00f0ff] bg-[#0a0118] p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#00f0ff]/10 rounded-none">
                          <Wallet className="h-5 w-5 text-[#00f0ff]" />
                        </div>
                        <div>
                          <p className="font-sans text-sm font-bold text-white">
                            Use Wallet Balance
                          </p>
                          <p className="font-pixel text-[10px] text-[#fcee0a]">
                            Available: ৳{userBalance.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUseWallet(!useWallet)}
                        className={`relative w-14 h-7 border-2 transition-all btn-press ${
                          useWallet
                            ? "border-[#fcee0a] bg-[#fcee0a]/20"
                            : "border-gray-600 bg-[#0a0118]"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 bg-[#fcee0a] transition-all ${useWallet ? "left-[34px]" : "left-0.5"}`}
                        />
                        {useWallet && (
                          <Check className="absolute left-1 top-1 h-4 w-4 text-black" />
                        )}
                      </button>
                    </div>
                  )}

                {useWallet &&
                  walletDeduction > 0 &&
                  selectedVariation?.is_in_stock && (
                    <div className="bg-[#0a0118] p-3 border-2 border-dashed border-[#fcee0a] space-y-1">
                      <div className="flex justify-between font-sans text-sm text-gray-400">
                        <span>Package Price:</span>
                        <span>৳{currentPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-sans text-sm text-[#00f0ff]">
                        <span>Wallet Deduction:</span>
                        <span>- {walletDeduction.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-pixel text-sm text-[#ff00de] pt-1 border-t border-gray-700">
                        <span>Remaining to Pay:</span>
                        <span>৳{remainingToPay.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                {remainingToPay > 0 && selectedVariation?.is_in_stock && (
                  <div>
                    <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                      Select Gateway
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Bkash", "Nagad", "Rocket", "Upay"].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method.toLowerCase())}
                          className={`border-4 p-3 font-sans font-bold text-sm transition-all btn-press uppercase ${
                            paymentMethod.toLowerCase() === method.toLowerCase()
                              ? "border-[#fcee0a] bg-[#0a0118] text-[#fcee0a] shadow-[4px_4px_0px_0px_#fcee0a]"
                              : "border-[#00f0ff] bg-[#0a0118] text-white hover:border-[#fcee0a]"
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {result && (
                  <div
                    className={`border-4 p-3 font-sans text-sm text-center font-bold ${result.success ? "border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]" : "border-[#ff00de] bg-[#ff00de]/10 text-[#ff00de]"}`}
                  >
                    {result.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    !selectedVariation || !selectedVariation?.is_in_stock
                  }
                  className="w-full border-4 border-[#fcee0a] bg-[#ff00de] py-4 font-sans font-bold text-lg text-white shadow-[6px_6px_0px_0px_#fcee0a] btn-press hover:bg-[#fcee0a] hover:text-black hover:border-black hover:shadow-[2px_2px_0px_0px_#fcee0a] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:border-gray-600 disabled:text-gray-500 disabled:shadow-none uppercase"
                >
                  {!selectedVariation
                    ? "SELECT A PACKAGE FIRST"
                    : !selectedVariation.is_in_stock
                      ? "OUT OF STOCK"
                      : remainingToPay === 0
                        ? "PAY WITH WALLET"
                        : `PAY ৳${remainingToPay.toFixed(2)} VIA ${paymentMethod.toUpperCase()}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
