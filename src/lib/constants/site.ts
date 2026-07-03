/**
 * @file site.ts
 * @description Global site configuration and SEO defaults
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

export const site = {
  name: "Container Market",
  nameFull: "Container Market GR",
  tagline: "Αγορά, Πώληση & Ενοικίαση Κοντέινερ στην Ελλάδα",
  description:
    "Container Market — η εταιρεία σας για αγορά, πώληση και ενοικίαση shipping containers στην Ελλάδα. Άμεση επαφή, ανταγωνιστικές τιμές, παράδοση σε όλη τη χώρα.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: "Logiworkpass P.C.",
  locale: "el_GR",
  language: "el",
  copyrightYear: 2026,
} as const;

export const seoKeywords = [
  "κοντέινερ",
  "shipping container",
  "αγορά κοντέινερ",
  "πώληση κοντέινερ",
  "ενοικίαση κοντέινερ",
  "κοντέινερ ελλάδα",
  "20ft container",
  "40ft container",
  "container market",
] as const;
