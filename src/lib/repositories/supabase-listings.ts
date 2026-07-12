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
import type { Listing, ListingType, ArchiveReason, RentalLocation, StockCondition } from "@/lib/types/listing";
import {
  buildPaginatedResult,
  getPageRange,
  parsePageParam,
  type PaginatedSlice,
} from "@/lib/crm/pagination";

export type AdminListingFilter = "all" | "active" | "inactive";

export type AdminListingsPageQuery = {
  page?: number;
  listingType?: ListingType;
  isOffer?: boolean;
};

export type AdminHistoryQuery = {
  page?: number;
  type?: string;
  listingType?: ListingType | "";
  stockCondition?: StockCondition | "";
  archiveReason?: ArchiveReason | "";
  rentalLocation?: RentalLocation | "";
  isOffer?: "" | "yes" | "no";
  containerNumber?: string;
};

export type AdminRentalsQuery = {
  page?: number;
  contractStatus?: "active" | "expiring" | "expired" | "";
  rentalLocation?: RentalLocation | "";
  query?: string;
};

type ListingCountQuery = {
  active?: boolean;
  listingType?: ListingType;
  isOffer?: boolean;
};

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

async function countListingsFromSupabase(query: ListingCountQuery): Promise<number> {
  const client = getSupabaseAdminClient();
  let request = client.from("listings").select("*", { count: "exact", head: true });

  if (query.active !== undefined) {
    request = request.eq("active", query.active);
  }
  if (query.listingType) {
    request = request.eq("listing_type", query.listingType);
  }
  if (query.isOffer !== undefined) {
    request = request.eq("is_offer", query.isOffer);
  }

  const { count, error } = await request;
  if (error) throw new Error(`Supabase listings count failed: ${error.message}`);
  return count ?? 0;
}

export async function countAdminActiveListingsFromSupabase(): Promise<number> {
  return countListingsFromSupabase({ active: true });
}

export async function countAdminOfferListingsFromSupabase(): Promise<number> {
  return countListingsFromSupabase({ active: true, isOffer: true });
}

export async function countAdminRentListingsFromSupabase(): Promise<number> {
  return countListingsFromSupabase({ active: true, listingType: "rent" });
}

export async function fetchAdminListingsPaginatedFromSupabase(
  query: AdminListingsPageQuery = {},
): Promise<PaginatedSlice<Listing>> {
  const client = getSupabaseAdminClient();
  const columns = await listingSelectColumns("admin");
  const page = parsePageParam(query.page ? String(query.page) : "1");
  const { from, to } = getPageRange(page);

  let request = client
    .from("listings")
    .select(columns, { count: "exact" })
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (query.listingType) {
    request = request.eq("listing_type", query.listingType);
  }
  if (query.isOffer !== undefined) {
    request = request.eq("is_offer", query.isOffer);
  }

  const { data, count, error } = await request.range(from, to);
  if (error) throw new Error(`Supabase admin listings paginated fetch failed: ${error.message}`);

  const items = (data ?? []).map((row) => listingAdminRowToListing(row as unknown as ListingAdminRow));
  return buildPaginatedResult(items, count ?? 0, page);
}

type FilterableQuery = {
  eq: (column: string, value: unknown) => FilterableQuery;
  ilike: (column: string, pattern: string) => FilterableQuery;
};

function applyHistoryFilters<Q extends FilterableQuery>(request: Q, query: AdminHistoryQuery): Q {
  let next = request.eq("active", false) as Q;

  if (query.type) next = next.eq("type", query.type) as Q;
  if (query.listingType) next = next.eq("listing_type", query.listingType) as Q;
  if (query.stockCondition) next = next.eq("stock_condition", query.stockCondition) as Q;
  if (query.archiveReason) next = next.eq("archive_reason", query.archiveReason) as Q;
  if (query.rentalLocation) next = next.eq("rental_location", query.rentalLocation) as Q;
  if (query.isOffer === "yes") next = next.eq("is_offer", true) as Q;
  if (query.isOffer === "no") next = next.eq("is_offer", false) as Q;
  if (query.containerNumber?.trim()) {
    next = next.ilike("container_number", `%${query.containerNumber.trim()}%`) as Q;
  }

  return next;
}

export async function fetchAdminHistoryPaginatedFromSupabase(
  query: AdminHistoryQuery = {},
): Promise<PaginatedSlice<Listing>> {
  const client = getSupabaseAdminClient();
  const mode = await getListingSchemaMode();
  const columns = await listingSelectColumns("admin");
  const page = parsePageParam(query.page ? String(query.page) : "1");
  const { from, to } = getPageRange(page);

  let request = client.from("listings").select(columns, { count: "exact" });
  request = applyHistoryFilters(request, query);
  request =
    mode === "extended"
      ? request.order("archived_at", { ascending: false })
      : request.order("updated_at", { ascending: false });

  const { data, count, error } = await request.range(from, to);
  if (error) throw new Error(`Supabase history paginated fetch failed: ${error.message}`);

  const items = (data ?? []).map((row) => listingAdminRowToListing(row as unknown as ListingAdminRow));
  return buildPaginatedResult(items, count ?? 0, page);
}

function rentalContractDateBounds(status: "active" | "expiring" | "expired") {
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);
  const in30 = new Date(today);
  in30.setDate(in30.getDate() + 30);
  const in30Iso = in30.toISOString().slice(0, 10);

  if (status === "expired") {
    return { lt: todayIso };
  }
  if (status === "expiring") {
    return { gte: todayIso, lte: in30Iso };
  }
  return { gt: in30Iso };
}

export async function fetchAdminRentalsPaginatedFromSupabase(
  query: AdminRentalsQuery = {},
): Promise<PaginatedSlice<Listing>> {
  const client = getSupabaseAdminClient();
  const columns = await listingSelectColumns("admin");
  const page = parsePageParam(query.page ? String(query.page) : "1");
  const { from, to } = getPageRange(page);

  let request = client
    .from("listings")
    .select(columns, { count: "exact" })
    .eq("active", false)
    .eq("archive_reason", "rented")
    .eq("listing_type", "rent")
    .order("rental_ends_at", { ascending: true, nullsFirst: false });

  if (query.rentalLocation) {
    request = request.eq("rental_location", query.rentalLocation);
  }
  if (query.contractStatus) {
    const bounds = rentalContractDateBounds(query.contractStatus);
    if ("lt" in bounds && bounds.lt) {
      request = request.lt("rental_ends_at", bounds.lt);
    }
    if ("gte" in bounds && bounds.gte && "lte" in bounds && bounds.lte) {
      request = request.gte("rental_ends_at", bounds.gte).lte("rental_ends_at", bounds.lte);
    }
    if ("gt" in bounds && bounds.gt) {
      request = request.or(`rental_ends_at.gt.${bounds.gt},rental_ends_at.is.null`);
    }
  }
  if (query.query?.trim()) {
    const needle = `%${query.query.trim()}%`;
    request = request.or(
      [
        `container_number.ilike.${needle}`,
        `type.ilike.${needle}`,
        `rental_customer_name.ilike.${needle}`,
        `rental_customer_phone.ilike.${needle}`,
        `rental_customer_email.ilike.${needle}`,
        `rental_customer_company.ilike.${needle}`,
        `rental_customer_address.ilike.${needle}`,
      ].join(","),
    );
  }

  const { data, count, error } = await request.range(from, to);
  if (error) throw new Error(`Supabase rentals paginated fetch failed: ${error.message}`);

  const items = (data ?? []).map((row) => listingAdminRowToListing(row as unknown as ListingAdminRow));
  return buildPaginatedResult(items, count ?? 0, page);
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
