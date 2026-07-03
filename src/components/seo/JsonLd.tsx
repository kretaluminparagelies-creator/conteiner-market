/**
 * @file JsonLd.tsx
 * @description Structured data component for SEO and AI discoverability
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { serializeJsonLd } from "@/lib/utils/json-ld";

type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
