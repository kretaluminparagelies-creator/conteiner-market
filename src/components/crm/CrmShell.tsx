/**
 * @file CrmShell.tsx
 * @description CRM admin layout shell with sidebar
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmNav } from "@/components/crm/CrmNav";
import { CrmNavMobile } from "@/components/crm/CrmNavMobile";
import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { CrmStatusBanner } from "@/components/crm/CrmStatusBanner";
import { Providers } from "@/components/layout/Providers";
import type { ReactNode } from "react";

type CrmShellProps = {
  children: ReactNode;
  title: string;
  description?: string;
  adminEmail?: string | null;
};

export function CrmShell({ children, title, description, adminEmail = null }: CrmShellProps) {
  return (
    <Providers>
      <div className="flex min-h-screen bg-cm-bg text-cm-text">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-cm-border bg-cm-card/95 backdrop-blur-sm lg:block">
          <CrmNav adminEmail={adminEmail} />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col lg:pl-60">
          <CrmStatusBanner />

          <header className="border-b border-cm-border px-6 py-5 lg:px-8">
            <div className="lg:hidden">
              <CrmNavMobile />
            </div>
            <CrmPageHeader title={title} description={description} />
          </header>

          <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
