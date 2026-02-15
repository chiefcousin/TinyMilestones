import { NextResponse } from "next/server";
import { handleRazorpayWebhook } from "@/lib/payments/razorpay/webhooks";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing x-razorpay-signature header" },
      { status: 400 }
    );
  }

  const result = await handleRazorpayWebhook(body, signature);

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}
