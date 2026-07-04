/**
 * @file supabase-listings.ts
 * @description Supabase listing queries (server-only)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import type { ListingFormInput } from "@/lib/crm/listing-form";
import { resolveListingImages } from "@/lib/crm/listing-images";
import { formatPriceEur, slugifyListing, uniqueSlug } from "@/lib/repositories/listing-format";
import { site } from "@/lib/constants/site";
import {
  listingAdminRowToListing,
  listingFormToInsert,
  listingRowToListing,
  type ListingAdminRow,
} from "@/lib/supabase/listing-mapper";
import {
  getSupabaseAdminClient,
  getSupabaseAnonServerClient,
  type ListingRow,
} from "@/lib/supabase/server";
import type { Listing, ListingType } from "@/lib/types/listing";

const listingColumns =
  "id, slug, type, condition, condition_en, price, price_formatted, unit, unit_en, location, location_en, listing_type, stock_condition, is_offer, image, images, description, description_en, active, created_at, updated_at";

const listingAdminColumns =
  "id, slug, type, condition, price, price_formatted, unit, listing_type, stock_condition, is_offer, active";

export async function fetchAdminListingSummariesFromSupabase(
  includeInactive = true,
): Promise<Listing[]> {
  const client = getSupabaseAdminClient();

  let query = client
    .from("listings")
    .select(listingAdminColumns)
    .order("created_at", { ascending: true });

  if (!includeInactive) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Supabase admin listings fetch failed: ${error.message}`);
  }

  return (data ?? []).map((row) => listingAdminRowToListing(row as ListingAdminRow));
}

export async function fetchListingsFromSupabase(options?: {
  includeInactive?: boolean;
  admin?: boolean;
}): Promise<Listing[]> {
  const includeInactive = options?.includeInactive ?? false;
  const useAdmin = options?.admin ?? includeInactive;

  const client = useAdmin ? getSupabaseAdminClient() : getSupabaseAnonServerClient();

  let query = client
    .from("listings")
    .select(listingColumns)
    .order("created_at", { ascending: true });

  if (!includeInactive) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Supabase listings fetch failed: ${error.message}`);
  }

  return (data ?? []).map((row) => listingRowToListing(row as ListingRow));
}

export async function fetchListingBySlugFromSupabase(
  slug: string,
  options?: { admin?: boolean },
): Promise<Listing | undefined> {
  const client = options?.admin ? getSupabaseAdminClient() : getSupabaseAnonServerClient();

  const { data, error } = await client
    .from("listings")
    .select(listingColumns)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase listing fetch failed: ${error.message}`);
  }

  return data ? listingRowToListing(data as ListingRow) : undefined;
}

export async function fetchListingsByTypeFromSupabase(
  listingType: ListingType,
): Promise<Listing[]> {
  const listings = await fetchListingsFromSupabase();
  return listings.filter((listing) => listing.listingType === listingType);
}

export async function createListingInSupabase(input: ListingFormInput): Promise<Listing> {
  const client = getSupabaseAdminClient();
  const { data: existing, error: listError } = await client.from("listings").select("slug");

  if (listError) {
    throw new Error(`Supabase slug lookup failed: ${listError.message}`);
  }

  const slugs = (existing ?? []).map((row: { slug: string }) => row.slug);
  const baseSlug = slugifyListing(input.type);
  const slug = uniqueSlug(baseSlug, slugs);
  const insert = listingFormToInsert(input, slug);

  const { data, error } = await client
    .from("listings")
    .insert(insert)
    .select(listingColumns)
    .single();

  if (error) {
    throw new Error(`Supabase listing create failed: ${error.message}`);
  }

  return listingRowToListing(data as ListingRow);
}

export async function updateListingInSupabase(
  existingSlug: string,
  input: ListingFormInput,
): Promise<Listing> {
  const client = getSupabaseAdminClient();

  const { data: existingRow, error: findError } = await client
    .from("listings")
    .select("id, slug")
    .eq("slug", existingSlug)
    .maybeSingle();

  if (findError) {
    throw new Error(`Supabase listing lookup failed: ${findError.message}`);
  }

  if (!existingRow) {
    throw new Error("Listing not found");
  }

  const { data: allSlugs, error: listError } = await client.from("listings").select("slug");

  if (listError) {
    throw new Error(`Supabase slug lookup failed: ${listError.message}`);
  }

  const slugs = (allSlugs ?? []).map((row: { slug: string }) => row.slug);
  const baseSlug = slugifyListing(input.type);
  const slug = uniqueSlug(baseSlug, slugs, existingSlug);

  const unit = input.listingType === "rent" && !input.unit ? "/μήνα" : input.unit;
  const unitEn =
    input.listingType === "rent" && !input.unitEn ? (unit ? "/month" : "") : input.unitEn;
  const { image, images } = resolveListingImages(input);

  const { data, error } = await client
    .from("listings")
    .update({
      slug,
      type: input.type.trim(),
      condition: input.condition.trim(),
      condition_en: input.conditionEn.trim() || null,
      price: input.price,
      price_formatted: formatPriceEur(input.price),
      unit,
      unit_en: unitEn || null,
      location: site.headquarters.el,
      location_en: site.headquarters.en,
      listing_type: input.listingType,
      stock_condition: input.stockCondition,
      is_offer: input.isOffer,
      image,
      images,
      description: input.description.trim(),
      description_en: input.descriptionEn.trim() || null,
      active: input.active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existingRow.id)
    .select(listingColumns)
    .single();

  if (error) {
    throw new Error(`Supabase listing update failed: ${error.message}`);
  }

  return listingRowToListing(data as ListingRow);
}

export async function deleteListingInSupabase(slug: string): Promise<void> {
  const client = getSupabaseAdminClient();
  const { error } = await client.from("listings").delete().eq("slug", slug);

  if (error) {
    throw new Error(`Supabase listing delete failed: ${error.message}`);
  }
}
