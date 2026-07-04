/**
 * @file page.tsx
 * @description Returns and withdrawal policy page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { LegalPageContent } from "@/components/pages/LegalPageContent";
import { el } from "@/lib/i18n/messages/el";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: el.pages.legal.returns.metaTitle,
  description: el.pages.legal.returns.metaDescription,
  path: "/epistrofes",
});

export default function EpistrofesPage() {
  return (
    <PageShell>
      <LegalPageContent kind="returns" />
    </PageShell>
  );
}
