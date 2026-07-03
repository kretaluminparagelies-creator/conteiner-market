/**
 * @file robots.ts
 * @description Robots.txt configuration for search engines
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { MetadataRoute } from "next";
import { site } from "@/lib/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
