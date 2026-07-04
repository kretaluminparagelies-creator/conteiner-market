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
import { LISTINGS_CACHE_TAG } from "@/lib/data/listings-server";
import {
  createListingOnDisk,
  deleteListing,
  updateListingOnDisk,
} from "@/lib/repositories/listing-store";

function revalidateListingPaths(slug?: string) {
  updateTag(LISTINGS_CACHE_TAG);
  revalidatePath("/admin");
  revalidatePath("/admin/listings");
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
  redirect(`/admin/listings?saved=${listing.slug}`);
}

export async function deleteListingAction(slug: string) {
  await requireCrmSession();
  await deleteListing(slug);
  revalidateListingPaths(slug);
  redirect("/admin/listings?deleted=1");
}
