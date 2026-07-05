/**
 * @file page.tsx
 * @description Privacy policy page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { LegalPageContent } from "@/components/pages/LegalPageContent";
import { el } from "@/lib/i18n/messages/el";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: el.pages.legal.privacy.metaTitle,
  description: el.pages.legal.privacy.metaDescription,
  path: "/aporrito",
});

export default function AporritoPage() {
  return (
    <PageShell tone="light" hideFooter>
      <LegalPageContent kind="privacy" />
    </PageShell>
  );
}
