"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChildForm } from "@/components/children/ChildForm";

export default function NewChildPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">Add a Child</h1>
      <ChildForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
