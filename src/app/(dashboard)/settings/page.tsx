import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types/database";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const typedProfile = profile as Profile;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{typedProfile.full_name || "No name set"}</p>
              <p className="text-sm text-muted-foreground">{typedProfile.email}</p>
            </div>
            <Badge
              className={
                typedProfile.subscription_tier === "pro"
                  ? "bg-brand-purple text-white"
                  : "bg-muted"
              }
            >
              {typedProfile.subscription_tier === "pro" ? "Pro" : "Free"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Region & Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Region</p>
              <p className="text-sm text-muted-foreground">
                {typedProfile.region} ({typedProfile.region_source === "auto" ? "Auto-detected" : "Manual"})
              </p>
            </div>
            <p className="text-sm">{typedProfile.currency}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Cultural Activities</p>
              <p className="text-sm text-muted-foreground">
                {typedProfile.cultural_context === "auto"
                  ? "Automatic (based on region)"
                  : typedProfile.cultural_context === "indian"
                  ? "Indian / Desi activities enabled"
                  : "Universal activities only"}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Payment Gateway</p>
              <p className="text-sm text-muted-foreground">
                {typedProfile.payment_gateway
                  ? typedProfile.payment_gateway === "razorpay"
                    ? "Razorpay (India)"
                    : "Stripe"
                  : "Not set"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm">Activities generated</p>
            <p className="text-sm font-medium">
              {typedProfile.activities_generated_today}
              {typedProfile.subscription_tier !== "pro" && " / 5"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
