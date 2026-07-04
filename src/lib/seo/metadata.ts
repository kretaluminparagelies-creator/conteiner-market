/**
 * @file metadata.ts
 * @description SEO metadata helpers for Container Market pages
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
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

const defaultOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.nameFull} — shipping containers Greece`,
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
    applicationName: site.nameFull,
    category: "business",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: site.locale,
      alternateLocale: "en_US",
      url,
      siteName: site.nameFull,
      title: fullTitle,
      description,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [defaultOgImage.url],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
