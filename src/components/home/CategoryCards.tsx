/**
 * @file CategoryCards.tsx
 * @description Service category card grid — shared by Categories & ServicePicker fallback
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { TiltCard } from "@/components/ui/TiltCard";
import { categories } from "@/lib/constants/home";
import { fadeUpStyle } from "@/lib/utils/motion";

type CategoryCardsProps = {
  visible?: boolean;
};

export function CategoryCards({ visible = true }: CategoryCardsProps) {
  return (
    <div className="grid gap-0.5 md:grid-cols-3">
      {categories.map((category, index) => (
        <Link key={category.href} href={category.href} className="block">
          <TiltCard
            showTopBar
            className="relative h-full cursor-pointer overflow-hidden border border-cm-border bg-cm-card p-10 md:p-12"
            style={fadeUpStyle(visible, index * 0.15 + 0.2)}
          >
            <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-cm-accent uppercase">
              {category.tag}
            </p>
            <h3 className="mb-3.5 font-display text-[30px] font-bold">{category.title}</h3>
            <p className="mb-7 text-sm leading-[1.8] text-cm-sub">{category.description}</p>
            <p className="font-mono text-[11px] text-cm-muted">{category.note}</p>
          </TiltCard>
        </Link>
      ))}
    </div>
  );
}
