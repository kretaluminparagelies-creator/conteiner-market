/**
 * @file upload-listing-image.ts
 * @description Store an already-compressed listing image in Supabase Storage
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";

const BUCKET = "listing-images";
const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type UploadListingImageResult = { url?: string; error?: string };

export type UploadListingImagePayload = {
  data: string;
  mimeType: string;
  size: number;
};

export async function uploadListingImageFromBase64(
  payload: UploadListingImagePayload,
): Promise<UploadListingImageResult> {
  if (!isSupabaseAdminConfigured()) {
    return { error: "Ανέβασμα εικόνων απαιτεί Supabase + service role." };
  }

  if (!payload?.data?.trim()) {
    return { error: "Δεν επιλέχθηκε αρχείο." };
  }

  if (!ALLOWED_TYPES.has(payload.mimeType)) {
    return { error: "Μόνο JPEG, PNG, WebP ή GIF." };
  }

  try {
    const buffer = Buffer.from(payload.data, "base64");

    if (buffer.length === 0) {
      return { error: "Μη έγκυρο αρχείο." };
    }

    if (buffer.length > MAX_BYTES) {
      return { error: "Μέγιστο μέγεθος: 12 MB." };
    }

    const extension = EXTENSION_BY_MIME[payload.mimeType] ?? "jpg";
    const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
    const client = getSupabaseAdminClient();

    const { error: uploadError } = await client.storage.from(BUCKET).upload(path, buffer, {
      contentType: payload.mimeType,
      upsert: false,
    });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data } = client.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (error) {
    console.error("[upload-listing-image]", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Αποτυχία ανεβάσματος. Δοκίμασε ξανά ή μικρότερο αρχείο.",
    };
  }
}
