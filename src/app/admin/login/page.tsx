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
    <div className="flex min-h-screen items-center justify-center bg-cm-bg px-6 py-12">
      <div className="w-full max-w-md rounded-xl border border-cm-border bg-cm-card/60 p-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold">
            <span className="text-cm-accent">CRM</span> Container Market
          </h1>
          <p className="mt-2 text-sm text-cm-sub">Σύνδεση διαχειριστή</p>
        </div>
        <CrmLoginForm nextPath={next ?? "/admin"} />
      </div>
    </div>
  );
}
