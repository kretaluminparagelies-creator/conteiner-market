/**
 * @file page.tsx
 * @description CRM admin login
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmLoginForm } from "@/components/crm/CrmLoginForm";
import { isCrmAuthEnabled } from "@/lib/crm/auth";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (!isCrmAuthEnabled()) {
    redirect("/admin");
  }

  const { next } = await searchParams;

  return (
    <div className="crm-light min-h-dvh bg-cm-bg px-6 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-md pt-10 sm:pt-16">
        <div className="rounded-xl border border-cm-border bg-cm-card p-8 shadow-cm-light-md">
          <div className="mb-8 text-center">
            <h1 className="font-display text-2xl font-bold">
              <span className="text-cm-accent">CRM</span> Container Market
            </h1>
            <p className="mt-2 text-sm text-cm-ink-sub">
              {next?.startsWith("/depot") ? "Σύνδεση — Depot" : "Σύνδεση διαχειριστή"}
            </p>
          </div>
          <CrmLoginForm nextPath={next ?? "/admin"} />
        </div>
      </div>
    </div>
  );
}
