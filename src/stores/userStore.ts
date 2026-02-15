import { create } from "zustand";
import type { Profile } from "@/types/database";

interface UserStore {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  isPro: boolean;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  setProfile: (profile) =>
    set({
      profile,
      isPro: profile?.subscription_tier === "pro",
    }),
  isPro: false,
}));
