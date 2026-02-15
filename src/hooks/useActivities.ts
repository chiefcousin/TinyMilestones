"use client";

import { useCallback } from "react";
import { useActivityStore } from "@/stores/activityStore";

export function useActivities() {
  const store = useActivityStore();

  const generate = useCallback(
    async (childId: string, domain: string = "all", count: number = 4) => {
      store.setGenerating(true);
      try {
        const res = await fetch("/api/activities/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childId, domain, count }),
        });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to generate activities");
        }

        store.addActivities(json.data);
        if (json.remainingToday !== undefined) {
          store.setRemainingToday(json.remainingToday);
        }
        return json;
      } finally {
        store.setGenerating(false);
      }
    },
    [store]
  );

  const fetchActivities = useCallback(
    async (childId: string) => {
      const res = await fetch(
        `/api/activities?childId=${childId}`
      );
      const json = await res.json();
      if (json.success) {
        store.setActivities(json.data);
      }
    },
    [store]
  );

  const fetchSaved = useCallback(async () => {
    const res = await fetch("/api/activities?saved=true");
    const json = await res.json();
    if (json.success) {
      store.setActivities(json.data);
    }
  }, [store]);

  const toggleSave = useCallback(
    async (id: string, saved: boolean) => {
      store.updateActivity(id, { is_saved: saved });
      const res = await fetch(`/api/activities/${id}/save`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saved }),
      });
      if (!res.ok) {
        store.updateActivity(id, { is_saved: !saved });
      }
    },
    [store]
  );

  const toggleComplete = useCallback(
    async (id: string, completed: boolean) => {
      store.updateActivity(id, {
        is_completed: completed,
        completed_at: completed ? new Date().toISOString() : null,
      });
      const res = await fetch(`/api/activities/${id}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) {
        store.updateActivity(id, {
          is_completed: !completed,
          completed_at: null,
        });
      }
    },
    [store]
  );

  return {
    activities: store.activities,
    generating: store.generating,
    remainingToday: store.remainingToday,
    selectedChildId: store.selectedChildId,
    selectedDomain: store.selectedDomain,
    setSelectedChildId: store.setSelectedChildId,
    setSelectedDomain: store.setSelectedDomain,
    generate,
    fetchActivities,
    fetchSaved,
    toggleSave,
    toggleComplete,
  };
}
