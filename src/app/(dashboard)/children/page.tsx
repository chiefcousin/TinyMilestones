"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChildren } from "@/hooks/useChildren";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import { calculateAgeInMonths, formatAge } from "@/lib/utils/age";

export default function ChildrenPage() {
  const { children, loading, deleteChild } = useChildren();
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}'s profile?`)) return;
    await deleteChild(id);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Children</h1>
        </div>
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-16 animate-pulse rounded-lg bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Children</h1>
        <Link href="/children/new">
          <Button className="bg-brand-purple hover:bg-brand-purple/90">
            <Plus className="mr-1 h-4 w-4" />
            Add Child
          </Button>
        </Link>
      </div>

      {children.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-5xl">👶</div>
            <h3 className="mt-4 text-lg font-semibold">No children yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your child to start generating personalized activities
            </p>
            <Link href="/children/new" className="mt-4">
              <Button className="bg-brand-purple hover:bg-brand-purple/90">
                <Plus className="mr-1 h-4 w-4" />
                Add Your First Child
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {children.map((child) => {
            const ageMonths = calculateAgeInMonths(child.birthdate);
            return (
              <Card key={child.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-3xl">
                    {child.avatar_emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{child.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatAge(ageMonths)}
                    </p>
                    <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">
                        {child.preferences.materials === "household"
                          ? "Household items"
                          : "Any materials"}
                      </span>
                      <span>&middot;</span>
                      <span className="capitalize">
                        {child.preferences.indoor_outdoor}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-brand-purple hover:bg-brand-purple/90"
                      onClick={() =>
                        router.push(`/activities?childId=${child.id}`)
                      }
                    >
                      <Sparkles className="mr-1 h-4 w-4" />
                      Play
                    </Button>
                    <Link href={`/children/${child.id}`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(child.id, child.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
