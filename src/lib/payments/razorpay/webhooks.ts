import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    subscription?: {
      entity: {
        id: string;
        plan_id: string;
        status: string;
        notes: { userId?: string };
      };
    };
    payment?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        subscription_id: string;
        notes: { userId?: string };
      };
    };
  };
}

export function verifyRazorpaySignature(
  body: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function handleRazorpayWebhook(
  body: string,
  signature: string
): Promise<{ success: boolean; message: string }> {
  if (!verifyRazorpaySignature(body, signature)) {
    return { success: false, message: "Invalid signature" };
  }

  const payload: RazorpayWebhookPayload = JSON.parse(body);
  const supabase = createAdminClient();

  switch (payload.event) {
    case "subscription.activated": {
      const sub = payload.payload.subscription?.entity;
      const userId = sub?.notes?.userId;
      if (!userId || !sub) break;

      await supabase
        .from("profiles")
        .update({
          subscription_tier: "pro",
          subscription_status: "active",
          razorpay_subscription_id: sub.id,
          payment_gateway: "razorpay",
        })
        .eq("id", userId);

      await supabase.from("payment_events").insert({
        user_id: userId,
        gateway: "razorpay",
        event_type: "subscription.activated",
        gateway_event_id: sub.id,
        currency: "INR",
        raw_payload: payload as unknown as Record<string, unknown>,
      });
      break;
    }

    case "subscription.charged": {
      const payment = payload.payload.payment?.entity;
      if (!payment) break;

      // Find user by subscription ID
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("razorpay_subscription_id", payment.subscription_id)
        .single();

      if (profile) {
        await supabase.from("payment_events").insert({
          user_id: profile.id,
          gateway: "razorpay",
          event_type: "subscription.charged",
          gateway_event_id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          raw_payload: payload as unknown as Record<string, unknown>,
        });
      }
      break;
    }

    case "subscription.cancelled":
    case "subscription.completed": {
      const sub = payload.payload.subscription?.entity;
      if (!sub) break;

      await supabase
        .from("profiles")
        .update({
          subscription_tier: "free",
          subscription_status: "canceled",
        })
        .eq("razorpay_subscription_id", sub.id);
      break;
    }

    case "subscription.halted": {
      const sub = payload.payload.subscription?.entity;
      if (!sub) break;

      await supabase
        .from("profiles")
        .update({
          subscription_status: "past_due",
        })
        .eq("razorpay_subscription_id", sub.id);
      break;
    }
  }

  return { success: true, message: "Webhook processed" };
}
