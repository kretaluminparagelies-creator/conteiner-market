/**
 * @file page.tsx
 * @description Rent containers service page
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { ServicePageContent } from "@/components/pages/ServicePageContent";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Ενοικίαση Κοντέινερ",
  description:
    "Ενοικίαση shipping containers στην Ελλάδα — dry, reefer, open top. Ευέλικτοι όροι από 1 μήνα. Container Market.",
  path: "/enoikiasi",
  keywords: ["ενοικίαση κοντέινερ", "container ενοικίαση", "κοντέινερ μηνιαία"],
});

export default function EnoikiasiPage() {
  return (
    <PageShell>
      <ServicePageContent
        eyebrow="Ενοικίαση"
        title="Ενοικίαση κοντέινερ"
        description="Ευέλικτες λύσεις αποθήκευσης και logistics — από 1 μήνα, όλοι οι τύποι."
        body="Ενοικιάστε shipping containers για projects, εποχιακές ανάγκες ή μακροχρόνια αποθήκευση. Διαθέσιμα ψυγεία, open top και standard dry containers σε σημεία σε όλη την Ελλάδα. Ρωτήστε μας για διαθεσιμότητα και μηνιαία τιμή."
        ctaLabel="Δες containers προς ενοικίαση →"
        ctaHref="/listings"
      />
    </PageShell>
  );
}
