import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-20 md:py-32">
      <div className="mx-auto max-w-6xl text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm text-brand-purple">
            <Sparkles className="h-4 w-4" />
            AI-powered developmental activities
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Personalized activities for{" "}
            <span className="text-brand-purple">every stage</span> of your
            child&apos;s development
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            AI-powered, age-specific play ideas using items you already have at
            home. Science-backed activities that make playtime purposeful.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-brand-purple px-8 text-lg hover:bg-brand-purple/90"
              >
                Start Free &mdash; No Card Required
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              5 free activities every day
            </p>
          </div>
        </div>

        {/* Floating activity card previews */}
        <div className="relative mx-auto mt-16 max-w-2xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-card border bg-white p-4 shadow-md transition-transform hover:-translate-y-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                  {"\u{1F9E0}"} Cognitive
                </span>
                <span className="text-xs text-muted-foreground">5-10 mins</span>
              </div>
              <p className="font-semibold">Texture Discovery Box</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill a box with household items of different textures for your baby to explore
              </p>
            </div>
            <div className="rounded-card border bg-white p-4 shadow-md transition-transform hover:-translate-y-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  {"\u270B"} Fine Motor
                </span>
                <span className="text-xs text-muted-foreground">10 mins</span>
              </div>
              <p className="font-semibold">Pasta Threading Fun</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Thread large pasta onto string to build hand-eye coordination
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
