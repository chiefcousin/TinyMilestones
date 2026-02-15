"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChildForm } from "@/components/children/ChildForm";
import type { Child } from "@/types/database";

export default function EditChildPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.id as string;
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchChild() {
      const res = await fetch(`/api/children/${childId}`);
      if (!res.ok) {
        router.push("/children");
        return;
      }
      const json = await res.json();
      setChild(json.data);
      setLoading(false);
    }
    fetchChild();
  }, [childId, router]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/children/${childId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }
      router.push("/children");
      router.refresh();
    } catch {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!child) return null;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">Edit {child.name}</h1>
      <ChildForm child={child} onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}
