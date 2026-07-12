/**
 * @file page.tsx
 * @description Containers not at depot
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { DepotOutList } from "@/components/depot/DepotOutList";
import { DepotShell } from "@/components/depot/DepotShell";
import { loadDepotDashboardData } from "@/lib/depot/actions/depot-actions";

export default async function DepotOutPage() {
  const { containers } = await loadDepotDashboardData();

  return (
    <DepotShell title="Τι είναι έξω" subtitle="Μη διαθέσιμα στο depo">
      <DepotOutList containers={containers} />
    </DepotShell>
  );
}
