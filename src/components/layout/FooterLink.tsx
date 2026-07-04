/**
 * @file FooterLink.tsx
 * @description Single footer navigation link
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { useLightNavSurface } from "@/lib/nav/use-light-nav-surface";

type FooterLinkProps = {
  href: string;
  label: string;
};

export function FooterLink({ href, label }: FooterLinkProps) {
  const isLightFooter = useLightNavSurface();

  return (
    <Link
      href={href}
      className={[
        "text-[13px] transition-colors",
        isLightFooter ? "text-cm-ink-muted hover:text-cm-ink" : "text-cm-muted hover:text-cm-sub",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
