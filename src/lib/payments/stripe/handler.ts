import { stripe } from "./client";
import type { PaymentHandler, CheckoutResult, SubscriptionInfo } from "../types";

export class StripeHandler implements PaymentHandler {
  async createCheckout(
    userId: string,
    email: string,
    plan: "monthly" | "yearly"
  ): Promise<CheckoutResult> {
    const priceId =
      plan === "monthly"
        ? process.env.STRIPE_PRO_PRICE_ID_MONTHLY!
        : process.env.STRIPE_PRO_PRICE_ID_YEARLY!;

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId },
      },
      metadata: { userId },
    });

    return {
      gateway: "stripe",
      url: session.url!,
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }

  async getSubscription(subscriptionId: string): Promise<SubscriptionInfo> {
    const sub = await stripe.subscriptions.retrieve(subscriptionId);

    const statusMap: Record<string, SubscriptionInfo["status"]> = {
      active: "active",
      trialing: "trialing",
      past_due: "past_due",
      canceled: "canceled",
      unpaid: "past_due",
    };

    // Access subscription data - SDK wraps in Response type
    const subData = sub as unknown as {
      status: string;
      current_period_end: number;
      cancel_at_period_end: boolean;
    };

    return {
      gateway: "stripe",
      status: statusMap[subData.status] || "inactive",
      currentPeriodEnd: new Date(
        subData.current_period_end * 1000
      ).toISOString(),
      cancelAtPeriodEnd: subData.cancel_at_period_end,
    };
  }

  async getManagementUrl(customerId: string): Promise<string | null> {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    });
    return session.url;
  }
}
