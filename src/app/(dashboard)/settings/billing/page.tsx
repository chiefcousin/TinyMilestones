"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSubscription } from "@/hooks/useSubscription";
import { useRegion } from "@/lib/geo/RegionProvider";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { formatPrice } from "@/lib/geo/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, AlertCircle } from "lucide-react";

const PRO_FEATURES = [
  "Unlimited activity generation",
  "Unlimited child profiles",
  "Unlimited saved activities",
  "Priority AI generation",
  "All developmental domains",
];

export default function BillingPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const { subscription, loading, fetchSubscription, cancelSubscription, openManagement } =
    useSubscription();
  const { pricing } = useRegion();
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your Pro subscription?")) return;
    setCanceling(true);
    try {
      await cancelSubscription();
    } catch (err) {
      console.error("Cancel failed:", err);
    } finally {
      setCanceling(false);
    }
  };

  const isPro =
    subscription?.status === "active" || subscription?.status === "trialing";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Billing</h1>

      {/* Success/canceled messages */}
      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-3">
          <Check className="h-4 w-4 text-green-600" />
          <p className="text-sm text-green-700">
            Welcome to Pro! Your subscription is now active.
          </p>
        </div>
      )}
      {canceled && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <p className="text-sm text-yellow-700">
            Checkout was canceled. You can try again anytime.
          </p>
        </div>
      )}

      {/* Current plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Crown className="h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-20 animate-pulse rounded bg-muted" />
          ) : isPro ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Pro Plan</p>
                    <Badge className="bg-brand-purple text-white">Active</Badge>
                  </div>
                  {subscription?.currentPeriodEnd && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {subscription.cancelAtPeriodEnd
                        ? "Cancels"
                        : "Renews"}{" "}
                      on{" "}
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {subscription?.gateway === "stripe" && (
                  <Button variant="outline" size="sm" onClick={openManagement}>
                    Manage Subscription
                  </Button>
                )}
                {!subscription?.cancelAtPeriodEnd && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={canceling}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    {canceling ? "Canceling..." : "Cancel Subscription"}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Free Plan</p>
                  <Badge variant="secondary">Current</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  5 activities per day, 1 child profile
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade section */}
      {!isPro && (
        <Card className="border-brand-purple/30 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="h-5 w-5 text-brand-purple" />
              Upgrade to Pro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Unlock everything for{" "}
              {formatPrice(pricing.monthlyPrice, pricing.locale, pricing.currency)}/month
            </p>
            <div className="space-y-2">
              {PRO_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-purple" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <CheckoutButton plan="monthly" />
              <CheckoutButton plan="yearly" variant="outline" />
            </div>
            <p className="text-xs text-muted-foreground">
              7-day free trial. Cancel anytime. Paying via{" "}
              {pricing.gateway === "razorpay" ? "Razorpay" : "Stripe"}.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
