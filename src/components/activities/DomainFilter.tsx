"use client";

import { DOMAINS } from "@/lib/constants/domains";

interface DomainFilterProps {
  selected: string;
  onChange: (domain: string) => void;
}

export function DomainFilter({ selected, onChange }: DomainFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("all")}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          selected === "all"
            ? "bg-brand-purple text-white"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        All
      </button>
      {DOMAINS.map((domain) => (
        <button
          key={domain.id}
          onClick={() => onChange(domain.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selected === domain.id
              ? `${domain.bgClass} ${domain.textClass}`
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {domain.emoji} {domain.label}
        </button>
      ))}
    </div>
  );
}
