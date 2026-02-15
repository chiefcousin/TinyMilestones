"use client";

import { create } from "zustand";
import type { Activity } from "@/types/database";

interface ActivityState {
  activities: Activity[];
  generating: boolean;
  remainingToday: number | null;
  selectedChildId: string | null;
  selectedDomain: string;
  setActivities: (activities: Activity[]) => void;
  addActivities: (activities: Activity[]) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  setGenerating: (generating: boolean) => void;
  setRemainingToday: (remaining: number | null) => void;
  setSelectedChildId: (childId: string | null) => void;
  setSelectedDomain: (domain: string) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  generating: false,
  remainingToday: null,
  selectedChildId: null,
  selectedDomain: "all",
  setActivities: (activities) => set({ activities }),
  addActivities: (newActivities) =>
    set((state) => ({ activities: [...newActivities, ...state.activities] })),
  updateActivity: (id, updates) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),
  setGenerating: (generating) => set({ generating }),
  setRemainingToday: (remainingToday) => set({ remainingToday }),
  setSelectedChildId: (selectedChildId) => set({ selectedChildId }),
  setSelectedDomain: (selectedDomain) => set({ selectedDomain }),
}));
