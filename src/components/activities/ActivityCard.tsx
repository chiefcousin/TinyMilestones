"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Lightbulb,
  Package,
} from "lucide-react";
import { ActivityIllustration } from "./ActivityIllustration";
import { getDomainConfig } from "@/lib/constants/domains";
import type { Activity } from "@/types/database";

interface ActivityCardProps {
  activity: Activity;
  onSave?: (id: string, saved: boolean) => void;
  onComplete?: (id: string, completed: boolean) => void;
}

export function ActivityCard({ activity, onSave, onComplete }: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const domainConfig = getDomainConfig(activity.domain);

  const handleSave = async () => {
    if (saving || !onSave) return;
    setSaving(true);
    await onSave(activity.id, !activity.is_saved);
    setSaving(false);
  };

  const handleComplete = async () => {
    if (completing || !onComplete) return;
    setCompleting(true);
    await onComplete(activity.id, !activity.is_completed);
    setCompleting(false);
  };

  return (
    <Card
      className={`overflow-hidden transition-all ${
        activity.is_completed ? "opacity-75" : ""
      }`}
    >
      <CardContent className="p-0">
        {/* Header with illustration */}
        <div className="flex items-start gap-4 p-4 pb-2">
          <ActivityIllustration
            illustrationKey={activity.illustration_key}
            domain={activity.domain}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight">{activity.title}</h3>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full p-1.5 transition-colors hover:bg-muted"
                  title={activity.is_saved ? "Unsave" : "Save"}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      activity.is_saved
                        ? "fill-brand-coral text-brand-coral"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="rounded-full p-1.5 transition-colors hover:bg-muted"
                  title={activity.is_completed ? "Mark incomplete" : "Mark done"}
                >
                  <CheckCircle
                    className={`h-5 w-5 ${
                      activity.is_completed
                        ? "fill-brand-teal text-brand-teal"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <Badge
                className={`${domainConfig.bgClass} ${domainConfig.textClass} border-0 text-xs`}
              >
                {domainConfig.emoji} {domainConfig.label}
              </Badge>
              {activity.is_cultural && (
                <Badge className="border-0 bg-amber-100 text-amber-700 text-xs">
                  Desi
                </Badge>
              )}
              {activity.duration && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {activity.duration}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 pb-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Expandable section */}
        <div className="px-4 pb-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {expanded ? "Show less" : "Show more"}
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {expanded && (
          <div className="space-y-3 border-t bg-muted/30 px-4 py-3">
            {/* Why it matters */}
            {activity.why_it_matters && (
              <div>
                <h4 className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Why it matters
                </h4>
                <p className="text-sm">{activity.why_it_matters}</p>
              </div>
            )}

            {/* Materials */}
            {activity.materials && activity.materials.length > 0 && (
              <div>
                <h4 className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Package className="h-3.5 w-3.5" />
                  Materials
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activity.materials.map((m, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tip */}
            {activity.tip && (
              <div className="rounded-lg bg-brand-purple/5 p-3">
                <p className="text-sm">
                  <span className="font-medium text-brand-purple">Pro tip: </span>
                  {activity.tip}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
