/**
 * @file page.tsx
 * @description Contact page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { ContactPageContent } from "@/components/pages/ContactPageContent";
import { el } from "@/lib/i18n/messages/el";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: el.pages.contact.metaTitle,
  description: el.pages.contact.metaDescription,
  path: "/epikoinonia",
  keywords: ["επικοινωνία container market", "τηλέφωνο κοντέινερ"],
});

export default function EpikoinoniaPage() {
  return (
    <PageShell>
      <ContactPageContent />
    </PageShell>
  );
}
