/**
 * @file listing-store.ts
 * @description Server-only listings persistence — Supabase or JSON fallback
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { cache } from "react";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ListingFormInput } from "@/lib/crm/listing-form";
import { listingToFormInput } from "@/lib/crm/listing-form";
import { resolveListingImages } from "@/lib/crm/listing-images";
import { site } from "@/lib/constants/site";
import { formatPriceEur, slugifyListing, uniqueSlug } from "@/lib/repositories/listing-format";
import {
  createListingInSupabase,
  deleteListingInSupabase,
  fetchAdminActiveRentalsFromSupabase,
  fetchAdminListingSummariesFromSupabase,
  fetchListingBySlugFromSupabase,
  setListingArchiveInSupabase,
  updateListingInSupabase,
  type AdminListingFilter,
} from "@/lib/repositories/supabase-listings";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import type { Listing, ArchiveReason, RentalLocation } from "@/lib/types/listing";
import { isActiveRentalListing, type RentalHandoverInput } from "@/lib/crm/rental-contract";

function resolveRentalLocation(
  handover?: RentalHandoverInput,
  formLocation?: RentalLocation | "",
): RentalLocation | undefined {
  if (handover) return handover.rentalLocation;
  if (formLocation === "depot") return "depot";
  if (formLocation === "customer") return "customer";
  return undefined;
}

export type { AdminListingFilter } from "@/lib/repositories/supabase-listings";

export {
  formatPriceEur,
  placeholderImageForType,
  slugifyListing,
  uniqueSlug,
} from "@/lib/repositories/listing-format";

const listingsPath = path.join(process.cwd(), "src/data/listings.json");

export async function readListingsFromDisk(): Promise<Listing[]> {
  const raw = await readFile(listingsPath, "utf-8");
  return JSON.parse(raw) as Listing[];
}

export async function writeListingsToDisk(listings: Listing[]): Promise<void> {
  await writeFile(listingsPath, `${JSON.stringify(listings, null, 2)}\n`, "utf-8");
}

export function nextListingId(listings: Listing[]): string {
  const max = listings.reduce((acc, item) => Math.max(acc, Number.parseInt(item.id, 10) || 0), 0);
  return String(max + 1);
}

function buildListing(input: ListingFormInput, id: string, slug: string): Listing {
  const unit = input.listingType === "rent" && !input.unit ? "/μήνα" : input.unit;
  const unitEn =
    input.listingType === "rent" && !input.unitEn ? (unit ? "/month" : "") : input.unitEn;
  const { image, images } = resolveListingImages(input);

  return {
    id,
    slug,
    type: input.type.trim(),
    containerNumber: input.containerNumber.trim() || undefined,
    condition: input.condition.trim(),
    conditionEn: input.conditionEn.trim() || undefined,
    price: input.price,
    priceFormatted: formatPriceEur(input.price),
    unit,
    unitEn: unitEn || undefined,
    location: site.headquarters.el,
    locationEn: site.headquarters.en,
    listingType: input.listingType,
    stockCondition: input.stockCondition,
    isOffer: input.isOffer,
    image,
    images: images ?? undefined,
    description: input.description.trim(),
    descriptionEn: input.descriptionEn.trim() || undefined,
    active: input.active,
  };
}

async function readAdminListingsUncached(filter: AdminListingFilter = "all"): Promise<Listing[]> {
  if (isSupabaseAdminConfigured()) {
    try {
      return await fetchAdminListingSummariesFromSupabase(filter);
    } catch (error) {
      console.error("[listing-store] Supabase admin read failed, falling back to JSON:", error);
    }
  }

  const listings = await readListingsFromDisk();
  if (filter === "active") return listings.filter((l) => l.active);
  if (filter === "inactive") return listings.filter((l) => !l.active);
  return listings;
}

export const readAdminListings = cache(() => readAdminListingsUncached("active"));
export const readAdminHistoryListings = cache(() => readAdminListingsUncached("inactive"));
export const readAdminActiveRentals = cache(readAdminActiveRentalsUncached);
export const readAdminAvailableRentListings = cache(async () => {
  const listings = await readAdminListingsUncached("active");
  return listings.filter((listing) => listing.listingType === "rent");
});

async function readAdminActiveRentalsUncached(): Promise<Listing[]> {
  if (isSupabaseAdminConfigured()) {
    try {
      return await fetchAdminActiveRentalsFromSupabase();
    } catch (error) {
      console.error("[listing-store] Supabase rentals read failed, falling back to JSON:", error);
    }
  }

  const listings = await readListingsFromDisk();
  return listings
    .filter(isActiveRentalListing)
    .sort((a, b) => (a.rentalEndsAt ?? "").localeCompare(b.rentalEndsAt ?? ""));
}

function handoverToFormFields(handover: RentalHandoverInput): Partial<ListingFormInput> {
  return {
    rentalLocation: handover.rentalLocation,
    rentalCustomerName: handover.customerName,
    rentalCustomerPhone: handover.customerPhone,
    rentalCustomerEmail: handover.customerEmail,
    rentalCustomerCompany: handover.customerCompany,
    rentalCustomerAddress: handover.customerAddress,
    rentalCustomerNotes: handover.customerNotes,
    rentalStartsAt: handover.startsAt,
    rentalEndsAt: handover.endsAt,
  };
}

export async function readAdminListingBySlug(slug: string): Promise<Listing | undefined> {
  if (isSupabaseAdminConfigured()) {
    try {
      return await fetchListingBySlugFromSupabase(slug, { admin: true });
    } catch (error) {
      console.error("[listing-store] Supabase admin read failed, falling back to JSON:", error);
    }
  }

  const listings = await readListingsFromDisk();
  return listings.find((l) => l.slug === slug);
}

export async function createListingOnDisk(input: ListingFormInput): Promise<Listing> {
  if (isSupabaseAdminConfigured()) {
    return createListingInSupabase(input);
  }

  const listings = await readListingsFromDisk();
  const baseSlug = slugifyListing(input.type);
  const slug = uniqueSlug(
    baseSlug,
    listings.map((l) => l.slug),
  );
  const listing = buildListing(input, nextListingId(listings), slug);

  listings.push(listing);
  await writeListingsToDisk(listings);

  return listing;
}

export async function updateListingOnDisk(
  existingSlug: string,
  input: ListingFormInput,
): Promise<Listing> {
  if (isSupabaseAdminConfigured()) {
    return updateListingInSupabase(existingSlug, input);
  }

  const listings = await readListingsFromDisk();
  const index = listings.findIndex((l) => l.slug === existingSlug);

  if (index === -1) {
    throw new Error("Listing not found");
  }

  const baseSlug = slugifyListing(input.type);
  const slug = uniqueSlug(
    baseSlug,
    listings.map((l) => l.slug),
    existingSlug,
  );
  const listing = buildListing(input, listings[index].id, slug);
  const wasActive = listings[index].active;

  if (!input.active && wasActive) {
    listing.archivedAt = new Date().toISOString();
    listing.archiveReason = listings[index].archiveReason ?? "withdrawn";
    listing.rentalLocation =
      listing.archiveReason === "rented"
        ? resolveRentalLocation(undefined, input.rentalLocation) ?? listings[index].rentalLocation
        : undefined;
  } else if (input.active) {
    listing.archivedAt = undefined;
    listing.archiveReason = undefined;
    listing.rentalLocation = undefined;
  } else {
    listing.archivedAt = listings[index].archivedAt;
    listing.archiveReason = listings[index].archiveReason;
    listing.rentalLocation =
      resolveRentalLocation(undefined, input.rentalLocation) ?? listings[index].rentalLocation;
    if (listing.archiveReason === "rented") {
      listing.rentalCustomerName = input.rentalCustomerName.trim() || listings[index].rentalCustomerName;
      listing.rentalCustomerPhone = input.rentalCustomerPhone.trim() || listings[index].rentalCustomerPhone;
      listing.rentalCustomerEmail = input.rentalCustomerEmail.trim() || listings[index].rentalCustomerEmail;
      listing.rentalCustomerCompany =
        input.rentalCustomerCompany.trim() || listings[index].rentalCustomerCompany;
      listing.rentalCustomerAddress =
        input.rentalCustomerAddress.trim() || listings[index].rentalCustomerAddress;
      listing.rentalCustomerNotes =
        input.rentalCustomerNotes.trim() || listings[index].rentalCustomerNotes;
      listing.rentalStartsAt = input.rentalStartsAt || listings[index].rentalStartsAt;
      listing.rentalEndsAt = input.rentalEndsAt || listings[index].rentalEndsAt;
    }
  }

  listings[index] = listing;
  await writeListingsToDisk(listings);

  return listing;
}

export async function deleteListing(slug: string): Promise<void> {
  if (isSupabaseAdminConfigured()) {
    await deleteListingInSupabase(slug);
    return;
  }

  const listings = await readListingsFromDisk();
  const next = listings.filter((l) => l.slug !== slug);

  if (next.length === listings.length) {
    throw new Error("Listing not found");
  }

  await writeListingsToDisk(next);
}

export async function setListingArchiveState(
  slug: string,
  active: boolean,
  archiveReason?: ArchiveReason,
  handover?: RentalHandoverInput,
): Promise<Listing> {
  const listing = await readAdminListingBySlug(slug);
  if (!listing) {
    throw new Error("Listing not found");
  }

  const input: ListingFormInput = {
    ...listingToFormInput(listing),
    active,
    ...(handover ? handoverToFormFields(handover) : {}),
  };

  if (isSupabaseAdminConfigured()) {
    return setListingArchiveInSupabase(
      slug,
      input,
      active,
      archiveReason,
      handover?.rentalLocation ?? resolveRentalLocation(undefined, input.rentalLocation),
    );
  }

  const updated = await updateListingOnDisk(slug, input);
  const listings = await readListingsFromDisk();
  const index = listings.findIndex((l) => l.slug === slug);
  if (index === -1) {
    throw new Error("Listing not found");
  }

  if (!active) {
    const reason = archiveReason ?? (listing.listingType === "rent" ? "rented" : "sold");
    const rentedLocation: RentalLocation | undefined =
      reason === "rented" ? resolveRentalLocation(handover, input.rentalLocation) : undefined;

    listings[index] = {
      ...updated,
      archivedAt: new Date().toISOString(),
      archiveReason: reason,
      rentalLocation: rentedLocation,
      ...(reason === "rented" && handover
        ? {
            rentalCustomerName: handover.customerName,
            rentalCustomerPhone: handover.customerPhone,
            rentalCustomerEmail: handover.customerEmail || undefined,
            rentalCustomerCompany: handover.customerCompany || undefined,
            rentalCustomerAddress: handover.customerAddress || undefined,
            rentalCustomerNotes: handover.customerNotes || undefined,
            rentalStartsAt: handover.startsAt,
            rentalEndsAt: handover.endsAt,
          }
        : {}),
    };
  } else {
    listings[index] = {
      ...updated,
      archivedAt: undefined,
      archiveReason: undefined,
      rentalLocation: undefined,
      rentalCustomerName: undefined,
      rentalCustomerPhone: undefined,
      rentalCustomerEmail: undefined,
      rentalCustomerCompany: undefined,
      rentalCustomerAddress: undefined,
      rentalCustomerNotes: undefined,
      rentalStartsAt: undefined,
      rentalEndsAt: undefined,
    };
  }

  await writeListingsToDisk(listings);
  return listings[index];
}
