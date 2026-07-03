/**
 * @file page.tsx
 * @description CRM settings — future Supabase connection
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmShell } from "@/components/crm/CrmShell";
import { getCrmConnectionStatus } from "@/lib/crm/connection";

export default function AdminSettingsPage() {
  const status = getCrmConnectionStatus();

  return (
    <CrmShell title="Ρυθμίσεις" description="Σύνδεση backend και εταιρικά στοιχεία.">
      <div className="max-w-2xl space-y-6">
        <section className="rounded-xl border border-cm-border bg-cm-card/50 p-6">
          <h2 className="font-display text-base font-semibold">Backend</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-cm-border/50 pb-3">
              <dt className="text-cm-sub">Κατάσταση</dt>
              <dd className="font-mono text-xs uppercase">
                {status === "connected" ? (
                  <span className="text-emerald-400">Supabase</span>
                ) : (
                  <span className="text-amber-300">Preview (JSON + demo)</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-cm-border/50 pb-3">
              <dt className="text-cm-sub">Listings source</dt>
              <dd className="font-mono text-xs text-cm-text">listings.json</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-cm-sub">Leads source</dt>
              <dd className="font-mono text-xs text-cm-text">mock-leads.ts</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-cm-border bg-cm-card/50 p-6">
          <h2 className="font-display text-base font-semibold">Επόμενο βήμα (Supabase)</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-cm-sub">
            <li>Δημιουργία project στο Supabase (free tier)</li>
            <li>Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`</li>
            <li>Run migration από `supabase/migrations/`</li>
            <li>Swap repository — το CRM menu μένει ίδιο</li>
          </ol>
        </section>

        <section className="rounded-xl border border-dashed border-cm-border p-6 text-sm text-cm-muted">
          Auth (login) θα προστεθεί πριν το production admin — τώρα preview τοπικά.
        </section>
      </div>
    </CrmShell>
  );
}
