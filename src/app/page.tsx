/**
 * @file page.tsx
 * @description Home page — full landing with CSS animations
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { Categories } from "@/components/home/Categories";
import { Hero } from "@/components/home/Hero";
import { HomeCTA } from "@/components/home/HomeCTA";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ListingsPreview } from "@/components/home/ListingsPreview";
import { Stats } from "@/components/home/Stats";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/constants/site";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.nameFull,
  url: site.url,
  description: site.description,
  inLanguage: site.language,
  publisher: {
    "@type": "Organization",
    name: site.nameFull,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${site.url}/listings?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <PageShell>
      <JsonLd data={websiteSchema} />
      <Hero />
      <Categories />
      <Stats />
      <ListingsPreview />
      <HowItWorks />
      <HomeCTA />
    </PageShell>
  );
}
