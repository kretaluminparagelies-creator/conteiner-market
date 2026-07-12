/**
 * @file BrandHomeLink.tsx
 * @description Logo link — navigates to home or scrolls to top when already there
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

type BrandHomeLinkProps = {
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  onNavigate?: () => void;
};

export function BrandHomeLink({
  className,
  children,
  "aria-label": ariaLabel,
  onNavigate,
}: BrandHomeLinkProps) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();

    if (pathname !== "/") return;

    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Link href="/" aria-label={ariaLabel} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
