/**
 * @file robots.ts
 * @description Robots.txt — Google, Bing, AI crawlers
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { MetadataRoute } from "next";
import { site } from "@/lib/constants/site";

const aiAgents = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "cohere-ai",
  "Bytespider",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  const publicAllow = ["/", "/llms.txt", "/ai.txt", "/listings", "/help", "/epikoinonia"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: publicAllow,
        disallow: ["/admin/"],
      },
      ...aiAgents.map((userAgent) => ({
        userAgent,
        allow: publicAllow,
        disallow: ["/admin/"],
      })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url.replace(/^https?:\/\//, ""),
  };
}
