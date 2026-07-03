/**
 * @file page.tsx
 * @description Used container offers — προσφορές μεταχειρισμένων κοντέινερ
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { ServicePageContent } from "@/components/pages/ServicePageContent";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Προσφορές Μεταχειρισμένων Κοντέινερ",
  description:
    "Προσφορές σε μεταχειρισμένα shipping containers — 20ft, 40ft, cargo worthy. Άμεση διαθεσιμότητα, Container Market GR.",
  path: "/prosfores",
  keywords: [
    "προσφορές κοντέινερ",
    "μεταχειρισμένα container",
    "used shipping container",
    "κοντέινερ τιμές",
  ],
});

export default function ProsforesPage() {
  return (
    <PageShell>
      <ServicePageContent
        eyebrow="Προσφορές"
        title="Μεταχειρισμένα κοντέινερ"
        description="Επιλεγμένα used containers σε ανταγωνιστικές τιμές — cargo worthy, έλεγχος ποιότητας, άμεση παράδοση."
        body="Η Container Market συγκεντρώνει διαθέσιμα μεταχειρισμένα shipping containers από λιμάνια και αποθήκες σε όλη την Ελλάδα. Dry 20ft & 40ft, High Cube και ειδικοί τύποι — με διαφανείς τιμές και χωρίς ενδιάμεσους. Ζητήστε προσφορά για τον τύπο, την τοποθεσία και την ποσότητα που χρειάζεστε."
        ctaLabel="Δες διαθέσιμα κοντέινερ →"
        ctaHref="/listings"
      />
    </PageShell>
  );
}
