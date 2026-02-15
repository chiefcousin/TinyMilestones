"use client";

import {
  Hand,
  Sparkles,
  Blocks,
  ArrowUp,
  Palette,
  Pencil,
  Scissors,
  FileText,
  TreePine,
  Wind,
  Circle,
  ArrowRight,
  Music,
  Mic2,
  Drama,
  Wand2,
  Droplets,
  Waves,
  LayoutGrid,
  ArrowDownUp,
  ChefHat,
  Utensils,
  Leaf,
  Bug,
  Music2,
  Move,
  Users,
  Handshake,
  Shapes,
  Cable,
  Gem,
  GlassWater,
  ArrowRightLeft,
  Smile,
  ScanFace,
  Eye,
  EyeOff,
  type LucideIcon,
} from "lucide-react";
import { getDomainConfig } from "@/lib/constants/domains";
import type { ActivityArchetype } from "@/lib/constants/illustrations";

const ICON_MAP: Record<string, LucideIcon> = {
  Hand,
  Sparkles,
  Blocks,
  ArrowUp,
  Palette,
  Pencil,
  Scissors,
  FileText,
  TreePine,
  Wind,
  Circle,
  ArrowRight,
  Music,
  Mic2,
  Drama,
  Wand2,
  Droplets,
  Waves,
  LayoutGrid,
  ArrowDownUp,
  ChefHat,
  Utensils,
  Leaf,
  Bug,
  Music2,
  Move,
  Users,
  Handshake,
  Shapes,
  Cable,
  Gem,
  GlassWater,
  ArrowRightLeft,
  Smile,
  ScanFace,
  Eye,
  EyeOff,
};

const ARCHETYPE_ICON_CONFIG: Record<
  ActivityArchetype,
  { primary: string; secondary?: string }
> = {
  "sensory-explore": { primary: "Hand", secondary: "Sparkles" },
  "build-stack": { primary: "Blocks", secondary: "ArrowUp" },
  "draw-color": { primary: "Palette", secondary: "Pencil" },
  "cut-paste": { primary: "Scissors", secondary: "FileText" },
  "outdoor-run": { primary: "TreePine", secondary: "Wind" },
  "ball-play": { primary: "Circle", secondary: "ArrowRight" },
  "music-sing": { primary: "Music", secondary: "Mic2" },
  "story-read": { primary: "Drama", secondary: "Wand2" },
  "pretend-play": { primary: "Drama", secondary: "Wand2" },
  "water-play": { primary: "Droplets", secondary: "Waves" },
  "sort-match": { primary: "LayoutGrid", secondary: "ArrowDownUp" },
  "cook-food": { primary: "ChefHat", secondary: "Utensils" },
  "nature-explore": { primary: "Leaf", secondary: "Bug" },
  "dance-move": { primary: "Music2", secondary: "Move" },
  "social-game": { primary: "Users", secondary: "Handshake" },
  "clay-dough": { primary: "Shapes", secondary: "Hand" },
  "thread-lace": { primary: "Cable", secondary: "Gem" },
  "pour-transfer": { primary: "GlassWater", secondary: "ArrowRightLeft" },
  "mirror-faces": { primary: "Smile", secondary: "ScanFace" },
  "hide-seek": { primary: "Eye", secondary: "EyeOff" },
};

const DOMAIN_BG: Record<string, string> = {
  Cognitive: "bg-orange-100",
  "Fine Motor": "bg-green-100",
  "Gross Motor": "bg-blue-100",
  Language: "bg-pink-100",
  "Social-Emotional": "bg-purple-100",
};

const DOMAIN_ICON_COLOR: Record<string, string> = {
  Cognitive: "text-orange-600",
  "Fine Motor": "text-green-600",
  "Gross Motor": "text-blue-600",
  Language: "text-pink-600",
  "Social-Emotional": "text-purple-600",
};

interface ActivityIllustrationProps {
  illustrationKey: string | null;
  domain: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { container: "h-12 w-12", primary: "h-5 w-5", secondary: "h-3 w-3" },
  md: { container: "h-20 w-20", primary: "h-8 w-8", secondary: "h-5 w-5" },
  lg: { container: "h-28 w-28", primary: "h-12 w-12", secondary: "h-7 w-7" },
};

export function ActivityIllustration({
  illustrationKey,
  domain,
  size = "md",
  className = "",
}: ActivityIllustrationProps) {
  const config =
    ARCHETYPE_ICON_CONFIG[illustrationKey as ActivityArchetype] || null;
  const domainConfig = getDomainConfig(domain);
  const sizeConfig = SIZES[size];

  const bgColor = DOMAIN_BG[domain] || "bg-gray-100";
  const iconColor = DOMAIN_ICON_COLOR[domain] || "text-gray-600";

  // Fallback to domain-specific icon
  const PrimaryIcon = config
    ? ICON_MAP[config.primary] || Sparkles
    : Sparkles;
  const SecondaryIcon = config?.secondary
    ? ICON_MAP[config.secondary] || null
    : null;

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl ${bgColor} ${sizeConfig.container} ${className}`}
      title={domainConfig.label}
    >
      <PrimaryIcon className={`${sizeConfig.primary} ${iconColor}`} />
      {SecondaryIcon && (
        <SecondaryIcon
          className={`absolute bottom-1 right-1 ${sizeConfig.secondary} ${iconColor} opacity-60`}
        />
      )}
    </div>
  );
}
