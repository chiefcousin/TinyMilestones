"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useChildren } from "@/hooks/useChildren";
import { useActivities } from "@/hooks/useActivities";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { DomainFilter } from "@/components/activities/DomainFilter";
import { ActivitySkeleton } from "@/components/activities/ActivitySkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, AlertCircle, Plus } from "lucide-react";
import Link from "next/link";

export default function ActivitiesPage() {
  const searchParams = useSearchParams();
  const initialChildId = searchParams.get("childId");
  const { children, loading: childrenLoading } = useChildren();
  const {
    activities,
    generating,
    remainingToday,
    selectedChildId,
    selectedDomain,
    setSelectedChildId,
    setSelectedDomain,
    generate,
    fetchActivities,
    toggleSave,
    toggleComplete,
  } = useActivities();

  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Set initial child from URL params
  useEffect(() => {
    if (initialChildId && !selectedChildId) {
      setSelectedChildId(initialChildId);
    }
  }, [initialChildId, selectedChildId, setSelectedChildId]);

  // Auto-select first child if none selected
  useEffect(() => {
    if (!childrenLoading && children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, childrenLoading, selectedChildId, setSelectedChildId]);

  // Fetch activities when child changes
  useEffect(() => {
    if (selectedChildId) {
      fetchActivities(selectedChildId).then(() => setInitialLoad(false));
    }
  }, [selectedChildId, fetchActivities]);

  const handleGenerate = async () => {
    if (!selectedChildId) return;
    setError(null);
    try {
      await generate(selectedChildId, selectedDomain);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate activities");
    }
  };

  const selectedChild = children.find((c) => c.id === selectedChildId);

  // Filter activities by selected domain
  const filteredActivities =
    selectedDomain === "all"
      ? activities
      : activities.filter((a) => a.domain === selectedDomain);

  if (childrenLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <ActivitySkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // No children yet
  if (children.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Activities</h1>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Sparkles className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Add a child first</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a child profile to start generating activities
            </p>
            <Link href="/children/new" className="mt-4">
              <Button className="bg-brand-purple hover:bg-brand-purple/90">
                <Plus className="mr-1 h-4 w-4" />
                Add Child
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Activities</h1>
        <div className="flex items-center gap-3">
          {/* Child selector */}
          {children.length > 1 && (
            <Select
              value={selectedChildId || ""}
              onValueChange={setSelectedChildId}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.avatar_emoji} {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Generate button */}
          <Button
            className="bg-brand-purple hover:bg-brand-purple/90"
            onClick={handleGenerate}
            disabled={generating || !selectedChildId}
          >
            <Sparkles className="mr-1.5 h-4 w-4" />
            {generating ? "Generating..." : "Generate Activities"}
          </Button>
        </div>
      </div>

      {/* Rate limit info */}
      {remainingToday !== null && remainingToday >= 0 && (
        <p className="text-sm text-muted-foreground">
          {remainingToday === 0
            ? "Daily limit reached. Upgrade to Pro for unlimited."
            : `${remainingToday} generation${remainingToday !== 1 ? "s" : ""} remaining today`}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Domain filter */}
      <DomainFilter selected={selectedDomain} onChange={setSelectedDomain} />

      {/* Generating skeleton */}
      {generating && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <ActivitySkeleton key={i} />
          ))}
        </div>
      )}

      {/* Activities grid */}
      {filteredActivities.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onSave={toggleSave}
              onComplete={toggleComplete}
            />
          ))}
        </div>
      ) : (
        !generating &&
        !initialLoad && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Sparkles className="h-10 w-10 text-muted-foreground/40" />
              <h3 className="mt-4 font-semibold">
                {selectedDomain !== "all"
                  ? `No ${selectedDomain} activities yet`
                  : "No activities yet"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedChild
                  ? `Generate personalized activities for ${selectedChild.name}`
                  : "Select a child and generate activities"}
              </p>
              <Button
                className="mt-4 bg-brand-purple hover:bg-brand-purple/90"
                onClick={handleGenerate}
                disabled={generating || !selectedChildId}
              >
                <Sparkles className="mr-1.5 h-4 w-4" />
                Generate Activities
              </Button>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
