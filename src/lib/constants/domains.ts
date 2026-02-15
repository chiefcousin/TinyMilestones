export const DOMAINS = [
  {
    id: "Cognitive",
    label: "Cognitive",
    emoji: "\u{1F9E0}",
    color: "#FF9800",
    bgClass: "bg-orange-100",
    textClass: "text-orange-700",
    borderClass: "border-orange-300",
  },
  {
    id: "Fine Motor",
    label: "Fine Motor",
    emoji: "\u270B",
    color: "#4CAF50",
    bgClass: "bg-green-100",
    textClass: "text-green-700",
    borderClass: "border-green-300",
  },
  {
    id: "Gross Motor",
    label: "Gross Motor",
    emoji: "\u{1F3C3}",
    color: "#2196F3",
    bgClass: "bg-blue-100",
    textClass: "text-blue-700",
    borderClass: "border-blue-300",
  },
  {
    id: "Language",
    label: "Language",
    emoji: "\u{1F4AC}",
    color: "#E91E63",
    bgClass: "bg-pink-100",
    textClass: "text-pink-700",
    borderClass: "border-pink-300",
  },
  {
    id: "Social-Emotional",
    label: "Social-Emotional",
    emoji: "\u{1F495}",
    color: "#9C27B0",
    bgClass: "bg-purple-100",
    textClass: "text-purple-700",
    borderClass: "border-purple-300",
  },
] as const;

export type DomainId = (typeof DOMAINS)[number]["id"];

export function getDomainConfig(domainId: string) {
  return DOMAINS.find((d) => d.id === domainId) ?? DOMAINS[0];
}
