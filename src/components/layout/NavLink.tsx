/**
 * @file NavLink.tsx
 * @description Main nav link — category accent when active
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { CSSProperties, MouseEvent } from "react";
import { splineMenuOffersHref } from "@/lib/constants/spline-menu";
import { getNavLinkTheme } from "@/lib/constants/nav-link-themes";
import { navigateSplineRoute } from "@/lib/spline/navigate-spline-route";

type NavLinkProps = {
  href: string;
  label: string;
};

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isOffersLink = href === splineMenuOffersHref;
  const isActive = pathname === href;
  const theme = getNavLinkTheme(href);

  const activeStyle = isActive
    ? ({
        "--nav-link-accent": theme.accent,
        "--nav-link-glow": theme.glow,
        color: theme.accent,
      } as CSSProperties)
    : undefined;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isOffersLink) return;

    event.preventDefault();
    navigateSplineRoute(href, pathname, router.push);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
      style={activeStyle}
      className={[
        "nav-link relative pb-1 font-display text-sm tracking-[0.04em]",
        "transition-colors duration-200",
        isActive ? "nav-link-active" : "text-cm-sub hover:text-cm-text",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
