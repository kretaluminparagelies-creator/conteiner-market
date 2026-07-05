/**
 * @file highlight-config.ts
 * @description Icons and themes for home highlight cards
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import {
  CalendarRange,
  Handshake,
  Layers,
  ShieldCheck,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { HighlightItemKey } from "@/lib/constants/home";

export type HighlightTheme = {
  topBar: string;
  iconWrap: string;
  iconColor: string;
  glow: string;
};

export const highlightIcons: Record<HighlightItemKey, LucideIcon> = {
  conversions: Wrench,
  prices: Handshake,
  variety: Layers,
  certification: ShieldCheck,
  delivery: Truck,
  monthlyRental: CalendarRange,
};

export const highlightThemes: Record<HighlightItemKey, HighlightTheme> = {
  conversions: {
    topBar: "from-cm-accent via-[#f08848] to-cm-accent/0",
    iconWrap:
      "border-cm-accent/35 bg-linear-to-br from-cm-accent/18 to-cm-accent/6 shadow-[0_8px_20px_-8px_rgba(224,112,48,0.55)]",
    iconColor: "text-cm-accent",
    glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(224,112,48,0.14),transparent_68%)]",
  },
  prices: {
    topBar: "from-emerald-500 via-emerald-400 to-emerald-500/0",
    iconWrap:
      "border-emerald-500/30 bg-linear-to-br from-emerald-500/16 to-emerald-500/5 shadow-[0_8px_20px_-8px_rgba(16,185,129,0.45)]",
    iconColor: "text-emerald-600",
    glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_68%)]",
  },
  variety: {
    topBar: "from-cm-rent via-[#5ab0e8] to-cm-rent/0",
    iconWrap:
      "border-cm-rent/35 bg-linear-to-br from-cm-rent/18 to-cm-rent/6 shadow-[0_8px_20px_-8px_rgba(74,176,232,0.45)]",
    iconColor: "text-cm-rent",
    glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(74,176,232,0.14),transparent_68%)]",
  },
  certification: {
    topBar: "from-indigo-500 via-violet-400 to-indigo-500/0",
    iconWrap:
      "border-indigo-400/30 bg-linear-to-br from-indigo-500/16 to-indigo-500/5 shadow-[0_8px_20px_-8px_rgba(99,102,241,0.4)]",
    iconColor: "text-indigo-600",
    glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.12),transparent_68%)]",
  },
  delivery: {
    topBar: "from-amber-500 via-orange-400 to-amber-500/0",
    iconWrap:
      "border-amber-500/35 bg-linear-to-br from-amber-500/18 to-amber-500/6 shadow-[0_8px_20px_-8px_rgba(245,158,11,0.45)]",
    iconColor: "text-amber-600",
    glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.13),transparent_68%)]",
  },
  monthlyRental: {
    topBar: "from-teal-600 via-teal-400 to-teal-600/0",
    iconWrap:
      "border-teal-500/35 bg-linear-to-br from-teal-500/18 to-teal-500/6 shadow-[0_8px_20px_-8px_rgba(20,184,166,0.45)]",
    iconColor: "text-teal-600",
    glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,0.14),transparent_68%)]",
  },
};
