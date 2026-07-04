/**
 * @file NavBrand.tsx
 * @description Site logo — CONTAINER red on dark chip, MARKET light
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Link from "next/link";

type NavBrandProps = {
  /** Nav bar background — light (home) or dark (inner pages) */
  surface?: "light" | "dark";
};

export function NavBrand({ surface = "dark" }: NavBrandProps) {
  const onLightNav = surface === "light";

  return (
    <Link
      href="/"
      className={[
        "nav-brand-live nav-brand-chip group",
        onLightNav ? "nav-brand-chip--elevated" : "nav-brand-chip--on-dark-nav",
      ].join(" ")}
    >
      <span className="relative font-display text-[17px] font-bold tracking-[0.08em]">
        <span className="animate-nav-brand-red-glow text-cm-brand-red">CONTAINER</span>
        <span className="font-light text-white/78">MARKET</span>
      </span>

      <span
        className={[
          "relative ml-2 rounded-full border border-white/18 px-2 py-0.5",
          "font-mono text-[10px] tracking-[0.2em] text-white/62",
          "bg-white/8",
        ].join(" ")}
      >
        GR
      </span>
    </Link>
  );
}
