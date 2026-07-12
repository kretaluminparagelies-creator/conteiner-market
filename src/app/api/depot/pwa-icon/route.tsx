/**
 * @file route.tsx
 * @description Depot PWA icon sizes for web manifest
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { depotPwaIconMarkup } from "@/lib/depot/depot-pwa-icon-markup";
import { isDepotEnabled } from "@/lib/depot/config";

const allowedSizes = [180, 192, 512] as const;

export async function GET(request: Request) {
  if (!isDepotEnabled()) notFound();

  const { searchParams } = new URL(request.url);
  const requested = Number(searchParams.get("size") ?? "192");
  const size = allowedSizes.includes(requested as (typeof allowedSizes)[number])
    ? requested
    : 192;

  return new ImageResponse(depotPwaIconMarkup(size), {
    width: size,
    height: size,
  });
}
