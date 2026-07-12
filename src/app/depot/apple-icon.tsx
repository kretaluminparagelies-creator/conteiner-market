/**
 * @file apple-icon.tsx
 * @description Depot iOS home screen icon
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { ImageResponse } from "next/og";
import { depotPwaIconMarkup } from "@/lib/depot/depot-pwa-icon-markup";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function DepotAppleIcon() {
  return new ImageResponse(depotPwaIconMarkup(180), { ...size });
}
