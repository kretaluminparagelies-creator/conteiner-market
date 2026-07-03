/**
 * @file NavLink.tsx
 * @description Single navigation link for the main menu
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  label: string;
};

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "text-sm transition-colors duration-200",
        isActive ? "text-cm-text" : "text-cm-sub hover:text-cm-text",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
