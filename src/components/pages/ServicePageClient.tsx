/**
 * @file ServicePageClient.tsx
 * @description Locale-aware service page content
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { ServicePageContent } from "@/components/pages/ServicePageContent";
import { useLocale } from "@/lib/i18n/locale-context";
import type { Messages } from "@/lib/i18n/messages";

type ServicePageKey = "agora" | "enoikiasi" | "enoikiasisXoron" | "polisi";

type ServicePageClientProps = {
  page: ServicePageKey;
};

export function ServicePageClient({ page }: ServicePageClientProps) {
  const { t } = useLocale();
  const content: Messages["pages"][ServicePageKey] = t.pages[page];

  return (
    <ServicePageContent
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      body={content.body}
      ctaLabel={content.ctaLabel}
      ctaHref={content.ctaHref}
    />
  );
}
