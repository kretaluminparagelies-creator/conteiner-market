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
  rentalContractDbFromForm,
  type ListingAdminRow,
} from "@/lib/supabase/listing-mapper";
import {
  archivePayloadForArchiveAction,
  archivePayloadForUpdate,
  existingListingLookupColumns,
  getListingSchemaMode,
  listingSelectColumns,
  omitExtendedListingWriteFields,
} from "@/lib/supabase/listing-schema";
import {
  getSupabaseAdminClient,
  getSupabaseAnonServerClient,
  type ListingRow,
} from "@/lib/supabase/server";
import type { Listing, ListingType, ArchiveReason, RentalLocation } from "@/lib/types/listing";

export type AdminListingFilter = "all" | "active" | "inactive";

type ExistingListingLookupRow = {
  id: string;
  slug: string;
  active: boolean;
  archive_reason?: string | null;
  listing_type?: ListingType;
};

export async function fetchAdminListingSummariesFromSupabase(
  filter: AdminListingFilter = "all",
): Promise<Listing[]> {
  const client = getSupabaseAdminClient();
  const mode = await getListingSchemaMode();
  const columns = await listingSelectColumns("admin");

  let query = client.from("listings").select(columns).order("created_at", { ascending: false });

  if (filter === "active") {
    query = query.eq("active", true);
  } else if (filter === "inactive") {
    query = query.eq("active", false);
    query =
      mode === "extended"
        ? query.order("archived_at", { ascending: false })
        : query.order("updated_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Supabase admin listings fetch failed: ${error.message}`);
  }

  return (data ?? []).map((row) => listingAdminRowToListing(row as unknown as ListingAdminRow));
}

export async function fetchAdminActiveRentalsFromSupabase(): Promise<Listing[]> {
  const client = getSupabaseAdminClient();
  const columns = await listingSelectColumns("admin");

  const { data, error } = await client
    .from("listings")
    .select(columns)
    .eq("active", false)
    .eq("archive_reason", "rented")
    .eq("listing_type", "rent")
    .order("rental_ends_at", { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error(`Supabase active rentals fetch failed: ${error.message}`);
  }

  return (data ?? []).map((row) => listingAdminRowToListing(row as unknown as ListingAdminRow));
}

export async function fetchListingsFromSupabase(options?: {
  includeInactive?: boolean;
  admin?: boolean;
}): Promise<Listing[]> {
  const includeInactive = options?.includeInactive ?? false;
  const useAdmin = options?.admin ?? includeInactive;

  const client = useAdmin ? getSupabaseAdminClient() : getSupabaseAnonServerClient();
  const columns = await listingSelectColumns("full");

  let query = client.from("listings").select(columns).order("created_at", { ascending: true });

  if (!includeInactive) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Supabase listings fetch failed: ${error.message}`);
  }

  return (data ?? []).map((row) => listingRowToListing(row as unknown as ListingRow));
}

export async function fetchListingBySlugFromSupabase(
  slug: string,
  options?: { admin?: boolean },
): Promise<Listing | undefined> {
  const client = options?.admin ? getSupabaseAdminClient() : getSupabaseAnonServerClient();
  const columns = await listingSelectColumns("full");

  const { data, error } = await client
    .from("listings")
    .select(columns)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase listing fetch failed: ${error.message}`);
  }

  return data ? listingRowToListing(data as unknown as ListingRow) : undefined;
}

export async function fetchListingsByTypeFromSupabase(
  listingType: ListingType,
): Promise<Listing[]> {
  const listings = await fetchListingsFromSupabase();
  return listings.filter((listing) => listing.listingType === listingType);
}

export async function createListingInSupabase(input: ListingFormInput): Promise<Listing> {
  const client = getSupabaseAdminClient();
  const mode = await getListingSchemaMode();
  const columns = await listingSelectColumns("full");
  const { data: existing, error: listError } = await client.from("listings").select("slug");

  if (listError) {
    throw new Error(`Supabase slug lookup failed: ${listError.message}`);
  }

  const slugs = (existing ?? []).map((row: { slug: string }) => row.slug);
  const baseSlug = slugifyListing(input.type);
  const slug = uniqueSlug(baseSlug, slugs);
  const insert = await omitExtendedListingWriteFields(listingFormToInsert(input, slug), mode);

  const { data, error } = await client.from("listings").insert(insert).select(columns).single();

  if (error) {
    throw new Error(`Supabase listing create failed: ${error.message}`);
  }

  return listingRowToListing(data as unknown as ListingRow);
}

