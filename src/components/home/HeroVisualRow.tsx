/**
 * @file HeroVisualRow.tsx
 * @description Hero visuals — container finder (left) + GLB container (right)
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { ContainerHeroVisual } from "@/components/container/ContainerHeroVisual";
import { HeroSearchBar } from "@/components/home/HeroSearchBar";
import { useIsDesktop } from "@/lib/hooks/useIsDesktop";

export function HeroVisualRow() {
  const isDesktop = useIsDesktop(768);

  if (!isDesktop) {
    return (
      <div id="hero-visual" className="flex flex-col gap-4">
        <HeroSearchBar />
        <ContainerHeroVisual plan="glb" />
      </div>
    );
  }

  return (
    <div
      id="hero-visual"
      className="grid h-[min(420px,46vh)] min-h-[320px] w-full min-w-0 grid-cols-2 items-stretch gap-4 lg:h-[420px] lg:min-h-[420px] lg:gap-5"
    >
      <HeroSearchBar className="h-full min-w-0" />
      <ContainerHeroVisual plan="glb" className="h-full min-w-0" />
    </div>
  );
}
