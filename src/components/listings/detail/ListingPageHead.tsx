/**
 * @file ListingPageHead.tsx
 * @description Client-side title/description for listing detail pages (EN toggle)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useEffect } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import { createListingPageMetadata, createListingPageMetadataEn } from "@/lib/seo/listing-schema";
import { site } from "@/lib/constants/site";
import type { Listing } from "@/lib/types/listing";

type ListingPageHeadProps = {
  listing: Listing;
};

export function ListingPageHead({ listing }: ListingPageHeadProps) {
  const { locale } = useLocale();

  useEffect(() => {
    const meta =
      locale === "en" ? createListingPageMetadataEn(listing) : createListingPageMetadata(listing);

    document.title = `${meta.title} | ${site.name}`;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute("content", meta.description);
  }, [listing, locale]);

  return null;
}
