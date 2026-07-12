/**
 * @file page.tsx
 * @description Depot intake — new container
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { DepotIntakeForm } from "@/components/depot/DepotIntakeForm";
import { DepotShell } from "@/components/depot/DepotShell";

export default function DepotIntakePage() {
  return (
    <DepotShell title="Νέο κοντέινερ" subtitle="Φωτογραφία και στοιχεία">
      <DepotIntakeForm />
    </DepotShell>
  );
}
