/**
 * @file HeroVisualRow.tsx
 * @description Hero search — container finder only
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { HeroSearchBar } from "@/components/home/HeroSearchBar";

export function HeroVisualRow() {
  return (
    <div id="hero-visual" className="w-full max-w-md sm:max-w-lg">
      <HeroSearchBar />
    </div>
  );
}
