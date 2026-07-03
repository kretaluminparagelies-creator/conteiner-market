/**
 * @file listing-schema.ts
 * @description JSON-LD Product/Offer schema for individual listings
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { Listing } from "@/lib/types/listing";

export function createListingProductSchema(listing: Listing, siteUrl: string) {
  const url = `${siteUrl}/listings/${listing.slug}`;
  const isRent = listing.listingType === "rent";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.type,
    description: listing.description,
    sku: listing.id,
    url,
    category: isRent ? "Container rental" : "Container sale",
    brand: {
      "@type": "Brand",
      name: "Container Market GR",
    },
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url,
      itemCondition: listing.condition,
      ...(isRent ? { priceSpecification: { "@type": "UnitPriceSpecification", unitText: "MONTH" } } : {}),
    },
  };
}

export function createListingPageMetadata(listing: Listing) {
  const dealLabel = listing.listingType === "rent" ? "Ενοικίαση" : "Αγορά";
  const title = `${listing.type} — ${dealLabel} ${listing.priceFormatted}${listing.unit}`;
  const description = `${listing.description} · ${listing.location} · Container Market GR`;

  return {
    title,
    description,
    path: `/listings/${listing.slug}`,
    keywords: [listing.type, listing.location, dealLabel, "κοντέινερ"],
  };
}

export function createListingPageMetadataEn(listing: Listing) {
  const dealLabel = listing.listingType === "rent" ? "Rent" : "Buy";
  const condition = listing.conditionEn ?? listing.condition;
  const location = listing.locationEn ?? listing.location;
  const descriptionText = listing.descriptionEn ?? listing.description;
  const unit = listing.unitEn ?? listing.unit;
  const title = `${listing.type} — ${dealLabel} ${listing.priceFormatted}${unit}`;
  const description = `${descriptionText} · ${location} · ${condition} · Container Market GR`;

  return { title, description };
}
