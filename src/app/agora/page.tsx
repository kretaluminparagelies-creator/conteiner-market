/**
 * @file page.tsx
 * @description Buy containers service page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { ServicePageClient } from "@/components/pages/ServicePageClient";
import { el } from "@/lib/i18n/messages/el";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: el.pages.agora.metaTitle,
  description: el.pages.agora.metaDescription,
  path: "/agora",
  keywords: ["αγορά κοντέινερ", "κοντέινερ τιμές", "shipping container αγορά"],
});

export default function AgoraPage() {
  return (
    <PageShell>
      <ServicePageClient page="agora" />
    </PageShell>
  );
}
