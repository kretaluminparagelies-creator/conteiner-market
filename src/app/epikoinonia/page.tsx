/**
 * @file page.tsx
 * @description Contact page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { ContactPageContent } from "@/components/pages/ContactPageContent";
import { fetchPublicListings } from "@/lib/data/listings-server";
import { el } from "@/lib/i18n/messages/el";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: el.pages.contact.metaTitle,
  description: el.pages.contact.metaDescription,
  path: "/epikoinonia",
  keywords: ["επικοινωνία container market", "τηλέφωνο κοντέινερ"],
});

export default async function EpikoinoniaPage() {
  const homeListings = await fetchPublicListings();

  return (
    <PageShell tone="light" homeListings={homeListings} hideFooter mobileScroll>
      <Suspense fallback={null}>
        <ContactPageContent />
      </Suspense>
    </PageShell>
  );
}
