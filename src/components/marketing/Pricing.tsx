import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { formatPrice, type RegionPricing } from "@/lib/geo/constants";

interface PricingProps {
  pricing: RegionPricing;
}

export function Pricing({ pricing }: PricingProps) {
  const monthlyDisplay = formatPrice(
    pricing.monthlyPrice,
    pricing.locale,
    pricing.currency
  );
  const yearlyDisplay = formatPrice(
    pricing.yearlyPrice,
    pricing.locale,
    pricing.currency
  );

  return (
    <section id="pricing" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Start free, upgrade when you&apos;re ready
        </p>

        <div className="mx-auto mt-12 grid max-w-3xl gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <div className="rounded-card border bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold">Free</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold">
                {pricing.currencySymbol}0
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mt-6 space-y-3">
              {[
                "5 activities per day",
                "1 child profile",
                "10 saved activities",
                "All 5 developmental domains",
                "7-day activity history",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-brand-teal" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="mt-8 block">
              <Button variant="outline" className="w-full">
                Start Free
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-card border-2 border-brand-purple bg-white p-8 shadow-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-purple px-4 py-1 text-xs font-medium text-white">
              Most Popular
            </div>
            <h3 className="text-xl font-semibold">Pro</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold">{monthlyDisplay}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              or {yearlyDisplay}/year (save ~30%)
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Unlimited activities",
                "Unlimited child profiles",
                "Unlimited saved activities",
                "All 5 developmental domains",
                "Milestone tracking",
                "Printable activity cards",
                "Full activity history",
                "Priority support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-brand-purple" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="mt-8 block">
              <Button className="w-full bg-brand-purple hover:bg-brand-purple/90">
                Start Free Trial
              </Button>
            </Link>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              7-day free trial, no card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
