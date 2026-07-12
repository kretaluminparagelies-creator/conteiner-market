/**
 * @file DepotShell.tsx
 * @description Mobile-first shell for depot field app
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { Home, Loader2, PackageOpen, Plus, Send } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/depot", label: "Αρχική", icon: Home },
  { href: "/depot/intake", label: "Νέο", icon: Plus },
  { href: "/depot/dispatch", label: "Προσφορά", icon: Send },
  { href: "/depot/out", label: "Έξω", icon: PackageOpen },
] as const;

const pageMeta: Record<string, { title: string; subtitle?: string }> = {
  "/depot": { title: "Αποθήκη", subtitle: "Καταχώρηση & αποστολές" },
  "/depot/intake": { title: "Νέο κοντέινερ", subtitle: "Φωτογραφία και στοιχεία" },
  "/depot/dispatch": {
    title: "Στείλε προσφορά",
    subtitle: "Διάλεξε κοντέινερ — ίδια λίστα με «Τι έχω μέσα»",
  },
  "/depot/out": { title: "Τι είναι έξω", subtitle: "Μη διαθέσιμα στο depo" },
  "/depot/representatives": { title: "Αντιπρόσωποι", subtitle: "Διαχείριση από CRM" },
};

type DepotShellProps = {
  children: ReactNode;
};

export function DepotShell({ children }: DepotShellProps) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const headerPath = pendingHref ?? pathname;
  const meta = pageMeta[headerPath] ?? { title: "Αποθήκη" };
  const isNavigating = pendingHref !== null && pendingHref !== pathname;

  useEffect(() => {
    setPendingHref(null);
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverscroll = html.style.overscrollBehavior;
    const prevBodyOverscroll = body.style.overscrollBehavior;
    const prevBodyPosition = body.style.position;
    const prevBodyWidth = body.style.width;
    const prevBodyTop = body.style.top;
    const scrollY = window.scrollY;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.top = `-${scrollY}px`;

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.overscrollBehavior = prevHtmlOverscroll;
      body.style.overscrollBehavior = prevBodyOverscroll;
      body.style.position = prevBodyPosition;
      body.style.width = prevBodyWidth;
      body.style.top = prevBodyTop;
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div className="depot-app fixed inset-0 flex h-dvh max-h-dvh w-full max-w-[100vw] overflow-hidden overscroll-none bg-cm-light-bg text-cm-ink touch-manipulation">
      <aside className="flex w-[4.75rem] shrink-0 flex-col border-r border-cm-light-border-strong bg-white pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] sm:w-48">
        <div className="border-b border-cm-light-border-strong px-2 py-3 sm:px-4 sm:py-4">
          <p className="text-center font-mono text-[9px] font-bold tracking-[0.12em] text-cm-accent uppercase sm:text-left sm:text-[10px]">
            Depot
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-1.5 sm:p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/depot" ? pathname === item.href : pathname.startsWith(item.href);
            const pending = pendingHref === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={() => setPendingHref(item.href)}
                aria-busy={pending}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-1.5 py-2.5 text-center transition-colors sm:flex-row sm:gap-3 sm:px-3 sm:text-left",
                  active
                    ? "bg-cm-accent/12 text-cm-accent"
                    : "text-cm-ink-sub hover:bg-cm-light-bg hover:text-cm-ink",
                  pending && "opacity-70",
                )}
              >
                {pending ? (
                  <Loader2 className="size-5 shrink-0 animate-spin sm:size-4" aria-hidden="true" />
                ) : (
                  <Icon className="size-5 shrink-0 sm:size-4" aria-hidden="true" />
                )}
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
          <div className="flex min-w-0 items-center justify-between gap-2">
            <div className="min-w-0">
              <h1 className="truncate font-display text-base font-bold sm:text-lg">{meta.title}</h1>
              {meta.subtitle ? (
                <p className="truncate text-xs text-cm-ink-sub sm:text-sm">{meta.subtitle}</p>
              ) : null}
            </div>
          {isNavigating ? (
            <Loader2
              className="ml-2 size-4 shrink-0 animate-spin text-cm-accent"
              aria-label="Φόρτωση σελίδας"
            />
          ) : null}
          </div>
        </header>

        <main
          ref={mainRef}
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-scroll overscroll-none [-webkit-overflow-scrolling:touch] px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5"
        >
          <div className="mx-auto flex min-h-full w-full min-w-0 max-w-lg flex-col">{children}</div>
        </main>
      </div>
    </div>
  );
}
