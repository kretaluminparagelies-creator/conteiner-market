/**
 * @file page.tsx
 * @description Admin password reset (from Supabase email link)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmResetPasswordForm } from "@/components/crm/CrmResetPasswordForm";

export default function AdminResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cm-bg px-6 py-12">
      <div className="w-full max-w-md rounded-xl border border-cm-border bg-cm-card/60 p-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold">
            <span className="text-cm-accent">CRM</span> Νέος κωδικός
          </h1>
          <p className="mt-2 text-sm text-cm-sub">Ορισμός κωδικού από email reset</p>
        </div>
        <CrmResetPasswordForm />
      </div>
    </div>
  );
}
