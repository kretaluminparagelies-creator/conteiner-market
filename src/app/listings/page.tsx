/**
 * @file page.tsx
 * @description Container listings catalog page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { ListingsCatalogPage } from "@/components/listings/ListingsCatalogPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchPublicListings } from "@/lib/data/listings-server";
import { filterListings, hasActiveFilters, parseListingFilters } from "@/lib/utils/listing-filters";
import { resolveInitialCarouselTab } from "@/lib/utils/listing-carousel-filters";
import { el } from "@/lib/i18n/messages/el";
import { createPageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/constants/site";

type ListingsSearchParams = {
  deal?: string | string[];
  size?: string | string[];
  tab?: string | string[];
};

export const metadata = createPageMetadata({
  title: el.pages.listings.metaTitle,
  description: el.pages.listings.metaDescription,
  path: "/listings",
  keywords: ["κατάλογος κοντέινερ", "διαθέσιμα containers", "τιμές κοντέινερ"],
});

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<ListingsSearchParams>;
}) {
  const rawParams = await searchParams;
  const filters = parseListingFilters(rawParams);
  const isFiltered = hasActiveFilters(filters);
  const initialTab = resolveInitialCarouselTab(rawParams);
  const allListings = await fetchPublicListings();
  const listings = filterListings(allListings, filters);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: el.pages.listings.schemaName,
    url: `${site.url}/listings`,
    numberOfItems: listings.length,
    itemListElement: listings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: listing.type,
        description: listing.description,
        url: `${site.url}/listings/${listing.slug}`,
        offers: {
          "@type": "Offer",
          price: listing.price,
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `${site.url}/listings/${listing.slug}`,
        },
      },
    })),
  };

  return (
    <PageShell>
      <JsonLd data={itemListSchema} />
      <ListingsCatalogPage listings={listings} isFiltered={isFiltered} initialTab={initialTab} />
    </PageShell>
  );
}
