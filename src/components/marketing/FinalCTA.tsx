import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="bg-gradient-to-r from-brand-purple to-purple-700 px-4 py-20 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to make playtime purposeful?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-purple-100">
          Join thousands of parents who are supporting their child&apos;s
          development with personalized, science-backed activities.
        </p>
        <Link href="/signup" className="mt-8 inline-block">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white px-8 text-lg text-brand-purple hover:bg-gray-100"
          >
            Start Free &mdash; No Card Required
          </Button>
        </Link>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-purple-200">
          <span>No credit card</span>
          <span>Cancel anytime</span>
          <span>5 free activities/day</span>
        </div>
      </div>
    </section>
  );
}
