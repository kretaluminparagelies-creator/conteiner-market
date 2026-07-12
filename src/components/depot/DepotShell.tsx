/**
 * @file DepotShell.tsx
 * @description Mobile-first shell for depot field app
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { Home, Loader2, LogOut, PackageOpen, Plus, Send } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { logoutAction } from "@/lib/crm/actions/auth-actions";
import { appVersionLabel } from "@/lib/constants/version";
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
  "/depot/offers": { title: "Ιστορικό προσφορών", subtitle: "Ποιος έλαβε τι — ανά κοντέινερ" },
  "/depot/representatives": { title: "Αντιπρόσωποι", subtitle: "Διαχείριση από CRM" },
};

type DepotShellProps = {
  children: ReactNode;
};

function DepotLogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => logoutAction("/depot"))}
      className="inline-flex items-center gap-1 rounded-lg border border-cm-light-border-strong px-2.5 py-1 font-mono text-[10px] text-cm-ink-muted transition-colors hover:border-red-200 hover:text-red-700 disabled:opacity-50"
    >
      <LogOut className="size-3 shrink-0" aria-hidden="true" />
      {pending ? "…" : "Αποσύνδεση"}
    </button>
  );
}

export function DepotShell({ children }: DepotShellProps) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const headerPath = pendingHref ?? pathname;
  const meta = pageMeta[headerPath] ?? { title: "Αποθήκη" };
  const isNavigating = pendingHref !== null && pathname !== pendingHref;

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverscroll = html.style.overscrollBehavior;
    const prevBodyOverscroll = body.style.overscrollBehavior;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.overscrollBehavior = prevHtmlOverscroll;
      body.style.overscrollBehavior = prevBodyOverscroll;
    };
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches("input:not([type=hidden]), select, textarea")) return;

      requestAnimationFrame(() => {
        target.scrollIntoView({ block: "center", inline: "nearest" });
      });
    };

    main.addEventListener("focusin", onFocusIn);
    return () => main.removeEventListener("focusin", onFocusIn);
  }, []);

  return (
    <div className="depot-app fixed inset-0 flex h-dvh max-h-dvh w-full max-w-[100vw] flex-col overflow-hidden overscroll-none bg-cm-light-bg text-cm-ink touch-manipulation [&_input:not([type=hidden])]:text-base [&_select]:text-base [&_textarea]:text-base">
      <div className="shrink-0 border-b border-cm-light-border-strong bg-white shadow-cm-light-sm pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <p className="font-mono text-[10px] font-bold tracking-[0.14em] text-cm-accent uppercase">
              Depot
            </p>
            <span className="font-mono text-[10px] text-cm-ink-muted">{appVersionLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DepotLogoutButton />
            <Link
              href="/admin"
              className="rounded-lg border border-cm-light-border-strong px-2.5 py-1 font-mono text-[10px] text-cm-ink-muted transition-colors hover:text-cm-ink"
            >
              CRM
            </Link>
          </div>
        </div>

        <nav className="grid grid-cols-4 border-t border-cm-light-border-strong">
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
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-1 py-2.5 text-center transition-colors",
                  active
                    ? "border-b-2 border-cm-accent bg-cm-accent/8 text-cm-accent"
                    : "border-b-2 border-transparent text-cm-ink-sub hover:bg-cm-light-bg hover:text-cm-ink",
                  pending && "opacity-70",
                )}
              >
                {pending ? (
                  <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden="true" />
                ) : (
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                )}
                <span className="max-w-full truncate font-display text-[10px] font-semibold leading-tight sm:text-xs">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <header className="border-t border-cm-light-border-strong px-3 py-2.5">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <div className="min-w-0">
              <h1 className="truncate font-display text-base font-bold">{meta.title}</h1>
              {meta.subtitle ? (
                <p className="truncate text-xs text-cm-ink-sub">{meta.subtitle}</p>
              ) : null}
            </div>
            {isNavigating ? (
              <Loader2
                className="size-4 shrink-0 animate-spin text-cm-accent"
                aria-label="Φόρτωση σελίδας"
              />
            ) : null}
          </div>
        </header>
      </div>

      <main
        ref={mainRef}
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-scroll overscroll-none [-webkit-overflow-scrolling:touch] px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5"
      >
        <div className="mx-auto flex min-h-full w-full min-w-0 max-w-lg flex-col">{children}</div>
      </main>
    </div>
  );
}
