/**
 * @file route.ts
 * @description Depot-only PWA manifest — opens /depot from home screen
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { NextResponse } from "next/server";
import { depotHomePath, isDepotEnabled } from "@/lib/depot/config";

export async function GET() {
  if (!isDepotEnabled()) {
    return NextResponse.json({ error: "Depot disabled" }, { status: 404 });
  }

  const manifest = {
    id: "/depot",
    name: "Depot — Container Market",
    short_name: "Depot",
    description: "Καταχώρηση κοντέινερ & αποστολή προσφορών από την αποθήκη.",
    start_url: depotHomePath,
    scope: "/depot/",
    display: "standalone",
    background_color: "#f4f6f8",
    theme_color: "#e07030",
    lang: "el",
    orientation: "portrait-primary",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/api/depot/pwa-icon?size=192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/api/depot/pwa-icon?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/api/depot/pwa-icon?size=180",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
