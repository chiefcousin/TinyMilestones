import { Calendar, Home, GraduationCap, Sparkles } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Age-Perfect Activities",
    description:
      "Every activity is tailored to your child's exact age and developmental stage.",
  },
  {
    icon: Home,
    title: "Household Items Only",
    description:
      "No expensive toys needed. Every activity uses things you already have at home.",
  },
  {
    icon: GraduationCap,
    title: "Science-Backed",
    description:
      "Activities aligned with CDC and AAP developmental milestones and guidelines.",
  },
  {
    icon: Sparkles,
    title: "Fresh Ideas Daily",
    description:
      "AI-generated variety means you'll never run out of new, engaging activities.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Why parents love TinyMilestones
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Everything you need to make playtime purposeful and development-focused
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-card border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-xl bg-purple-50 p-3">
                <feature.icon className="h-6 w-6 text-brand-purple" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