export async function updateListingInSupabase(
  existingSlug: string,
  input: ListingFormInput,
): Promise<Listing> {
  const client = getSupabaseAdminClient();
  const mode = await getListingSchemaMode();
  const columns = await listingSelectColumns("full");
  const lookupColumns = await existingListingLookupColumns();

  const { data: existingRowRaw, error: findError } = await client
    .from("listings")
    .select(lookupColumns)
    .eq("slug", existingSlug)
    .maybeSingle();

  if (findError) {
    throw new Error(`Supabase listing lookup failed: ${findError.message}`);
  }

  if (!existingRowRaw) {
    throw new Error("Listing not found");
  }

  const existingRow = existingRowRaw as unknown as ExistingListingLookupRow;

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
  const archivePayload = await archivePayloadForUpdate(input, existingRow);
  const contractPayload = rentalContractDbFromForm(
    input,
    existingRow.archive_reason as ArchiveReason | null,
  );

  const updatePayload = await omitExtendedListingWriteFields(
    {
      slug,
      type: input.type.trim(),
      container_number: input.containerNumber.trim() || null,
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
      rental_location: input.rentalLocation || null,
      ...archivePayload,
      ...contractPayload,
      updated_at: new Date().toISOString(),
    },
    mode,
  );

  const { data, error } = await client
    .from("listings")
    .update(updatePayload)
    .eq("id", existingRow.id)
    .select(columns)
    .single();

  if (error) {
    throw new Error(`Supabase listing update failed: ${error.message}`);
  }

  return listingRowToListing(data as unknown as ListingRow);
}

export async function deleteListingInSupabase(slug: string): Promise<void> {
  const client = getSupabaseAdminClient();
  const { error } = await client.from("listings").delete().eq("slug", slug);

  if (error) {
    throw new Error(`Supabase listing delete failed: ${error.message}`);
  }
}

export async function setListingArchiveInSupabase(
  slug: string,
  input: ListingFormInput,
  active: boolean,
  archiveReason?: ArchiveReason,
  rentalLocation?: RentalLocation,
): Promise<Listing> {
  const client = getSupabaseAdminClient();
  const mode = await getListingSchemaMode();
  const columns = await listingSelectColumns("full");

  const { data: existingRowRaw, error: findError } = await client
    .from("listings")
    .select("id, slug, listing_type")
    .eq("slug", slug)
    .maybeSingle();

  if (findError) {
    throw new Error(`Supabase listing lookup failed: ${findError.message}`);
  }

  if (!existingRowRaw) {
    throw new Error("Listing not found");
  }

  const existingRow = existingRowRaw as unknown as ExistingListingLookupRow;

  const { data: allSlugs, error: listError } = await client.from("listings").select("slug");

  if (listError) {
    throw new Error(`Supabase slug lookup failed: ${listError.message}`);
  }

  const slugs = (allSlugs ?? []).map((row: { slug: string }) => row.slug);
  const baseSlug = slugifyListing(input.type);
  const nextSlug = uniqueSlug(baseSlug, slugs, slug);

  const unit = input.listingType === "rent" && !input.unit ? "/μήνα" : input.unit;
  const unitEn =
    input.listingType === "rent" && !input.unitEn ? (unit ? "/month" : "") : input.unitEn;
  const { image, images } = resolveListingImages(input);
  const reason = archiveReason ?? (existingRow.listing_type as ListingType === "rent" ? "rented" : "sold");
  const archivePayload = await archivePayloadForArchiveAction(
    active,
    existingRow.listing_type as ListingType,
    archiveReason,
    rentalLocation ?? (input.rentalLocation || undefined),
  );
  const contractPayload = rentalContractDbFromForm(input, reason);

  const updatePayload = await omitExtendedListingWriteFields(
    {
      slug: nextSlug,
      type: input.type.trim(),
      container_number: input.containerNumber.trim() || null,
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
      active,
      rental_location: (rentalLocation ?? input.rentalLocation) || null,
      ...archivePayload,
      ...contractPayload,
      updated_at: new Date().toISOString(),
    },
    mode,
  );

  const { data, error } = await client
    .from("listings")
    .update(updatePayload)
    .eq("id", existingRow.id)
    .select(columns)
    .single();

  if (error) {
    throw new Error(`Supabase listing archive update failed: ${error.message}`);
  }

  return listingRowToListing(data as unknown as ListingRow);
}
