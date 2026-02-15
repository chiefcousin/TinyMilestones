import { differenceInMonths } from "date-fns";

export function calculateAgeInMonths(birthdate: string | Date): number {
  return differenceInMonths(new Date(), new Date(birthdate));
}

export function formatAge(months: number): string {
  if (months < 1) return "Newborn";
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  if (remaining === 0) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years}y ${remaining}m`;
}

export function getDevelopmentalStage(months: number): string {
  if (months < 3) return "0-3 months (Newborn)";
  if (months < 6) return "3-6 months (Infant)";
  if (months < 9) return "6-9 months (Infant)";
  if (months < 12) return "9-12 months (Pre-toddler)";
  if (months < 18) return "12-18 months (Early Toddler)";
  if (months < 24) return "18-24 months (Toddler)";
  if (months < 36) return "2-3 years (Late Toddler)";
  if (months < 48) return "3-4 years (Preschooler)";
  if (months < 60) return "4-5 years (Preschooler)";
  return "5-6 years (Kindergartner)";
}
