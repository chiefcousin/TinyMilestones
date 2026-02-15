export type PaymentGateway = "stripe" | "razorpay";

export interface CheckoutResult {
  gateway: PaymentGateway;
  // For Stripe: redirect URL. For Razorpay: order/subscription details.
  url?: string;
  subscriptionId?: string;
  orderId?: string;
  keyId?: string;
  amount?: number;
  currency?: string;
  name?: string;
  description?: string;
}

export interface SubscriptionInfo {
  gateway: PaymentGateway;
  status: "active" | "trialing" | "past_due" | "canceled" | "inactive";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface WebhookResult {
  success: boolean;
  userId?: string;
  action?: "activated" | "canceled" | "payment_failed" | "updated";
}

export interface PaymentHandler {
  createCheckout(userId: string, email: string, plan: "monthly" | "yearly"): Promise<CheckoutResult>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  getSubscription(subscriptionId: string): Promise<SubscriptionInfo>;
  getManagementUrl(customerId: string): Promise<string | null>;
}
