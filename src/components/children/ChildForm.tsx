"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import type { Child } from "@/types/database";

const EMOJI_OPTIONS = [
  "\u{1F476}", "\u{1F467}", "\u{1F466}", "\u{1F47C}", "\u{1F9D2}",
  "\u{1F478}", "\u{1F934}", "\u{1F31F}", "\u{1F308}", "\u{1F33B}",
  "\u{1F98B}", "\u{1F43B}",
];

const childFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  birthdate: z.string().min(1, "Birthdate is required"),
  avatar_emoji: z.string(),
  preferences: z.object({
    materials: z.enum(["household", "any"]),
    activity_duration: z.string(),
    indoor_outdoor: z.enum(["indoor", "outdoor", "both"]),
    notes: z.string().max(500),
  }),
});

type ChildFormData = z.infer<typeof childFormSchema>;

interface ChildFormProps {
  child?: Child;
  onSubmit: (data: ChildFormData) => Promise<void>;
  loading?: boolean;
}

export function ChildForm({ child, onSubmit, loading }: ChildFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChildFormData>({
    resolver: zodResolver(childFormSchema),
    defaultValues: {
      name: child?.name || "",
      birthdate: child?.birthdate || "",
      avatar_emoji: child?.avatar_emoji || "\u{1F476}",
      preferences: {
        materials: child?.preferences?.materials || "household",
        activity_duration: child?.preferences?.activity_duration || "any",
        indoor_outdoor: child?.preferences?.indoor_outdoor || "both",
        notes: child?.preferences?.notes || "",
      },
    },
  });

  const selectedEmoji = watch("avatar_emoji");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Child&apos;s name</Label>
            <Input id="name" placeholder="e.g. Emma" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthdate">Date of birth</Label>
            <Input id="birthdate" type="date" {...register("birthdate")} />
            {errors.birthdate && (
              <p className="text-sm text-destructive">
                {errors.birthdate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Avatar</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setValue("avatar_emoji", emoji)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all ${
                    selectedEmoji === emoji
                      ? "bg-brand-purple/10 ring-2 ring-brand-purple"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <h3 className="font-semibold">Preferences</h3>

          <div className="space-y-2">
            <Label>Materials</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value="household"
                  {...register("preferences.materials")}
                  className="accent-brand-purple"
                />
                Household items only
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value="any"
                  {...register("preferences.materials")}
                  className="accent-brand-purple"
                />
                Include specific toys
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Activity setting</Label>
            <div className="flex gap-4">
              {(["indoor", "outdoor", "both"] as const).map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    value={option}
                    {...register("preferences.indoor_outdoor")}
                    className="accent-brand-purple"
                  />
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special considerations..."
              {...register("preferences.notes")}
            />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full bg-brand-purple hover:bg-brand-purple/90"
        disabled={loading}
      >
        {loading ? "Saving..." : child ? "Update Child" : "Add Child"}
      </Button>
    </form>
  );
}
