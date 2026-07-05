/**
 * @file page.tsx
 * @description Terms of use page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { LegalPageContent } from "@/components/pages/LegalPageContent";
import { el } from "@/lib/i18n/messages/el";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: el.pages.legal.terms.metaTitle,
  description: el.pages.legal.terms.metaDescription,
  path: "/oroi",
});

export default function OroiPage() {
  return (
    <PageShell tone="light" hideFooter>
      <LegalPageContent kind="terms" />
    </PageShell>
  );
}
