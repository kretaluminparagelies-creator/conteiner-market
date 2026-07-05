/**
 * @file listing-mapper.ts
 * @description Map Supabase listing rows ↔ app Listing type
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { ListingFormInput } from "@/lib/crm/listing-form";
import { resolveListingImages } from "@/lib/crm/listing-images";
import { site } from "@/lib/constants/site";
import { formatPriceEur } from "@/lib/repositories/listing-format";
import type { ListingInsert, ListingRow } from "@/lib/supabase/server";
import type { ArchiveReason, Listing } from "@/lib/types/listing";

/** Columns needed for CRM listings table — skips descriptions, images, locations */
export type ListingAdminRow = Pick<
  ListingRow,
  | "id"
  | "slug"
  | "type"
  | "container_number"
  | "condition"
  | "price"
  | "price_formatted"
  | "unit"
  | "listing_type"
  | "stock_condition"
  | "is_offer"
  | "active"
  | "archived_at"
  | "archive_reason"
  | "rental_location"
  | "rental_customer_name"
  | "rental_customer_phone"
  | "rental_customer_email"
  | "rental_customer_company"
  | "rental_customer_address"
  | "rental_customer_notes"
  | "rental_starts_at"
  | "rental_ends_at"
  | "created_at"
  | "updated_at"
>;

function mapRentalContractFromRow(row: {
  rental_location?: ListingRow["rental_location"];
  rental_customer_name?: string | null;
  rental_customer_phone?: string | null;
  rental_customer_email?: string | null;
  rental_customer_company?: string | null;
  rental_customer_address?: string | null;
  rental_customer_notes?: string | null;
  rental_starts_at?: string | null;
  rental_ends_at?: string | null;
}): Pick<
  Listing,
  | "rentalLocation"
  | "rentalCustomerName"
  | "rentalCustomerPhone"
  | "rentalCustomerEmail"
  | "rentalCustomerCompany"
  | "rentalCustomerAddress"
  | "rentalCustomerNotes"
  | "rentalStartsAt"
  | "rentalEndsAt"
> {
  return {
    rentalLocation: row.rental_location ?? undefined,
    rentalCustomerName: row.rental_customer_name ?? undefined,
    rentalCustomerPhone: row.rental_customer_phone ?? undefined,
    rentalCustomerEmail: row.rental_customer_email ?? undefined,
    rentalCustomerCompany: row.rental_customer_company ?? undefined,
    rentalCustomerAddress: row.rental_customer_address ?? undefined,
    rentalCustomerNotes: row.rental_customer_notes ?? undefined,
    rentalStartsAt: row.rental_starts_at ?? undefined,
    rentalEndsAt: row.rental_ends_at ?? undefined,
  };
}

export function rentalContractDbFromForm(
  input: ListingFormInput,
  archiveReason?: ArchiveReason | null,
): Record<string, string | null> {
  const isRented =
    archiveReason === "rented" ||
    (!input.active && input.listingType === "rent" && Boolean(input.rentalCustomerName.trim()));
  if (!isRented) {
    return {
      rental_customer_name: null,
      rental_customer_phone: null,
      rental_customer_email: null,
      rental_customer_company: null,
      rental_customer_address: null,
      rental_customer_notes: null,
      rental_starts_at: null,
      rental_ends_at: null,
    };
  }

  return {
    rental_customer_name: input.rentalCustomerName.trim() || null,
    rental_customer_phone: input.rentalCustomerPhone.trim() || null,
    rental_customer_email: input.rentalCustomerEmail.trim() || null,
    rental_customer_company: input.rentalCustomerCompany.trim() || null,
    rental_customer_address: input.rentalCustomerAddress.trim() || null,
    rental_customer_notes: input.rentalCustomerNotes.trim() || null,
    rental_starts_at: input.rentalStartsAt || null,
    rental_ends_at: input.rentalEndsAt || null,
  };
}

export function listingAdminRowToListing(row: ListingAdminRow): Listing {
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    containerNumber: row.container_number ?? undefined,
    condition: row.condition,
    price: Number(row.price),
    priceFormatted: row.price_formatted,
    unit: row.unit ?? "",
    listingType: row.listing_type,
    stockCondition: row.stock_condition,
    isOffer: row.is_offer,
    active: row.active,
    archivedAt: row.archived_at ?? undefined,
    archiveReason: row.archive_reason ?? undefined,
    ...mapRentalContractFromRow(row),
    location: "",
    image: "",
    description: "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listingRowToListing(row: ListingRow): Listing {
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    containerNumber: row.container_number ?? undefined,
    condition: row.condition,
    conditionEn: row.condition_en ?? undefined,
    price: Number(row.price),
    priceFormatted: row.price_formatted,
    unit: row.unit ?? "",
    unitEn: row.unit_en ?? undefined,
    location: row.location,
    locationEn: row.location_en ?? undefined,
    listingType: row.listing_type,
    stockCondition: row.stock_condition,
    isOffer: row.is_offer,
    image: row.image,
    images: row.images ?? undefined,
    description: row.description,
    descriptionEn: row.description_en ?? undefined,
    active: row.active,
    archivedAt: row.archived_at ?? undefined,
    archiveReason: row.archive_reason ?? undefined,
    ...mapRentalContractFromRow(row),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listingFormToInsert(input: ListingFormInput, slug: string): ListingInsert {
  const unit = input.listingType === "rent" && !input.unit ? "/μήνα" : input.unit;
  const unitEn =
    input.listingType === "rent" && !input.unitEn ? (unit ? "/month" : "") : input.unitEn;
  const { image, images } = resolveListingImages(input);

  return {
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
    archived_at: null,
    archive_reason: null,
    rental_location: null,
    rental_customer_name: null,
    rental_customer_phone: null,
    rental_customer_email: null,
    rental_customer_company: null,
    rental_customer_address: null,
    rental_customer_notes: null,
    rental_starts_at: null,
    rental_ends_at: null,
  };
}

export function listingToInsert(listing: Listing): ListingInsert {
  return {
    slug: listing.slug,
    type: listing.type,
    container_number: listing.containerNumber ?? null,
    condition: listing.condition,
    condition_en: listing.conditionEn ?? null,
    price: listing.price,
    price_formatted: listing.priceFormatted,
    unit: listing.unit,
    unit_en: listing.unitEn ?? null,
    location: listing.location,
    location_en: listing.locationEn ?? null,
    listing_type: listing.listingType,
    stock_condition: listing.stockCondition ?? "used",
    is_offer: listing.isOffer ?? false,
    image: listing.image,
    images: listing.images ?? null,
    description: listing.description,
    description_en: listing.descriptionEn ?? null,
    active: listing.active,
    archived_at: listing.archivedAt ?? null,
    archive_reason: listing.archiveReason ?? null,
    rental_location: listing.rentalLocation ?? null,
    rental_customer_name: listing.rentalCustomerName ?? null,
    rental_customer_phone: listing.rentalCustomerPhone ?? null,
    rental_customer_email: listing.rentalCustomerEmail ?? null,
    rental_customer_company: listing.rentalCustomerCompany ?? null,
    rental_customer_address: listing.rentalCustomerAddress ?? null,
    rental_customer_notes: listing.rentalCustomerNotes ?? null,
    rental_starts_at: listing.rentalStartsAt ?? null,
    rental_ends_at: listing.rentalEndsAt ?? null,
  };
}
