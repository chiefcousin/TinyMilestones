export type PaymentGateway = "stripe" | "razorpay";

export interface RegionPricing {
  currency: string;
  currencySymbol: string;
  monthlyPrice: number;
  monthlyPriceCents: number;
  yearlyPrice: number;
  yearlyPriceCents: number;
  gateway: PaymentGateway;
  locale: string;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  razorpayPlanIdMonthly?: string;
  razorpayPlanIdYearly?: string;
}

export const REGION_PRICING: Record<string, RegionPricing> = {
  IN: {
    currency: "INR",
    currencySymbol: "\u20B9",
    monthlyPrice: 199,
    monthlyPriceCents: 19900,
    yearlyPrice: 1699,
    yearlyPriceCents: 169900,
    gateway: "razorpay",
    locale: "en-IN",
    razorpayPlanIdMonthly: process.env.RAZORPAY_PLAN_ID_MONTHLY,
    razorpayPlanIdYearly: process.env.RAZORPAY_PLAN_ID_YEARLY,
  },
  DEFAULT: {
    currency: "USD",
    currencySymbol: "$",
    monthlyPrice: 6.99,
    monthlyPriceCents: 699,
    yearlyPrice: 59.99,
    yearlyPriceCents: 5999,
    gateway: "stripe",
    locale: "en-US",
    stripePriceIdMonthly: process.env.STRIPE_PRO_PRICE_ID_MONTHLY,
    stripePriceIdYearly: process.env.STRIPE_PRO_PRICE_ID_YEARLY,
  },
};

export function getPricingForRegion(countryCode: string): RegionPricing {
  return REGION_PRICING[countryCode] || REGION_PRICING.DEFAULT;
}

export function formatPrice(
  amount: number,
  locale: string,
  currency: string
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "INR" ? 0 : 2,
    maximumFractionDigits: currency === "INR" ? 0 : 2,
  }).format(amount);
}
