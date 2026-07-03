/**
 * @file sitemap.ts
 * @description Dynamic sitemap for Google and AI crawlers
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { MetadataRoute } from "next";
import { getAllListings } from "@/lib/data/listings";
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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/listings" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : route === "/listings" ? 0.9 : 0.7,
  }));

  const listingEntries = getAllListings().map((listing) => ({
    url: `${site.url}/listings/${listing.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticEntries, ...listingEntries];
}
