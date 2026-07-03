/**
 * @file page.tsx
 * @description Sell containers service page
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { ServicePageContent } from "@/components/pages/ServicePageContent";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Πώληση Κοντέινερ",
  description:
    "Πουλήστε το shipping container σας στην Ελλάδα. Container Market — άμεση αξιολόγηση, ανταγωνιστική προσφορά, πανελλαδική κάλυψη.",
  path: "/polisi",
  keywords: ["πώληση κοντέινερ", "πουλάω container", "αξία κοντέινερ"],
});

export default function PolisiPage() {
  return (
    <PageShell>
      <ServicePageContent
        eyebrow="Πώληση"
        title="Πώληση κοντέινερ"
        description="Θέλετε να πουλήσετε container; Στείλτε μας τα στοιχεία και θα σας κάνουμε προσφορά."
        body="Η Container Market αγοράζει shipping containers όλων των τύπων — dry van, reefer, open top, high cube. Αξιολογούμε την κατάσταση, προτείνουμε δίκαιη τιμή και αναλαμβάνουμε τη διαδικασία με απλότητα και διαφάνεια."
        ctaLabel="Επικοινωνία για πώληση →"
        ctaHref="/epikoinonia"
      />
    </PageShell>
  );
}
