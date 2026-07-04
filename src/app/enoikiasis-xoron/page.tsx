/**
 * @file page.tsx
 * @description Storage space rental in containers
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { ServicePageClient } from "@/components/pages/ServicePageClient";
import { el } from "@/lib/i18n/messages/el";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: el.pages.enoikiasisXoron.metaTitle,
  description: el.pages.enoikiasisXoron.metaDescription,
  path: "/enoikiasis-xoron",
  keywords: ["ενοικίαση χώρου", "αποθήκευση container", "storage χώρος", "αποθήκη κοντέινερ"],
});

export default function EnoikiasisXoronPage() {
  return (
    <PageShell>
      <ServicePageClient page="enoikiasisXoron" />
    </PageShell>
  );
}
