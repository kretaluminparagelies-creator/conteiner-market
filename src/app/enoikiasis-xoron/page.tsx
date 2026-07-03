/**
 * @file page.tsx
 * @description Storage space rental in containers
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { ServicePageContent } from "@/components/pages/ServicePageContent";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Ενοικίαση Χώρου Αποθήκευσης",
  description:
    "Ενοικίαση χώρου αποθήκευσης σε shipping containers — ευέλικτοι όροι, ασφαλής φύλαξη. Container Market GR.",
  path: "/enoikiasis-xoron",
  keywords: [
    "ενοικίαση χώρου",
    "αποθήκευση container",
    "storage χώρος",
    "αποθήκη κοντέινερ",
  ],
});

export default function EnoikiasisXoronPage() {
  return (
    <PageShell>
      <ServicePageContent
        eyebrow="Ενοικίαση χώρου"
        title="Χώρος αποθήκευσης σε κοντέινερ"
        description="Ενοικιάστε χώρο μέσα σε container ή σε οργανωμένη αποθήκευση — ιδανικό για εμπόρευμα, εξοπλισμό, εποχιακές ανάγκες."
        body="Προσφέρουμε ευέλικτες λύσεις ενοικίασης χώρου αποθήκευσης με shipping containers ως αποθηκευτικές μονάδες. Μηνιαίοι ή μακροχρόνιοι όροι, πρόσβαση κατόπιν συνεννόησης και τοποθεσίες σε στρατηγικά σημεία στην Ελλάδα. Επικοινωνήστε μαζί μας για διαθεσιμότητα, όγκο και τιμή."
        ctaLabel="Ζήτησε προσφορά →"
        ctaHref="/epikoinonia"
      />
    </PageShell>
  );
}
