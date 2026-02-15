"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RazorpayCheckoutProps {
  data: Record<string, unknown>;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

export function RazorpayCheckout({ data, onClose }: RazorpayCheckoutProps) {
  const router = useRouter();

  useEffect(() => {
    // Load Razorpay checkout script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: data.name || "TinyMilestones",
        description: data.description || "Pro Subscription",
        handler: () => {
          // Payment successful — redirect to billing page
          router.push("/settings/billing?success=true");
          router.refresh();
        },
        modal: {
          ondismiss: () => {
            onClose();
          },
        },
        theme: {
          color: "#8B5CF6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [data, onClose, router]);

  return null;
}
