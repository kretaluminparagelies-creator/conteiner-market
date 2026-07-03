/**
 * @file NavBrand.tsx
 * @description Site logo — continuous accent glow + shine sweep
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Link from "next/link";

export function NavBrand() {
  return (
    <Link
      href="/"
      className="nav-brand-live relative flex items-center overflow-hidden rounded-[4px] px-2 py-1.5"
    >
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(circle_at_10%_50%,#e0703022_0%,transparent_72%)]",
        ].join(" ")}
      />

      <span className="relative font-display text-[17px] font-bold tracking-[0.08em]">
        <span className="animate-nav-accent-glow text-cm-accent">CONTAINER</span>
        <span className="text-cm-sub">MARKET</span>
      </span>

      <span
        className={[
          "relative ml-2 rounded-full border border-cm-accent/55 px-2 py-0.5",
          "font-mono text-[10px] tracking-[0.2em] tag-sale",
          "shadow-[0_0_18px_#e0703033]",
        ].join(" ")}
      >
        GR
      </span>
    </Link>
  );
}
