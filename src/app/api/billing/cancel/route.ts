import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPaymentHandler } from "@/lib/payments/gateway";
import type { Profile } from "@/types/database";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const typedProfile = profile as Profile;
  const gateway = typedProfile.payment_gateway;
  const subscriptionId =
    gateway === "razorpay"
      ? typedProfile.razorpay_subscription_id
      : typedProfile.stripe_subscription_id;

  if (!gateway || !subscriptionId) {
    return NextResponse.json(
      { error: "No active subscription" },
      { status: 400 }
    );
  }

  try {
    const handler = getPaymentHandler(gateway);
    await handler.cancelSubscription(subscriptionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancel subscription failed:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
