"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  type RegionPricing,
  getPricingForRegion,
} from "@/lib/geo/constants";

interface RegionContextValue {
  region: string;
  pricing: RegionPricing;
}

const RegionContext = createContext<RegionContextValue>({
  region: "US",
  pricing: getPricingForRegion("US"),
});

export function RegionProvider({
  region,
  children,
}: {
  region: string;
  children: ReactNode;
}) {
  const pricing = getPricingForRegion(region);

  return (
    <RegionContext.Provider value={{ region, pricing }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  return useContext(RegionContext);
}
