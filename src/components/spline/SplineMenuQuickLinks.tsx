/**
 * @file SplineMenuQuickLinks.tsx
 * @description Text quick links under 3D menu — accessibility + fallback navigation
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-context";

type SplineMenuQuickLinksProps = {
  className?: string;
};

export function SplineMenuQuickLinks({ className }: SplineMenuQuickLinksProps) {
  const { t } = useLocale();

  const links = [
    { href: "/prosfores", label: t.spline.offers },
    { href: "/enoikiasis-xoron", label: t.spline.spaceRent },
  ];

  return (
    <nav
      aria-label={t.spline.quickLinksAria}
      className={["mt-6 flex flex-wrap items-center justify-center gap-3", className]
        .filter(Boolean)
        .join(" ")}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full border border-cm-border bg-cm-card px-5 py-2.5 font-mono text-[11px] tracking-[0.15em] text-cm-sub uppercase transition-colors hover:border-cm-accent hover:text-cm-text"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
