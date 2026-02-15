import { headers } from "next/headers";

export function detectCountry(): string {
  const headersList = headers();
  // Vercel provides this header for geo-IP detection (free on all plans)
  const country = headersList.get("x-vercel-ip-country");
  return country || "US";
}
