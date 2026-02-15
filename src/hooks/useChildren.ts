"use client";

import { useEffect, useState, useCallback } from "react";
import type { Child } from "@/types/database";

export function useChildren() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChildren = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/children");
    const json = await res.json();
    if (json.success) {
      setChildren(json.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  const createChild = async (data: Partial<Child>) => {
    const res = await fetch("/api/children", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    await fetchChildren();
    return json.data;
  };

  const updateChild = async (id: string, data: Partial<Child>) => {
    const res = await fetch(`/api/children/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    await fetchChildren();
    return json.data;
  };

  const deleteChild = async (id: string) => {
    const res = await fetch(`/api/children/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    await fetchChildren();
  };

  return {
    children,
    loading,
    createChild,
    updateChild,
    deleteChild,
    refetch: fetchChildren,
  };
}
