/**
 * @file page.tsx
 * @description Cookie policy page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { LegalPageContent } from "@/components/pages/LegalPageContent";
import { el } from "@/lib/i18n/messages/el";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: el.pages.legal.cookies.metaTitle,
  description: el.pages.legal.cookies.metaDescription,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <PageShell tone="light" hideFooter>
      <LegalPageContent kind="cookies" />
    </PageShell>
  );
}
