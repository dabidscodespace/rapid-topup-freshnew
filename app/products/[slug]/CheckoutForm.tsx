"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/lib/AuthContext";
import { Wallet, Check } from "lucide-react";
import Link from "next/link";

export default function CheckoutForm({
  productId,
  productName,
  productImage,
  variations,
  fields = [],
}: {
  productId: number;
  productName: string;
  productImage?: string;
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

    if (!user) {
      return setResult({
        success: false,
        message: "Please log in to complete your purchase.",
      });
    }

    const safeFields = fields || [];

    for (const field of safeFields) {
      if (field.required && !fieldValues[field.id]) {
        return setResult({
          success: false,
          message: `${field.label} is required.`,
        });
      }
    }

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

  if (!user) {
    return (
      <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <h3 className="font-pixel text-lg text-[#fcee0a] mb-4 uppercase tracking-wider">
            Login Required
          </h3>
          <p className="font-sans text-sm text-gray-300 mb-6 max-w-md mx-auto">
            Please log in to your account to purchase this item, save your game
            details, and use your wallet balance.
          </p>
          <Link
            href="/login"
            className="inline-block border-4 border-[#fcee0a] bg-[#ff00de] px-8 py-3 font-sans font-bold text-white shadow-[4px_4px_0px_0px_#fcee0a] btn-press hover:bg-[#fcee0a] hover:text-black hover:border-black hover:shadow-[2px_2px_0px_0px_#fcee0a] transition-all uppercase"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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
        {/* PANEL 1: Account Details */}
        {fields && fields.length > 0 && (
          <div
            className="border-4 bg-[#1a0b2e] p-4 sm:p-5 relative"
            style={{
              borderColor: "#00f0ff",
              boxShadow: "6px 6px 0px 0px #00f0ff",
            }}
          >
            <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="font-pixel text-xs sm:text-sm text-[#fcee0a] mb-3 sm:mb-4 uppercase tracking-wider flex items-center gap-2">
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

        {/* 🌟 PANEL 2: Select Package (OPTIMIZED 2-COL MOBILE / 3-COL MAX) */}
        <div
          className="border-4 bg-[#1a0b2e] p-4 sm:p-5 relative"
          style={{
            borderColor: "#ff00de",
            boxShadow: "6px 6px 0px 0px #ff00de",
          }}
        >
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="font-pixel text-xs sm:text-sm text-[#fcee0a] mb-3 sm:mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 border-2 border-[#fcee0a] text-[#fcee0a] text-[10px]">
                2
              </span>
              Choose Package
            </h3>

            {/*  GRID: 2 cols mobile, 3 cols tablet/desktop (MAX 3) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {variations.map((v: any) => {
                const isSelected = selectedVariation?.id === v.id;
                const name =
                  Object.values(v.attributes).join(" / ") ||
                  v.name ||
                  "Standard";
                const stockQty = v.stock_quantity;
                const isOutOfStock = !v.is_in_stock;

                // Only show stock text if stock is actually defined (not null)
                const hasStockManagement =
                  stockQty !== null && stockQty !== undefined;
                const isLowStock =
                  hasStockManagement && v.is_in_stock && stockQty <= 5;

                const variationImage =
                  v.image_url ||
                  productImage ||
                  "https://placehold.co/400x300/1a0b2e/00f0ff?text=PKG";

                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => !isOutOfStock && setSelectedVariation(v)}
                    className={`relative w-full flex flex-row items-center gap-2 p-2 border-2 bg-[#0a0118] transition-all duration-200 group text-left overflow-hidden ${
                      isOutOfStock
                        ? "border-gray-800 opacity-50 cursor-not-allowed grayscale"
                        : isSelected
                          ? "border-[#fcee0a] bg-[#fcee0a]/5 shadow-[0_0_12px_rgba(252,238,10,0.15)]"
                          : "border-[#00f0ff]/30 hover:border-[#00f0ff] hover:bg-[#00f0ff]/5"
                    }`}
                  >
                    {/* 🌟 LEFT SIDE: Name & Price */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                      {/* Package Name - Optimized for wrapping */}
                      <h4
                        className={`font-pixel text-[10px] leading-tight mb-1.5 line-clamp-2 break-words ${
                          isOutOfStock ? "text-gray-500" : "text-white"
                        }`}
                      >
                        {name.toUpperCase()}
                      </h4>

                      {/* Bottom Footer: Price & Status */}
                      <div className="pt-1.5 border-t border-[#00f0ff]/20 flex items-center justify-between mt-auto">
                        <span
                          className={`font-pixel text-[11px] ${isOutOfStock ? "text-gray-600 line-through" : "text-[#fcee0a]"}`}
                        >
                          ৳{Number(v.price).toFixed(0)}
                        </span>

                        {/* 🌟 STOCK LOGIC: Only show badge if stock is managed OR if out of stock */}
                        <div className="flex-shrink-0">
                          {isOutOfStock ? (
                            <span className="font-sans text-[9px] font-bold text-[#ff0000] uppercase leading-none">
                              Out
                            </span>
                          ) : hasStockManagement ? (
                            isLowStock ? (
                              <span className="font-sans text-[9px] font-bold text-[#ff00de] uppercase leading-none">
                                {stockQty} Left
                              </span>
                            ) : (
                              <span className="font-sans text-[9px] font-bold text-[#00f0ff] uppercase leading-none">
                                In Stock
                              </span>
                            )
                          ) : (
                            /* If stock is NOT managed (null), show nothing to keep it clean */
                            <span className="block w-2 h-2 rounded-full bg-[#00f0ff]"></span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 🌟 RIGHT SIDE: Image (Smaller on mobile for text space) */}
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 overflow-hidden flex items-center justify-center border border-[#00f0ff]/10">
                      <img
                        src={variationImage}
                        alt={name}
                        className="h-full w-full object-cover"
                        style={{ imageRendering: "pixelated" }}
                      />
                      <div className="absolute inset-0 crt-overlay opacity-20 pointer-events-none" />

                      {/* Selection Overlay Checkmark */}
                      {isSelected && !isOutOfStock && (
                        <div className="absolute inset-0 bg-[#fcee0a]/20 flex items-center justify-center backdrop-blur-[1px]">
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#fcee0a] drop-shadow-md" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* PANEL 3: Payment Method */}
        <div
          className="border-4 bg-[#1a0b2e] p-4 sm:p-5 relative"
          style={{
            borderColor: "#fcee0a",
            boxShadow: "6px 6px 0px 0px #fcee0a",
          }}
        >
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="font-pixel text-xs sm:text-sm text-[#fcee0a] mb-3 sm:mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 border-2 border-[#fcee0a] text-[#fcee0a] text-[10px]">
                3
              </span>
              Payment Method
            </h3>

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
