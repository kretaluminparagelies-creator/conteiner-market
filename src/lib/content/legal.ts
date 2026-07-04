/**
 * @file legal.ts
 * @description Locale-aware legal content registry
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { LegalSection } from "@/lib/content/legal-el";
import * as legalEl from "@/lib/content/legal-el";
import * as legalEn from "@/lib/content/legal-en";
import type { Locale } from "@/lib/i18n/types";

export type LegalDocumentKind = "terms" | "privacy" | "cookies" | "returns";

type LegalBundle = {
  termsSections: LegalSection[];
  privacySections: LegalSection[];
  cookiesSections: LegalSection[];
  returnsSections: LegalSection[];
  legalMeta: {
    companyName: string;
    siteName: string;
    contactEmail: string;
    lastUpdated: string;
  };
};

const bundles: Record<Locale, LegalBundle> = {
  el: legalEl,
  en: legalEn,
};

export function getLegalBundle(locale: Locale): LegalBundle {
  return bundles[locale];
}

export function getLegalSections(locale: Locale, kind: LegalDocumentKind): LegalSection[] {
  const bundle = getLegalBundle(locale);
  if (kind === "terms") return bundle.termsSections;
  if (kind === "privacy") return bundle.privacySections;
  if (kind === "returns") return bundle.returnsSections;
  return bundle.cookiesSections;
}
