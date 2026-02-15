"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton({ variant = "ghost" }: { variant?: "ghost" | "outline" | "default" }) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Button variant={variant} onClick={handleLogout} size="sm">
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </Button>
  );
}
