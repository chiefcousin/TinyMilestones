import { razorpay } from "./client";
import type { PaymentHandler, CheckoutResult, SubscriptionInfo } from "../types";

export class RazorpayHandler implements PaymentHandler {
  async createCheckout(
    userId: string,
    _email: string,
    plan: "monthly" | "yearly"
  ): Promise<CheckoutResult> {
    const planId =
      plan === "monthly"
        ? process.env.RAZORPAY_PLAN_ID_MONTHLY!
        : process.env.RAZORPAY_PLAN_ID_YEARLY!;

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: plan === "monthly" ? 12 : 1,
      notes: { userId },
    });

    return {
      gateway: "razorpay",
      subscriptionId: subscription.id,
      keyId: process.env.RAZORPAY_KEY_ID!,
      amount: plan === "monthly" ? 19900 : 169900,
      currency: "INR",
      name: "TinyMilestones Pro",
      description: plan === "monthly" ? "Monthly Plan - ₹199/mo" : "Yearly Plan - ₹1,699/yr",
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await razorpay.subscriptions.cancel(subscriptionId, false);
  }

  async getSubscription(subscriptionId: string): Promise<SubscriptionInfo> {
    const sub = await razorpay.subscriptions.fetch(subscriptionId);

    const statusMap: Record<string, SubscriptionInfo["status"]> = {
      active: "active",
      authenticated: "trialing",
      halted: "past_due",
      cancelled: "canceled",
      completed: "canceled",
      pending: "inactive",
    };

    return {
      gateway: "razorpay",
      status: statusMap[sub.status as string] || "inactive",
      currentPeriodEnd: sub.current_end
        ? new Date((sub.current_end as number) * 1000).toISOString()
        : null,
      cancelAtPeriodEnd: false,
    };
  }

  async getManagementUrl(): Promise<string | null> {
    // Razorpay doesn't have a customer portal like Stripe
    return null;
  }
}
