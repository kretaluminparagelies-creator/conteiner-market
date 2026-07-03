/**
 * @file page.tsx
 * @description Container listings catalog page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { ListingsCatalogPage } from "@/components/listings/ListingsCatalogPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllListings } from "@/lib/data/listings";
import {
  filterListings,
  hasActiveFilters,
  parseListingFilters,
} from "@/lib/utils/listing-filters";
import { createPageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/constants/site";

type ListingsSearchParams = {
  deal?: string | string[];
  size?: string | string[];
};

export const metadata = createPageMetadata({
  title: "Προσφορές Κοντέινερ",
  description:
    "Προσφορές σε μεταχειρισμένα shipping containers — 20ft, 40ft, cargo worthy. Άμεση διαθεσιμότητα, Container Market GR.",
  path: "/listings",
  keywords: ["κατάλογος κοντέινερ", "διαθέσιμα containers", "τιμές κοντέινερ"],
});

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<ListingsSearchParams>;
}) {
  const filters = parseListingFilters(await searchParams);
  const isFiltered = hasActiveFilters(filters);
  const listings = filterListings(getAllListings(), filters);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Προσφορές κοντέινερ",
    url: `${site.url}/listings`,
    numberOfItems: listings.length,
    itemListElement: listings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: listing.type,
        description: listing.description,
        offers: {
          "@type": "Offer",
          price: listing.price,
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <PageShell>
      <JsonLd data={itemListSchema} />
      <ListingsCatalogPage listings={listings} isFiltered={isFiltered} />
    </PageShell>
  );
}
