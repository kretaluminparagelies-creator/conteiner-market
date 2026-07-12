/**
 * @file DepotShell.tsx
 * @description Mobile-first shell for depot field app
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { Home, PackageOpen, Plus, Send } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/depot", label: "Αρχική", icon: Home, exact: true },
  { href: "/depot/intake", label: "Νέο", icon: Plus },
  { href: "/depot/dispatch", label: "Προσφορά", icon: Send },
  { href: "/depot/out", label: "Έξω", icon: PackageOpen },
] as const;

type DepotShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export function DepotShell({ children, title, subtitle }: DepotShellProps) {
  const pathname = usePathname();

  return (
    <div className="depot-app flex h-dvh max-h-dvh w-full max-w-[100vw] overflow-hidden bg-cm-light-bg text-cm-ink">
      <aside className="flex w-[4.75rem] shrink-0 flex-col border-r border-cm-light-border-strong bg-white pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] sm:w-48">
        <div className="border-b border-cm-light-border-strong px-2 py-3 sm:px-4 sm:py-4">
          <p className="text-center font-mono text-[9px] font-bold tracking-[0.12em] text-cm-accent uppercase sm:text-left sm:text-[10px]">
            Depot
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-1.5 sm:p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-1.5 py-2.5 text-center transition-colors sm:flex-row sm:gap-3 sm:px-3 sm:text-left",
                  active
                    ? "bg-cm-accent/12 text-cm-accent"
                    : "text-cm-ink-sub hover:bg-cm-light-bg hover:text-cm-ink",
                )}
              >
                <Icon className="size-5 shrink-0 sm:size-4" aria-hidden="true" />
                <span className="max-w-full truncate font-display text-[10px] font-semibold leading-tight sm:text-sm">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-cm-light-border-strong p-1.5 sm:p-3">
          <Link
            href="/admin"
            className="flex flex-col items-center gap-1 rounded-xl border border-cm-light-border-strong px-1.5 py-2 text-center sm:flex-row sm:gap-2 sm:px-3 sm:text-left"
          >
            <span className="font-mono text-[9px] text-cm-ink-muted sm:text-[10px]">CRM</span>
          </Link>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 shrink-0 border-b border-cm-light-border-strong bg-white/95 px-3 py-3 shadow-cm-light-sm backdrop-blur-md pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-bold sm:text-lg">{title ?? "Αποθήκη"}</h1>
            {subtitle ? (
              <p className="truncate text-xs text-cm-ink-sub sm:text-sm">{subtitle}</p>
            ) : null}
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5">
          <div className="mx-auto w-full min-w-0 max-w-lg">{children}</div>
        </main>
      </div>
    </div>
  );
}
