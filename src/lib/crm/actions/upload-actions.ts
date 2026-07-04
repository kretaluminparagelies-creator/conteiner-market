/**
 * @file upload-actions.ts
 * @description Upload listing images to Supabase Storage
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use server";

import { requireCrmSession } from "@/lib/crm/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";

const BUCKET = "listing-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function uploadListingImageAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  await requireCrmSession();

  if (!isSupabaseAdminConfigured()) {
    return { error: "Ανέβασμα εικόνων απαιτεί Supabase + service role." };
  }

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Δεν επιλέχθηκε αρχείο." };
  }

  if (file.size > MAX_BYTES) {
    return { error: "Μέγιστο μέγεθος: 5 MB." };
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Μόνο JPEG, PNG, WebP ή GIF." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${safeExt}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const client = getSupabaseAdminClient();

  const { error: uploadError } = await client.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
