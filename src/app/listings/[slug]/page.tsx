/**
 * @file page.tsx
 * @description Individual container listing page — shareable URL for SEO & AI agents
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ListingDetailPageContent } from "@/components/listings/detail/ListingDetailPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchPublicListingBySlug, fetchPublicListings } from "@/lib/data/listings-server";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  createListingPageMetadata,
  createListingProductSchema,
} from "@/lib/seo/listing-schema";
import { site } from "@/lib/constants/site";

type ListingPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const listings = await fetchPublicListings();
  return listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = await fetchPublicListingBySlug(slug);
  if (!listing) return {};

  const meta = createListingPageMetadata(listing);
  return createPageMetadata(meta);
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = await fetchPublicListingBySlug(slug);

  if (!listing) notFound();

  const productSchema = createListingProductSchema(listing, site.url);

  return (
    <PageShell>
      <JsonLd data={productSchema} />
      <ListingDetailPageContent listing={listing} />
    </PageShell>
  );
}
