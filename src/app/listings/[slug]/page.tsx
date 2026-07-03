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
import { getAllListings, getListingBySlug } from "@/lib/data/listings";
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
  return getAllListings().map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) return {};

  const meta = createListingPageMetadata(listing);
  return createPageMetadata(meta);
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) notFound();

  const productSchema = createListingProductSchema(listing, site.url);

  return (
    <PageShell>
      <JsonLd data={productSchema} />
      <ListingDetailPageContent listing={listing} />
    </PageShell>
  );
}
