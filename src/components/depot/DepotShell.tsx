/**
 * @file DepotShell.tsx
 * @description Mobile-first shell for depot field app
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const navItems: { href: string; label: string; exact?: boolean }[] = [
  { href: "/depot", label: "Αρχική", exact: true },
  { href: "/depot/intake", label: "Νέο" },
  { href: "/depot/dispatch", label: "Προσφορά" },
  { href: "/depot/out", label: "Έξω" },
];

type DepotShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export function DepotShell({ children, title, subtitle }: DepotShellProps) {
  const pathname = usePathname();

  return (
    <div className="depot-app min-h-dvh bg-cm-light-bg text-cm-ink">
      <header className="sticky top-0 z-20 border-b border-cm-light-border-strong bg-white/95 px-4 py-4 shadow-cm-light-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-cm-accent uppercase">
              Depot
            </p>
            <h1 className="truncate font-display text-lg font-bold">{title ?? "Αποθήκη"}</h1>
            {subtitle ? <p className="truncate text-sm text-cm-ink-sub">{subtitle}</p> : null}
          </div>
          <Link
            href="/admin"
            className="shrink-0 rounded-lg border border-cm-light-border-strong px-2.5 py-1.5 font-mono text-[10px] text-cm-ink-muted"
          >
            CRM
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-5 pb-28">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-cm-light-border-strong bg-white/96 px-2 py-2 shadow-cm-light-lg backdrop-blur-md">
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-1 py-2 text-center font-display text-[11px] font-semibold transition-colors",
                  active
                    ? "bg-cm-accent/12 text-cm-accent"
                    : "text-cm-ink-sub hover:bg-cm-light-bg hover:text-cm-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
