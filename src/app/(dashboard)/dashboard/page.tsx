import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Heart, Users, Plus } from "lucide-react";
import { formatAge, calculateAgeInMonths } from "@/lib/utils/age";
import type { Profile, Child, Activity } from "@/types/database";

export default async function DashboardPage() {
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

  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const { data: recentActivities } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { count: savedCount } = await supabase
    .from("activities")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_saved", true);

  const typedProfile = profile as Profile | null;
  const typedChildren = (children || []) as Child[];
  const typedActivities = (recentActivities || []) as Activity[];
  const displayName = typedProfile?.full_name || "there";

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">
          {greeting}, {displayName}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening with your little ones
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Activities Today
            </CardTitle>
            <Sparkles className="h-4 w-4 text-brand-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typedProfile?.activities_generated_today || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {typedProfile?.subscription_tier === "pro"
                ? "Unlimited"
                : `${5 - (typedProfile?.activities_generated_today || 0)} remaining today`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saved Activities
            </CardTitle>
            <Heart className="h-4 w-4 text-brand-coral" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {typedProfile?.subscription_tier === "pro"
                ? "Unlimited"
                : `${10 - (savedCount || 0)} slots remaining`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Children
            </CardTitle>
            <Users className="h-4 w-4 text-brand-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{typedChildren.length}</div>
            <p className="text-xs text-muted-foreground">
              {typedProfile?.subscription_tier === "pro"
                ? "Unlimited profiles"
                : `${1 - typedChildren.length} slots remaining`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Children */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Children</h2>
          <Link href="/children/new">
            <Button size="sm" variant="outline">
              <Plus className="mr-1 h-4 w-4" />
              Add Child
            </Button>
          </Link>
        </div>

        {typedChildren.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                Add your first child
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start generating personalized activities
              </p>
              <Link href="/children/new" className="mt-4">
                <Button className="bg-brand-purple hover:bg-brand-purple/90">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Child
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {typedChildren.map((child) => {
              const ageMonths = calculateAgeInMonths(child.birthdate);
              return (
                <Card key={child.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-2xl">
                      {child.avatar_emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{child.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatAge(ageMonths)}
                      </p>
                    </div>
                    <Link href={`/activities?childId=${child.id}`}>
                      <Button size="sm" className="bg-brand-purple hover:bg-brand-purple/90">
                        <Sparkles className="mr-1 h-4 w-4" />
                        Play
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activities */}
      {typedActivities.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Recent Activities</h2>
          <div className="space-y-3">
            {typedActivities.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.domain} &middot; {activity.duration}
                    </p>
                  </div>
                  {activity.is_saved && (
                    <Heart className="h-4 w-4 fill-brand-coral text-brand-coral" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
