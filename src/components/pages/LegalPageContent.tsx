/**
 * @file LegalPageContent.tsx
 * @description Locale-aware legal document page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { InfoPhotoLayout } from "@/components/pages/InfoPhotoLayout";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { getLegalBundle, getLegalSections, type LegalDocumentKind } from "@/lib/content/legal";
import { useLocale } from "@/lib/i18n/locale-context";

type LegalPageContentProps = {
  kind: LegalDocumentKind;
};

export function LegalPageContent({ kind }: LegalPageContentProps) {
  const { locale, t } = useLocale();
  const labels = t.pages.legal[kind];
  const sections = getLegalSections(locale, kind);
  const meta = getLegalBundle(locale).legalMeta;

  return (
    <InfoPhotoLayout backLabel={t.pages.contact.backToHome}>
      <LegalDocument
        siteName={meta.siteName}
        title={labels.title}
        intro={labels.intro}
        sections={sections}
        lastUpdated={meta.lastUpdated}
        lastUpdatedLabel={t.common.lastUpdated}
        companyName={meta.companyName}
      />
    </InfoPhotoLayout>
  );
}
