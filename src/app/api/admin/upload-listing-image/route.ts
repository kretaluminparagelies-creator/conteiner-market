/**
 * @file route.ts
 * @description CRM listing image upload (JSON base64 — avoids File/ArrayBuffer on server)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { NextResponse } from "next/server";
import { requireCrmSession } from "@/lib/crm/auth";
import {
  uploadListingImageFromBase64,
  type UploadListingImagePayload,
} from "@/lib/crm/upload-listing-image";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireCrmSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: UploadListingImagePayload;
  try {
    body = (await request.json()) as UploadListingImagePayload;
  } catch {
    return NextResponse.json({ error: "Μη έγκυρο αίτημα." }, { status: 400 });
  }

  const result = await uploadListingImageFromBase64(body);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ url: result.url });
}
