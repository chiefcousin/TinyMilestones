import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod/v4";

const createChildSchema = z.object({
  name: z.string().min(1).max(50),
  birthdate: z.string(),
  avatar_emoji: z.string().default("\u{1F476}"),
  preferences: z
    .object({
      materials: z.enum(["household", "any"]).default("household"),
      activity_duration: z.string().default("any"),
      indoor_outdoor: z.enum(["indoor", "outdoor", "both"]).default("both"),
      notes: z.string().max(500).default(""),
    })
    .default(() => ({
      materials: "household" as const,
      activity_duration: "any",
      indoor_outdoor: "both" as const,
      notes: "",
    })),
});

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("children")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check subscription tier limits
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  if (profile?.subscription_tier !== "pro") {
    const { count } = await supabase
      .from("children")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (count && count >= 1) {
      return NextResponse.json(
        {
          error:
            "Free tier limited to 1 child profile. Upgrade to Pro for unlimited.",
        },
        { status: 403 }
      );
    }
  }

  const body = await request.json();
  const parsed = createChildSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("children")
    .insert({
      user_id: user.id,
      ...parsed.data,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data }, { status: 201 });
}
