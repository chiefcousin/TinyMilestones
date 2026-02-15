import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPaymentHandler } from "@/lib/payments/gateway";
import type { Profile } from "@/types/database";

export async function GET() {
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

  if (typedProfile.subscription_tier !== "pro") {
    return NextResponse.json({
      success: true,
      subscription: {
        status: "inactive",
        gateway: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      },
    });
  }

  const gateway = typedProfile.payment_gateway;
  const subscriptionId =
    gateway === "razorpay"
      ? typedProfile.razorpay_subscription_id
      : typedProfile.stripe_subscription_id;

  if (!gateway || !subscriptionId) {
    return NextResponse.json({
      success: true,
      subscription: {
        status: "active",
        gateway,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      },
    });
  }

  try {
    const handler = getPaymentHandler(gateway);
    const subscription = await handler.getSubscription(subscriptionId);
    return NextResponse.json({ success: true, subscription });
  } catch {
    return NextResponse.json({
      success: true,
      subscription: {
        status: typedProfile.subscription_status,
        gateway,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      },
    });
  }
}
