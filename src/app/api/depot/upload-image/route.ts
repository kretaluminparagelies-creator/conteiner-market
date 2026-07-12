/**
 * @file route.ts
 * @description Depot image upload (same auth as CRM)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { NextResponse } from "next/server";
import { requireCrmSession } from "@/lib/depot/auth";
import { uploadDepotImageFromBase64 } from "@/lib/depot/upload-depot-image";
import type { UploadListingImagePayload } from "@/lib/crm/upload-listing-image";

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

  const result = await uploadDepotImageFromBase64(body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ url: result.url });
}
