/**
 * @file metadata.ts
 * @description SEO metadata helpers for Container Market pages
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { Metadata } from "next";
import { seoKeywords, site } from "@/lib/constants/site";

type PageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path = "",
  keywords = [],
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${site.url}${path}`;
  const fullTitle = path === "" || path === "/" ? title : `${title} | ${site.name}`;

  return {
    title: fullTitle,
    description,
    keywords: [...seoKeywords, ...keywords],
    authors: [{ name: site.author }],
    creator: site.author,
    publisher: site.nameFull,
    metadataBase: new URL(site.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: site.locale,
      url,
      siteName: site.nameFull,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
