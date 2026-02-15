"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/activities", label: "Activities", icon: Sparkles },
  { href: "/activities/saved", label: "Saved", icon: Heart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t bg-white",
        className
      )}
    >
      <div className="flex items-center justify-around py-2 pb-safe">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1",
                isActive ? "text-brand-purple" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
