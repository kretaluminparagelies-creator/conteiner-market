/**
 * @file page.tsx
 * @description CRM settings — backend, account, password
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmPasswordForm } from "@/components/crm/CrmPasswordForm";
import { CrmShell } from "@/components/crm/CrmShell";
import {
  getCrmConnectionStatus,
  getCrmLeadsSourceLabel,
  getCrmListingsSourceLabel,
  isCrmWriteEnabled,
} from "@/lib/crm/connection";
import { isCrmAuthEnabled } from "@/lib/crm/auth";
import { getCrmSessionEmail } from "@/lib/supabase/server-auth";

export default async function AdminSettingsPage() {
  const status = getCrmConnectionStatus();
  const writeEnabled = isCrmWriteEnabled();
  const authEnabled = isCrmAuthEnabled();
  const adminEmail = await getCrmSessionEmail();

  return (
    <CrmShell title="Ρυθμίσεις" description="Σύνδεση backend, λογαριασμός και ασφάλεια.">
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

        {authEnabled ? (
          <section className="rounded-xl border border-cm-border bg-cm-card/50 p-6">
            <h2 className="font-display text-base font-semibold">Λογαριασμός</h2>
            <p className="mt-2 text-sm text-cm-sub">
              Συνδεδεμένος ως <span className="font-mono text-cm-text">{adminEmail ?? "—"}</span>
            </p>
            <div className="mt-6">
              <h3 className="font-display text-sm font-semibold">Αλλαγή κωδικού</h3>
              <div className="mt-4">
                <CrmPasswordForm />
              </div>
            </div>
          </section>
        ) : null}

        {authEnabled ? (
          <section className="rounded-xl border border-dashed border-cm-border p-6 text-sm text-cm-sub">
            <h2 className="font-display text-base font-semibold text-cm-text">Νέος διαχειριστής</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">
              <li>Supabase → Authentication → Users → Add user</li>
              <li>Email + κωδικός (min 8 χαρακτήρες)</li>
              <li>
                <strong>Auto Confirm User: ON</strong> (αλλιώς δεν μπαίνεις)
              </li>
              <li>
                Supabase → Authentication → URL Configuration → Site URL:{" "}
                <code className="text-cm-text">https://conteiner-market.vercel.app</code>
              </li>
              <li>
                Redirect URLs:{" "}
                <code className="text-cm-text">https://conteiner-market.vercel.app/**</code>
              </li>
              <li>
                Σύνδεση στο <code className="text-cm-text">/admin/login</code>
              </li>
            </ol>
          </section>
        ) : null}

        <section className="rounded-xl border border-cm-border bg-cm-card/50 p-6">
          <h2 className="font-display text-base font-semibold">Φωτογραφίες listings</h2>
          <p className="mt-3 text-sm leading-relaxed text-cm-sub">
            Ανέβασμα από τη φόρμα (CRM → Καταχωρίσεις → Νέα/Επεξεργασία). Οι φωτογραφίες
            συμπιέζονται αυτόματα (WebP, max 1400px) και αποθηκεύονται στο Supabase Storage bucket{" "}
            <code className="text-cm-text">listing-images</code>. Τρέξε migration{" "}
            <code className="text-cm-text">20260704040000_storage_listing_images.sql</code> αν δεν
            το έχεις κάνει.
          </p>
        </section>
      </div>
    </CrmShell>
  );
}
