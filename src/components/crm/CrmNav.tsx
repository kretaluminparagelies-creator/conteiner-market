/**
 * @file CrmNav.tsx
 * @description CRM sidebar navigation
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { CrmLogoutButton } from "@/components/crm/CrmLogoutButton";
import { useCrmSession } from "@/components/crm/CrmSessionProvider";
import {
  ExternalLink,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { crmNavItems, crmSiteLink } from "@/lib/crm/navigation";
import type { CrmNavItem } from "@/lib/crm/types";

const iconMap = {
  dashboard: LayoutDashboard,
  listings: Package,
  leads: MessageSquare,
  settings: Settings,
} satisfies Record<CrmNavItem["icon"], typeof LayoutDashboard>;

function isActive(href: string, pathname: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export function CrmNav() {
  const pathname = usePathname();
  const { adminEmail } = useCrmSession();

  return (
    <nav className="flex h-full flex-col">
      <div className="border-b border-cm-border px-5 py-5">
        <Link href="/admin" className="font-display text-lg font-bold tracking-tight">
          <span className="text-cm-accent">CRM</span>
          <span className="ml-1 font-light text-cm-sub">Container Market</span>
        </Link>
        <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-cm-muted uppercase">
          Logiworkpass P.C.
        </p>
      </div>

      <ul className="flex-1 space-y-1 px-3 py-4">
        {crmNavItems.map((item) => {
          const Icon = iconMap[item.icon];
          const active = isActive(item.href, pathname);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 font-display text-sm transition-colors",
                  active
                    ? "bg-cm-accent/15 text-cm-accent"
                    : "text-cm-sub hover:bg-cm-surf/80 hover:text-cm-text",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="space-y-2 border-t border-cm-border p-4">
        {adminEmail ? (
          <p className="truncate px-3 font-mono text-[10px] text-cm-muted" title={adminEmail}>
            {adminEmail}
          </p>
        ) : null}
        {adminEmail ? <CrmLogoutButton /> : null}
        <Link
          href={crmSiteLink}
          className="flex items-center gap-2 font-mono text-[11px] text-cm-muted transition-colors hover:text-cm-accent"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          Πίσω στο site
        </Link>
      </div>
    </nav>
  );
}
