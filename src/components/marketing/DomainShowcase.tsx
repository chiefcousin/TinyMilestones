import { DOMAINS } from "@/lib/constants/domains";

export function DomainShowcase() {
  return (
    <section className="bg-gradient-to-b from-white to-purple-50/50 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          5 developmental domains
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Activities covering every aspect of your child&apos;s growth
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {DOMAINS.map((domain) => (
            <div
              key={domain.id}
              className="rounded-card border bg-white p-5 text-center shadow-sm"
            >
              <div className="text-4xl">{domain.emoji}</div>
              <h3 className="mt-3 font-semibold">{domain.label}</h3>
              <div
                className="mx-auto mt-2 h-1 w-12 rounded-full"
                style={{ backgroundColor: domain.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
