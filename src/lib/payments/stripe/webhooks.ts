import type Stripe from "stripe";
import { stripe } from "./client";
import { createAdminClient } from "@/lib/supabase/admin";

export async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<{ success: boolean; message: string }> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return { success: false, message };
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) break;

      await supabase
        .from("profiles")
        .update({
          subscription_tier: "pro",
          subscription_status: "active",
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          payment_gateway: "stripe",
        })
        .eq("id", userId);

      await supabase.from("payment_events").insert({
        user_id: userId,
        gateway: "stripe",
        event_type: "checkout.session.completed",
        gateway_event_id: event.id,
        amount: session.amount_total,
        currency: session.currency,
        raw_payload: event as unknown as Record<string, unknown>,
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (!userId) break;

      const status =
        subscription.status === "active" || subscription.status === "trialing"
          ? "pro"
          : "free";

      await supabase
        .from("profiles")
        .update({
          subscription_tier: status,
          subscription_status: subscription.status,
        })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from("profiles")
        .update({
          subscription_tier: "free",
          subscription_status: "canceled",
          stripe_subscription_id: null,
        })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as unknown as Record<string, unknown>;
      const subscriptionId = invoice.subscription as string;
      if (!subscriptionId) break;

      await supabase
        .from("profiles")
        .update({
          subscription_status: "past_due",
        })
        .eq("stripe_subscription_id", subscriptionId);
      break;
    }
  }

  return { success: true, message: "Webhook processed" };
}
