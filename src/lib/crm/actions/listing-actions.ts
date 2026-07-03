/**
 * @file listing-actions.ts
 * @description Server actions — create/update listings (preview JSON store)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ListingFormInput } from "@/lib/crm/listing-form";
import {
  createListingOnDisk,
  updateListingOnDisk,
} from "@/lib/repositories/listing-store";

function revalidateListingPaths(slug?: string) {
  revalidatePath("/admin/listings");
  revalidatePath("/listings");
  revalidatePath("/");
  if (slug) revalidatePath(`/listings/${slug}`);
}

export async function createListingAction(input: ListingFormInput) {
  const listing = await createListingOnDisk(input);
  revalidateListingPaths(listing.slug);
  redirect(`/admin/listings?saved=${listing.slug}`);
}

export async function updateListingAction(slug: string, input: ListingFormInput) {
  const listing = await updateListingOnDisk(slug, input);
  revalidateListingPaths(listing.slug);
  redirect(`/admin/listings?saved=${listing.slug}`);
}
