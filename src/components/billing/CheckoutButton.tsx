"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useRegion } from "@/lib/geo/RegionProvider";
import { RazorpayCheckout } from "./RazorpayCheckout";
import { formatPrice } from "@/lib/geo/constants";

interface CheckoutButtonProps {
  plan?: "monthly" | "yearly";
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

export function CheckoutButton({
  plan = "monthly",
  className,
  variant = "default",
  size = "default",
}: CheckoutButtonProps) {
  const { startCheckout } = useSubscription();
  const { pricing } = useRegion();
  const [loading, setLoading] = useState(false);
  const [razorpayData, setRazorpayData] = useState<Record<string, unknown> | null>(null);

  const price =
    plan === "monthly"
      ? formatPrice(pricing.monthlyPrice, pricing.locale, pricing.currency)
      : formatPrice(pricing.yearlyPrice, pricing.locale, pricing.currency);

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await startCheckout(plan);

      // If Razorpay, show client-side modal
      if (result.gateway === "razorpay" && !result.url) {
        setRazorpayData(result);
      }
      // Stripe redirects automatically via startCheckout
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={loading}
        variant={variant}
        size={size}
        className={
          variant === "default"
            ? `bg-brand-purple hover:bg-brand-purple/90 ${className || ""}`
            : className
        }
      >
        <Crown className="mr-1.5 h-4 w-4" />
        {loading ? "Loading..." : `Upgrade to Pro — ${price}/mo`}
      </Button>

      {razorpayData && (
        <RazorpayCheckout
          data={razorpayData}
          onClose={() => setRazorpayData(null)}
        />
      )}
    </>
  );
}
