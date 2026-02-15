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

  if (!gateway) {
    return NextResponse.json(
      { error: "No active subscription" },
      { status: 400 }
    );
  }

  const handler = getPaymentHandler(gateway);
  const customerId =
    gateway === "razorpay"
      ? typedProfile.razorpay_customer_id
      : typedProfile.stripe_customer_id;

  if (!customerId) {
    return NextResponse.json(
      { error: "No customer record found" },
      { status: 400 }
    );
  }

  const url = await handler.getManagementUrl(customerId);

  if (!url) {
    // Razorpay doesn't have a portal — cancel directly
    return NextResponse.json({
      success: true,
      url: null,
      message: "Use the cancel button to manage your subscription",
    });
  }

  return NextResponse.json({ success: true, url });
}
