/**
 * @file site.ts
 * @description Global site configuration and SEO defaults
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { company, formatCompanyAddressEl, formatCompanyAddressEn } from "@/lib/constants/company";

export const site = {
  name: "Container Market",
  nameFull: "Container Market GR",
  tagline: "Αγορά & Ενοικίαση Κοντέινερ — απευθείας από εμάς",
  description:
    "Container Market GR — πουλάμε και ενοικιάζουμε δικά μας shipping containers στην Ελλάδα. Άμεση επαφή, χωρίς ενδιάμεσους, παράδοση σε όλη τη χώρα.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: company.legalNameLatin,
  /** Shared with LogiWork — Resend verified @logiworkpass.com */
  contactEmail: company.contactEmail,
  contactPhone: company.phoneDisplay,
  locale: "el_GR",
  language: "el",
  copyrightYear: 2026,
  headquarters: {
    el: formatCompanyAddressEl(),
    en: formatCompanyAddressEn(),
  },
} as const;

export const seoKeywords = [
  "κοντέινερ",
  "shipping container",
  "αγορά κοντέινερ",
  "πώληση κοντέινερ",
  "ενοικίαση κοντέινερ",
  "κοντέινερ ελλάδα",
  "κοντέινερ αθήνα",
  "κοντέινερ θεσσαλονίκη",
  "20ft container",
  "40ft container",
  "container market",
  "buy shipping container greece",
  "rent container greece",
  "used shipping container",
  "cargo worthy container",
  "container storage greece",
  "μεταχειρισμένο κοντέινερ",
  "νέο κοντέινερ",
  "container buyback greece",
  "Logiworkpass",
  "LOGIWORKPASS",
] as const;
