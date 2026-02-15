import type { PaymentGateway, PaymentHandler } from "./types";
import { StripeHandler } from "./stripe/handler";
import { RazorpayHandler } from "./razorpay/handler";

const handlers: Record<PaymentGateway, PaymentHandler> = {
  stripe: new StripeHandler(),
  razorpay: new RazorpayHandler(),
};

export function getPaymentHandler(gateway: PaymentGateway): PaymentHandler {
  return handlers[gateway];
}

export function getGatewayForRegion(region: string): PaymentGateway {
  return region === "IN" ? "razorpay" : "stripe";
}
