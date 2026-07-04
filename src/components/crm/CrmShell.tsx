/**
 * @file CrmShell.tsx
 * @description CRM admin layout shell with sidebar
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmNav } from "@/components/crm/CrmNav";
import { CrmStatusBanner } from "@/components/crm/CrmStatusBanner";
import { Providers } from "@/components/layout/Providers";
import type { ReactNode } from "react";

type CrmShellProps = {
  children: ReactNode;
  title: string;
  description?: string;
};

export function CrmShell({ children, title, description }: CrmShellProps) {
  return (
    <Providers>
      <div className="flex min-h-screen bg-cm-bg text-cm-text">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-cm-border bg-cm-card/95 backdrop-blur-sm lg:block">
          <CrmNav />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col lg:pl-60">
          <CrmStatusBanner />

          <header className="border-b border-cm-border px-6 py-5 lg:px-8">
            <div className="lg:hidden">
              <CrmNavMobile />
            </div>
            <h1 className="font-display text-2xl font-bold">{title}</h1>
            {description ? <p className="mt-1 text-sm text-cm-sub">{description}</p> : null}
          </header>

          <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </Providers>
  );
}

function CrmNavMobile() {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
      {[
        { href: "/admin", label: "Πίνακας" },
        { href: "/admin/listings", label: "Καταχωρίσεις" },
        { href: "/admin/leads", label: "Αιτήματα" },
        { href: "/admin/settings", label: "Ρυθμίσεις" },
      ].map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="shrink-0 rounded-md border border-cm-border px-3 py-1.5 font-display text-xs text-cm-sub"
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
