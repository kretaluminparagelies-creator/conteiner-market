/**
 * @file page.tsx
 * @description Container listings catalog page
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { PageShell } from "@/components/layout/PageShell";
import { ListingCard } from "@/components/listings/ListingCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllListings } from "@/lib/data/listings";
import { createPageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/constants/site";

export const metadata = createPageMetadata({
  title: "Διαθέσιμα Κοντέινερ",
  description:
    "Κατάλογος shipping containers προς αγορά και ενοικίαση στην Ελλάδα. 20ft, 40ft, reefer, open top — Container Market.",
  path: "/listings",
  keywords: ["κατάλογος κοντέινερ", "διαθέσιμα containers", "τιμές κοντέινερ"],
});

export default function ListingsPage() {
  const listings = getAllListings();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Διαθέσιμα κοντέινερ",
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

      <section className="bg-cm-surf px-[6%] py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-[10px] tracking-[0.25em] text-cm-accent uppercase">
            Κατάλογος
          </p>
          <h1 className="font-display text-4xl font-bold md:text-5xl">Διαθέσιμα κοντέινερ</h1>
          <p className="mt-4 max-w-2xl text-cm-sub">
            Όλα τα διαθέσιμα shipping containers της Container Market — αγορά και ενοικίαση.
          </p>

          <div className="mt-12 grid gap-0.5 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
