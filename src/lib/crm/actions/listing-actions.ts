/**
 * @file listing-actions.ts
 * @description Server actions — create/update/delete listings
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireCrmSession } from "@/lib/crm/auth";
import type { ListingFormInput } from "@/lib/crm/listing-form";
import type { RentalHandoverInput } from "@/lib/crm/rental-contract";
import { validateRentalHandover } from "@/lib/crm/rental-contract";
import { LISTINGS_CACHE_TAG } from "@/lib/data/listings-server";
import {
  createListingOnDisk,
  deleteListing,
  readAdminListingBySlug,
  setListingArchiveState,
  updateListingOnDisk,
} from "@/lib/repositories/listing-store";
import type { ArchiveReason } from "@/lib/types/listing";

function revalidateListingPaths(slug?: string) {
  updateTag(LISTINGS_CACHE_TAG);
  revalidatePath("/admin");
  revalidatePath("/admin/listings");
  revalidatePath("/admin/history");
  revalidatePath("/admin/rentals");
  revalidatePath("/listings");
  revalidatePath("/");
  if (slug) revalidatePath(`/listings/${slug}`);
}

export async function createListingAction(input: ListingFormInput) {
  await requireCrmSession();
  const listing = await createListingOnDisk(input);
  revalidateListingPaths(listing.slug);
  redirect(`/admin/listings?saved=${listing.slug}`);
}

export async function updateListingAction(slug: string, input: ListingFormInput) {
  await requireCrmSession();
  const listing = await updateListingOnDisk(slug, input);
  revalidateListingPaths(listing.slug);

  if (!input.active && input.listingType === "rent" && listing.archiveReason === "rented") {
    redirect(`/admin/rentals?saved=${slug}`);
  }
  redirect(input.active ? `/admin/listings?saved=${slug}` : `/admin/history?saved=${slug}`);
}

export async function deleteListingAction(slug: string) {
  await requireCrmSession();
  await deleteListing(slug);
  revalidateListingPaths(slug);
  redirect("/admin/listings?deleted=1");
}

/** Hide listing from public site (sold / rented / unavailable) */
export async function setListingActiveAction(
  slug: string,
  active: boolean,
  archiveReason?: ArchiveReason,
  handover?: RentalHandoverInput,
) {
  await requireCrmSession();
  const listing = await readAdminListingBySlug(slug);
  if (!listing) {
    throw new Error("Η καταχώριση δεν βρέθηκε.");
  }

  const reason = archiveReason ?? (listing.listingType === "rent" ? "rented" : "sold");

  if (!active && reason === "rented") {
    if (!handover) {
      throw new Error("Συμπλήρωσε στοιχεία ενοικίασης και πελάτη.");
    }
    const validationError = validateRentalHandover(handover);
    if (validationError) {
      throw new Error(validationError);
    }
  }

  await setListingArchiveState(slug, active, archiveReason, handover);
  revalidateListingPaths(slug);

  if (!active && reason === "rented") {
    redirect(`/admin/rentals?saved=${slug}`);
  }
  redirect(active ? `/admin/listings?saved=${slug}` : `/admin/history?saved=${slug}`);
}
