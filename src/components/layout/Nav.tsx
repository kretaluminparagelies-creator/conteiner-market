/**
 * @file Nav.tsx
 * @description Main site navigation header
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { NavLink } from "@/components/layout/NavLink";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/locale-context";

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
      <Link href="/" className="font-display text-[17px] font-bold tracking-[0.08em]">
        <span className="text-cm-accent">CONTAINER</span>
        <span className="font-light text-cm-sub">MARKET</span>
        <span className="ml-2 font-mono text-[10px] tracking-[0.2em] text-cm-muted">
          GR
        </span>
      </Link>

      <div className="hidden items-center gap-7 lg:flex">
        {mainNav.slice(0, 4).map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <LanguageToggle />
        <Button href="/epikoinonia" className="px-4 py-2 text-[13px] sm:px-5">
          {t.nav.contact}
        </Button>
      </div>
    </nav>
  );
}
