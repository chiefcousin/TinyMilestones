"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckoutButton } from "./CheckoutButton";
import { useRegion } from "@/lib/geo/RegionProvider";
import { formatPrice } from "@/lib/geo/constants";
import { Check, Zap } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRO_FEATURES = [
  "Unlimited activity generation",
  "Unlimited child profiles",
  "Unlimited saved activities",
  "Priority AI generation",
  "All developmental domains",
];

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const { pricing } = useRegion();
  const monthlyPrice = formatPrice(
    pricing.monthlyPrice,
    pricing.locale,
    pricing.currency
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-brand-purple" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription>
            Get unlimited access for just {monthlyPrice}/month
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {PRO_FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-purple/10">
                <Check className="h-3 w-3 text-brand-purple" />
              </div>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <CheckoutButton plan="monthly" size="lg" />
          <p className="text-center text-xs text-muted-foreground">
            7-day free trial. Cancel anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
