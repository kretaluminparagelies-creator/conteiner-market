/**
 * @file page.tsx
 * @description Help / FAQ page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { HelpPageContent } from "@/components/pages/HelpPageContent";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { el } from "@/lib/i18n/messages/el";
import { createPageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/constants/site";

export const metadata = createPageMetadata({
  title: el.pages.help.metaTitle,
  description: el.pages.help.metaDescription,
  path: "/help",
  keywords: ["βοήθεια κοντέινερ", "FAQ container", "πώς λειτουργεί"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: el.help.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
  url: `${site.url}/help`,
  inLanguage: site.language,
};

export default function HelpPage() {
  return (
    <PageShell>
      <JsonLd data={faqSchema} />
      <HelpPageContent />
    </PageShell>
  );
}
