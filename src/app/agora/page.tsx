/**
 * @file page.tsx
 * @description Buy containers service page
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { ServicePageContent } from "@/components/pages/ServicePageContent";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Αγορά Κοντέινερ",
  description:
    "Αγορά shipping containers στην Ελλάδα — καινούρια και μεταχειρισμένα 20ft, 40ft, High Cube. Container Market, άμεση παράδοση.",
  path: "/agora",
  keywords: ["αγορά κοντέινερ", "κοντέινερ τιμές", "shipping container αγορά"],
});

export default function AgoraPage() {
  return (
    <PageShell>
      <ServicePageContent
        eyebrow="Αγορά"
        title="Αγορά κοντέινερ"
        description="Νέα και μεταχειρισμένα containers για μόνιμη χρήση — αποθήκευση, logistics, μετατροπές."
        body="Η Container Market προσφέρει shipping containers cargo worthy σε ανταγωνιστικές τιμές. Διαθέσιμα 20ft, 40ft, High Cube και ειδικοί τύποι σε λιμάνια και αποθήκες σε όλη την Ελλάδα. Επικοινωνήστε μαζί μας για διαθεσιμότητα, τιμή και παράδοση στον χώρο σας."
        ctaLabel="Δες διαθέσιμα κοντέινερ →"
        ctaHref="/listings"
      />
    </PageShell>
  );
}
