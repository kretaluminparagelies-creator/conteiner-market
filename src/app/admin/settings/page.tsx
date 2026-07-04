/**
 * @file page.tsx
 * @description CRM settings — Supabase connection status
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmShell } from "@/components/crm/CrmShell";
import {
  crmServiceRoleNotice,
  getCrmConnectionStatus,
  getCrmLeadsSourceLabel,
  getCrmListingsSourceLabel,
  isCrmWriteEnabled,
} from "@/lib/crm/connection";

export default function AdminSettingsPage() {
  const status = getCrmConnectionStatus();
  const writeEnabled = isCrmWriteEnabled();

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
              <dt className="text-cm-sub">CRM εγγραφές</dt>
              <dd className="font-mono text-xs">
                {writeEnabled ? (
                  <span className="text-emerald-400">Ενεργές</span>
                ) : (
                  <span className="text-amber-300">Απαιτείται service role</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-cm-border/50 pb-3">
              <dt className="text-cm-sub">Listings source</dt>
              <dd className="font-mono text-xs text-cm-text">{getCrmListingsSourceLabel()}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-cm-sub">Leads source</dt>
              <dd className="font-mono text-xs text-cm-text">{getCrmLeadsSourceLabel()}</dd>
            </div>
          </dl>
        </section>

        {status === "connected" && !writeEnabled ? (
          <section className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-6 text-sm text-amber-100/90">
            {crmServiceRoleNotice}
          </section>
        ) : null}

        <section className="rounded-xl border border-cm-border bg-cm-card/50 p-6">
          <h2 className="font-display text-base font-semibold">Vercel env vars</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-cm-sub">
            <li>
              <code className="text-cm-text">NEXT_PUBLIC_SUPABASE_URL</code> — public reads
            </li>
            <li>
              <code className="text-cm-text">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> — public reads
            </li>
            <li>
              <code className="text-cm-text">SUPABASE_SERVICE_ROLE_KEY</code> — CRM writes (server
              only)
            </li>
            <li>
              <code className="text-cm-text">NEXT_PUBLIC_SITE_URL</code> —{" "}
              https://conteiner-market.vercel.app
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-dashed border-cm-border p-6 text-sm text-cm-muted">
          Auth (login) θα προστεθεί πριν το production admin — τώρα preview τοπικά / στο Vercel.
        </section>
      </div>
    </CrmShell>
  );
}
