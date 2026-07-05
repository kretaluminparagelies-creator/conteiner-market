/**
 * @file CrmStatusBanner.tsx
 * @description Preview / connected mode indicator
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { getCrmConnectionStatus, crmPreviewNotice } from "@/lib/crm/connection";

export function CrmStatusBanner() {
  const status = getCrmConnectionStatus();

  if (status === "connected") {
    return (
      <div className="border-b border-emerald-500/30 bg-emerald-500/10 px-6 py-2.5">
        <p className="font-mono text-[11px] tracking-wide text-emerald-800 uppercase">
          Supabase connected
        </p>
      </div>
    );
  }

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-6 py-2.5">
      <p className="text-sm text-amber-900">{crmPreviewNotice}</p>
    </div>
  );
}
