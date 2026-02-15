"use client";

import { useState, useCallback } from "react";
import type { SubscriptionInfo } from "@/lib/payments/types";

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSubscription = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/subscription");
      const json = await res.json();
      if (json.success) {
        setSubscription(json.subscription);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const startCheckout = useCallback(async (plan: "monthly" | "yearly" = "monthly") => {
    const res = await fetch("/api/billing/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "Checkout failed");
    }

    // Stripe: redirect to URL
    if (json.gateway === "stripe" && json.url) {
      window.location.href = json.url;
      return json;
    }

    // Razorpay: return data for client-side modal
    return json;
  }, []);

  const cancelSubscription = useCallback(async () => {
    const res = await fetch("/api/billing/cancel", { method: "POST" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    await fetchSubscription();
    return json;
  }, [fetchSubscription]);

  const openManagement = useCallback(async () => {
    const res = await fetch("/api/billing/manage", { method: "POST" });
    const json = await res.json();
    if (json.url) {
      window.location.href = json.url;
    }
    return json;
  }, []);

  return {
    subscription,
    loading,
    fetchSubscription,
    startCheckout,
    cancelSubscription,
    openManagement,
  };
}
