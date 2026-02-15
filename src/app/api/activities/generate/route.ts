import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { anthropic } from "@/lib/anthropic/client";
import { buildActivityPrompt } from "@/lib/anthropic/prompts";
import { calculateAgeInMonths } from "@/lib/utils/age";
import { z } from "zod/v4";
import type { Child, Profile } from "@/types/database";

const generateSchema = z.object({
  childId: z.string().uuid(),
  domain: z.string().default("all"),
  count: z.number().min(1).max(5).default(4),
});

function parseActivitiesJson(text: string): unknown[] {
  // Strip markdown code blocks if present
  let cleaned = text.trim();
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }
  return JSON.parse(cleaned);
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const typedProfile = profile as Profile;

  // Rate limit check (reset if new day)
  const today = new Date().toISOString().split("T")[0];
  if (typedProfile.last_activity_reset < today) {
    await supabase
      .from("profiles")
      .update({ activities_generated_today: 0, last_activity_reset: today })
      .eq("id", user.id);
    typedProfile.activities_generated_today = 0;
  }

  if (
    typedProfile.subscription_tier !== "pro" &&
    typedProfile.activities_generated_today >= 5
  ) {
    return NextResponse.json(
      {
        error: "Daily limit reached. Upgrade to Pro for unlimited activities.",
        remainingToday: 0,
      },
      { status: 429 }
    );
  }

  // Parse input
  const body = await request.json();
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Get child (verify ownership)
  const { data: child } = await supabase
    .from("children")
    .select("*")
    .eq("id", parsed.data.childId)
    .eq("user_id", user.id)
    .single();

  if (!child) {
    return NextResponse.json({ error: "Child not found" }, { status: 404 });
  }

  const typedChild = child as Child;

  // Resolve cultural context
  let effectiveContext = typedProfile.cultural_context;
  if (effectiveContext === "auto") {
    effectiveContext = typedProfile.region === "IN" ? "indian" : "universal";
  }

  // Build prompt and call Claude
  const prompt = buildActivityPrompt(
    typedChild,
    parsed.data.domain,
    effectiveContext,
    parsed.data.count
  );

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    const activities = parseActivitiesJson(textContent.text);
    if (!Array.isArray(activities)) {
      throw new Error("Response is not an array");
    }

    const ageMonths = calculateAgeInMonths(typedChild.birthdate);

    // Save activities to database
    const activitiesToInsert = (activities as Record<string, unknown>[]).map((activity) => ({
      user_id: user.id,
      child_id: typedChild.id,
      title: activity.title as string,
      domain: activity.domain as string,
      duration: activity.duration as string,
      description: activity.description as string,
      why_it_matters: activity.whyItMatters as string,
      materials: activity.materials as string[],
      tip: activity.tip as string,
      illustration_key: activity.illustrationKey as string,
      is_cultural: (activity.isCultural as boolean) || false,
      cultural_origin: (activity.isCultural as boolean) ? "indian" : null,
      child_age_months: ageMonths,
    }));

    const { data: savedActivities, error: insertError } = await supabase
      .from("activities")
      .insert(activitiesToInsert)
      .select();

    if (insertError) {
      console.error("Failed to save activities:", insertError);
    }

    // Increment rate counter (atomic)
    await supabase.rpc("increment_activity_count", { user_id_param: user.id });
    // Fallback if RPC doesn't exist
    if (typedProfile.subscription_tier !== "pro") {
      await supabase
        .from("profiles")
        .update({
          activities_generated_today:
            typedProfile.activities_generated_today + 1,
        })
        .eq("id", user.id);
    }

    // Log the generation
    await supabase.from("activity_logs").insert({
      user_id: user.id,
      child_id: typedChild.id,
      domain_filter: parsed.data.domain,
      activities_count: activities.length,
    });

    const remaining =
      typedProfile.subscription_tier === "pro"
        ? -1
        : Math.max(0, 4 - typedProfile.activities_generated_today);

    return NextResponse.json({
      success: true,
      data: savedActivities || activitiesToInsert,
      remainingToday: remaining,
    });
  } catch (error) {
    console.error("Activity generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate activities. Please try again." },
      { status: 500 }
    );
  }
}
