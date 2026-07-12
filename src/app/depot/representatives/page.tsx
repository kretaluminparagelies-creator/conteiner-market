/**
 * @file page.tsx
 * @description Representatives managed in CRM — redirect from depot
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Link from "next/link";

export default function DepotRepresentativesPage() {
  return (
    <div className="space-y-4 rounded-2xl border border-cm-light-border-strong bg-white px-4 py-6 text-sm text-cm-ink-sub">
      <p>
        Η πλήρης καρτέλα αντιπροσώπων (τηλέφωνο, σημειώσεις, ιστορικό) γίνεται στο CRM.
      </p>
      <p>Στο κινητό depot χρησιμοποιείς μόνο την αποστολή φωτογραφίας.</p>
      <Link href="/admin/representatives" className="inline-block font-semibold text-cm-accent">
        Άνοιγμα CRM αντιπροσώπων →
      </Link>
    </div>
  );
}
