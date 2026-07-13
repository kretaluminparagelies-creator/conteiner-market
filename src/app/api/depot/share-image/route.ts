/**
 * @file route.ts
 * @description Same-origin proxy for depot container photos (share sheet / File API)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { NextResponse } from "next/server";
import { requireCrmSession } from "@/lib/depot/auth";
import { getDepotContainerById } from "@/lib/depot/repository/depot-store";
import { safeContainerImageFilename } from "@/lib/depot/share-image-filename";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await requireCrmSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const containerId = new URL(request.url).searchParams.get("containerId");
  if (!containerId) {
    return NextResponse.json({ error: "Missing containerId" }, { status: 400 });
  }

  const container = await getDepotContainerById(containerId);
  const indexParam = new URL(request.url).searchParams.get("index");
  const imageIndex =
    indexParam !== null ? Math.max(0, Number.parseInt(indexParam, 10) || 0) : 0;
  const imageUrl = container?.images[imageIndex];
  if (!imageUrl) {
    return NextResponse.json({ error: "No image" }, { status: 404 });
  }

  const download = new URL(request.url).searchParams.get("download") === "1";
  const filename = safeContainerImageFilename(
    container?.containerNumber ?? "container",
    "jpg",
    imageIndex,
  );

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    return NextResponse.json({ error: "Image fetch failed" }, { status: 502 });
  }

  const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
  const buffer = await imageResponse.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=3600",
      ...(download ? { "Content-Disposition": `attachment; filename="${filename}"` } : {}),
    },
  });
}
