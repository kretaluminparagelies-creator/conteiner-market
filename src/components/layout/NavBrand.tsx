/**
 * @file NavBrand.tsx
 * @description Site logo — CONTAINER red on dark chip, MARKET light
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { BrandHomeLink } from "@/components/layout/BrandHomeLink";

type NavBrandProps = {
  /** Nav bar background — light (home) or dark (inner pages) */
  surface?: "light" | "dark";
  className?: string;
};

export function NavBrand({ surface = "dark", className }: NavBrandProps) {
  const onLightNav = surface === "light";

  return (
    <BrandHomeLink
      aria-label="Container Market — Αρχική"
      className={[
        "nav-brand-live nav-brand-chip group max-sm:px-2 max-sm:py-1.5",
        onLightNav ? "nav-brand-chip--elevated" : "nav-brand-chip--on-dark-nav",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="relative font-display text-[15px] font-bold tracking-[0.06em] sm:text-[17px] sm:tracking-[0.08em]">
        <span className="animate-nav-brand-red-glow text-cm-brand-red">CONTAINER</span>
        <span className="font-light text-white/78">MARKET</span>
      </span>

      <span
        className={[
          "relative ml-1.5 hidden rounded-full border border-white/18 px-2 py-0.5 sm:ml-2 sm:inline-flex",
          "font-mono text-[10px] tracking-[0.2em] text-white/62",
          "bg-white/8",
        ].join(" ")}
      >
        GR
      </span>
    </BrandHomeLink>
  );
}
