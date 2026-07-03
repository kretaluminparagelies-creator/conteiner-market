/**
 * @file sitemap.ts
 * @description Dynamic sitemap for Google and AI crawlers
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { MetadataRoute } from "next";
import { site } from "@/lib/constants/site";

const staticRoutes = [
  "",
  "/agora",
  "/prosfores",
  "/polisi",
  "/enoikiasi",
  "/enoikiasis-xoron",
  "/listings",
  "/epikoinonia",
  "/oroi",
  "/aporrito",
  "/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return staticRoutes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/listings" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/listings" ? 0.9 : 0.7,
  }));
}
