/**
 * @file sitemap.ts
 * @description Dynamic sitemap for Google and AI crawlers
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { MetadataRoute } from "next";
import { fetchPublicListings } from "@/lib/data/listings-server";
import { site } from "@/lib/constants/site";

const staticRoutes = [
  "",
  "/agora",
  "/polisi",
  "/enoikiasi",
  "/enoikiasis-xoron",
  "/listings",
  "/epikoinonia",
  "/help",
  "/oroi",
  "/aporrito",
  "/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const listings = await fetchPublicListings();

  const staticEntries = staticRoutes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: now,
    changeFrequency:
      route === "" || route === "/listings" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : route === "/listings" ? 0.9 : 0.7,
  }));

  const listingEntries = listings.map((listing) => ({
    url: `${site.url}/listings/${listing.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticEntries, ...listingEntries];
}
