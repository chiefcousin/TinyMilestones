import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Header } from "@/components/layout/Header";
import { RegionProvider } from "@/lib/geo/RegionProvider";
import type { Profile } from "@/types/database";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const typedProfile = profile as Profile | null;
  const region = typedProfile?.region || "US";

  return (
    <RegionProvider region={region}>
      <div className="flex h-screen bg-muted/30">
        <Sidebar profile={typedProfile} className="hidden md:flex" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header user={user} profile={typedProfile} />
          <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6 lg:p-8">
            {children}
          </main>
        </div>
        <MobileNav className="md:hidden" />
      </div>
    </RegionProvider>
  );
}
