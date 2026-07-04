/**
 * @file manifest.ts
 * @description Web app manifest for PWA / mobile bookmarks
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { MetadataRoute } from "next";
import { site } from "@/lib/constants/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.nameFull,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0f1419",
    theme_color: "#f97316",
    lang: site.language,
    orientation: "portrait-primary",
    categories: ["business", "shopping"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
