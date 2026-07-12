/**
 * @file upload-depot-image.ts
 * @description Store depot field photos in Supabase Storage
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import {
  uploadListingImageFromBase64,
  type UploadListingImagePayload,
} from "@/lib/crm/upload-listing-image";

export async function uploadDepotImageFromBase64(payload: UploadListingImagePayload) {
  return uploadListingImageFromBase64(payload);
}
