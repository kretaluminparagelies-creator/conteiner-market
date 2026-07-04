/**
 * @file page.tsx
 * @description Sell containers service page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { ServicePageClient } from "@/components/pages/ServicePageClient";
import { fetchPublicListings } from "@/lib/data/listings-server";
import { el } from "@/lib/i18n/messages/el";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: el.pages.polisi.metaTitle,
  description: el.pages.polisi.metaDescription,
  path: "/polisi",
  keywords: ["πώληση κοντέινερ", "πουλάω container", "αξία κοντέινερ"],
});

export default async function PolisiPage() {
  const homeListings = await fetchPublicListings();

  return (
    <PageShell tone="light" homeListings={homeListings}>
      <ServicePageClient page="polisi" />
    </PageShell>
  );
}
