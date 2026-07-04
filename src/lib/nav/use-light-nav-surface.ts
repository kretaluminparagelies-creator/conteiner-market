/**
 * @file use-light-nav-surface.ts
 * @description Home-like light nav/footer on polisi and sell contact flows
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { usePathname } from "next/navigation";

export function useLightNavSurface(): boolean {
  const pathname = usePathname();

  return pathname === "/" || pathname === "/polisi" || pathname === "/epikoinonia";
}
