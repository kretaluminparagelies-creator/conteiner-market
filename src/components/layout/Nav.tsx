/**
 * @file Nav.tsx
 * @description Main site navigation header
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { NavBrand } from "@/components/layout/NavBrand";
import { NavLink } from "@/components/layout/NavLink";
import { useLocale } from "@/lib/i18n/locale-context";
import Link from "next/link";

export function Nav() {
  const { t } = useLocale();

  const mainNav = [
    { href: "/agora", label: t.nav.buy },
    { href: "/polisi", label: t.nav.sell },
    { href: "/enoikiasi", label: t.nav.rent },
    { href: "/listings", label: t.nav.listings },
    { href: "/epikoinonia", label: t.nav.contact },
  ];

  return (
    <nav
      aria-label={t.nav.ariaLabel}
      className="fixed inset-x-0 top-0 z-[200] flex h-[60px] items-center justify-between border-b border-cm-border bg-cm-bg/92 px-[6%] backdrop-blur-[14px]"
    >
      <NavBrand />

      <div className="hidden items-center gap-7 lg:flex">
        {mainNav.slice(0, 4).map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <LanguageToggle />
        <Link
          href="/epikoinonia"
          className={[
            "nav-brand-live relative overflow-hidden rounded-[4px] border border-cm-accent/55",
            "px-3 py-1.5 font-display text-[13px] font-bold tracking-[0.06em] sm:px-4",
            "tag-sale shadow-[0_0_18px_#e0703033]",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className={[
              "pointer-events-none absolute inset-0",
              "bg-[radial-gradient(circle_at_10%_50%,#e0703022_0%,transparent_72%)]",
            ].join(" ")}
          />
          <span className="relative animate-nav-accent-glow text-cm-accent">
            {t.nav.contact}
          </span>
        </Link>
      </div>
    </nav>
  );
}
