"use client";

import { useEffect, useState } from "react";
import { useActivities } from "@/hooks/useActivities";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { ActivitySkeleton } from "@/components/activities/ActivitySkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SavedActivitiesPage() {
  const { activities, fetchSaved, toggleSave, toggleComplete } = useActivities();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved().then(() => setLoading(false));
  }, [fetchSaved]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Saved Activities</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <ActivitySkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Saved Activities</h1>

      {activities.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onSave={toggleSave}
              onComplete={toggleComplete}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Heart className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-semibold">No saved activities</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap the heart icon on any activity to save it here
            </p>
            <Link href="/activities" className="mt-4">
              <Button variant="outline">Browse Activities</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
