"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Sparkles,
  Heart,
  CheckCircle,
  Settings,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/activities", label: "Activities", icon: Sparkles },
  { href: "/activities/saved", label: "Saved", icon: Heart },
  { href: "/milestones", label: "Milestones", icon: CheckCircle, comingSoon: true },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  profile: Profile | null;
  className?: string;
}

export function Sidebar({ profile, className }: SidebarProps) {
  const pathname = usePathname();
  const isFree = profile?.subscription_tier !== "pro";

  return (
    <aside
      className={cn(
        "w-64 flex-col border-r bg-white",
        className
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="text-xl font-bold text-brand-purple">
          TinyMilestones
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.comingSoon ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-purple-50 text-brand-purple"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                item.comingSoon && "cursor-not-allowed opacity-50"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {item.comingSoon && (
                <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {isFree && (
        <div className="m-3 rounded-card bg-gradient-to-br from-brand-purple to-purple-700 p-4 text-white">
          <Crown className="h-5 w-5" />
          <p className="mt-2 text-sm font-semibold">Upgrade to Pro</p>
          <p className="mt-1 text-xs text-purple-200">
            Unlimited activities & more
          </p>
          <Link
            href="/settings/billing"
            className="mt-3 block rounded-lg bg-white/20 px-3 py-1.5 text-center text-xs font-medium hover:bg-white/30"
          >
            Learn more
          </Link>
        </div>
      )}
    </aside>
  );
}
