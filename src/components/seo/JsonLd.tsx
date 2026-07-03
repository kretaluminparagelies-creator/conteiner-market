/**
 * @file JsonLd.tsx
 * @description Structured data component for SEO and AI discoverability
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
