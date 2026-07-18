"use client";
import { useState } from "react";
import { Button, Card, Input, Select } from "@/components/ui";

interface Variation {
  id: number;
  price: string;
  attributes: Record<string, string>;
  is_in_stock: boolean;
}
interface Field {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  helper_text?: string;
  options?: { value: string; label: string }[];
}

export function CheckoutForm({
  productId,
  productName,
  variations,
  fields,
}: {
  productId: number;
  productName: string;
  variations: Variation[];
  fields: Field[];
}) {
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null,
  );
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariation)
      return setResult({ success: false, message: "Please select an amount." });

    const missing = fields.filter((f) => f.required && !fieldValues[f.id]);
    if (missing.length > 0)
      return setResult({
        success: false,
        message: `Please fill in: ${missing.map((f) => f.label).join(", ")}`,
      });

    setLoading(true);
    setResult(null);

    const cleanCustomFields = fields
      .map((field) => ({
        label: field.label,
        value: fieldValues[field.id] || "",
      }))
      .filter((item) => item.value !== "");

    const mainGameId =
      cleanCustomFields.length > 0 ? cleanCustomFields[0].value : "";

    try {
      // 🌟 NOTICE: headless/v1 instead of rapid-topup/v1
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            variation_id: selectedVariation.id,
            game_uid: mainGameId,
            server_id: fieldValues.server_id || "",
            zone_id: fieldValues.zone_id || "",
            player_nickname:
              fieldValues.player_nickname || fieldValues.nickname || "Guest",
            payment_method: paymentMethod,
            guest_email: fieldValues.email || "guest@example.com",
            user_id: 0,
            custom_fields: cleanCustomFields,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        const orderId = data.data.order_id;

        if (
          ["bkash", "nagad", "rocket", "upay"].includes(
            paymentMethod.toLowerCase(),
          )
        ) {
          // 🌟 NOTICE: headless/v1 instead of rapid-topup/v1
          const payRes = await fetch(
            `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/uddoktapay/initiate`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: orderId,
                payment_method: paymentMethod.toLowerCase(),
              }),
            },
          );

          const payData = await payRes.json();

          if (payData.success && payData.data?.payment_url) {
            window.location.href = payData.data.payment_url;
            return;
          } else {
            setResult({
              success: false,
              message: payData.message || "Failed to initiate payment.",
            });
          }
        } else {
          setResult({
            success: true,
            message: `Order #${orderId} created successfully!`,
          });
          setFieldValues({});
          setSelectedVariation(null);
        }
      } else {
        setResult({
          success: false,
          message: data.message || "Failed to create order.",
        });
      }
    } catch (error) {
      console.error("Order submission error:", error);
      setResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8 !bg-zinc-900 border-zinc-800">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Checkout</h2>
        <p className="text-sm text-zinc-400">Complete your purchase securely</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Variations */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-3">
            1. Select Amount <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {variations.map((v) => {
              const name = Object.values(v.attributes).join(" - ");
              const isSelected = selectedVariation?.id === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={!v.is_in_stock}
                  onClick={() => setSelectedVariation(v)}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                    !v.is_in_stock
                      ? "opacity-40 cursor-not-allowed border-zinc-800 bg-zinc-900/50"
                      : isSelected
                        ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800/50"
                  }`}
                >
                  <p className="text-sm font-medium text-zinc-200 mb-1">
                    {name}
                  </p>
                  <p className="text-lg font-bold text-white">${v.price}</p>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Dynamic Fields */}
        {fields.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-zinc-800">
            <label className="block text-sm font-medium text-zinc-300">
              2. Your Details
            </label>
            {fields.map((field) => (
              <div key={field.id}>
                {field.type === "select" && field.options ? (
                  <Select
                    label={field.label}
                    value={fieldValues[field.id] || ""}
                    onChange={(e) =>
                      setFieldValues((prev) => ({
                        ...prev,
                        [field.id]: e.target.value,
                      }))
                    }
                    options={field.options}
                    required={field.required}
                  />
                ) : (
                  <Input
                    label={field.label}
                    type={field.type}
                    value={fieldValues[field.id] || ""}
                    onChange={(e) =>
                      setFieldValues((prev) => ({
                        ...prev,
                        [field.id]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    helperText={field.helper_text}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* 3. Payment */}
        <div className="pt-6 border-t border-zinc-800">
          <Select
            label="3. Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={[
              { value: "cod", label: "Cash on Delivery" },
              { value: "bkash", label: "bKash" },
              { value: "nagad", label: "Nagad" },
              { value: "rocket", label: "Rocket" },
            ]}
          />
        </div>

        {/* Summary */}
        {selectedVariation && (
          <div className="bg-zinc-950/50 rounded-xl p-5 border border-zinc-800">
            <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Order Summary
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Product</span>
                <span className="font-medium text-zinc-200">{productName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Amount</span>
                <span className="font-medium text-zinc-200">
                  {Object.values(selectedVariation.attributes).join(" - ")}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-zinc-800">
                <span className="font-semibold text-zinc-200">Total</span>
                <span className="text-xl font-bold text-white">
                  ${selectedVariation.price}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div
            className={`p-4 rounded-xl text-sm border ${result.success ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}
          >
            {result.message}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full text-base"
          disabled={!selectedVariation || loading}
        >
          {loading
            ? "Processing..."
            : `Pay $${selectedVariation?.price || "0.00"}`}
        </Button>
      </form>
    </Card>
  );
}
