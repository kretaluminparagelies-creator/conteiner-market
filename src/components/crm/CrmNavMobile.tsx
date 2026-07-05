/**
 * @file CrmNavMobile.tsx
 * @description CRM top nav for small screens
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { crmNavItems } from "@/lib/crm/navigation";

function isActive(href: string, pathname: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export function CrmNavMobile() {
  const pathname = usePathname();

  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
      {crmNavItems.map((item) => {
        const active = isActive(item.href, pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "shrink-0 rounded-md border px-3 py-1.5 font-display text-xs transition-colors",
              active
                ? "border-cm-accent/50 bg-cm-accent/15 text-cm-accent"
                : "border-cm-border text-cm-ink-sub hover:border-cm-accent/30 hover:bg-cm-light-bg hover:text-cm-ink",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
