import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPaymentHandler, getGatewayForRegion } from "@/lib/payments/gateway";
import type { Profile } from "@/types/database";

export async function POST(request: Request) {
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

  if (typedProfile.subscription_tier === "pro") {
    return NextResponse.json(
      { error: "Already subscribed to Pro" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const plan = body.plan === "yearly" ? "yearly" : "monthly";
  const gateway = getGatewayForRegion(typedProfile.region);
  const handler = getPaymentHandler(gateway);

  try {
    const result = await handler.createCheckout(
      user.id,
      user.email!,
      plan as "monthly" | "yearly"
    );
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Checkout creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
