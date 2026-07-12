/**
 * @file icon.tsx
 * @description Depot favicon
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { ImageResponse } from "next/og";
import { depotPwaIconMarkup } from "@/lib/depot/depot-pwa-icon-markup";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function DepotIcon() {
  return new ImageResponse(depotPwaIconMarkup(32), { ...size });
}
