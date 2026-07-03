/**
 * @file page.tsx
 * @description Rent containers service page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { ServicePageClient } from "@/components/pages/ServicePageClient";
import { el } from "@/lib/i18n/messages/el";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: el.pages.enoikiasi.metaTitle,
  description: el.pages.enoikiasi.metaDescription,
  path: "/enoikiasi",
  keywords: ["ενοικίαση κοντέινερ", "container ενοικίαση", "κοντέινερ μηνιαία"],
});

export default function EnoikiasiPage() {
  return (
    <PageShell>
      <ServicePageClient page="enoikiasi" />
    </PageShell>
  );
}
