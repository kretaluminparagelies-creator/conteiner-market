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
import { fetchPublicListings } from "@/lib/data/listings-server";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/constants/site";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.nameFull,
  legalName: site.author,
  url: site.url,
  description: site.description,
  areaServed: {
    "@type": "Country",
    name: "Greece",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "info@containermarket.gr",
    availableLanguage: ["Greek", "English"],
    areaServed: "GR",
  },
};

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
    url: site.url,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${site.url}/listings?deal={deal}&size={size}`,
    },
    "query-input": ["required name=deal", "optional name=size"],
  },
};

export default async function HomePage() {
  const homeListings = await fetchPublicListings();

  return (
    <PageShell homeListings={homeListings}>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <Hero />
      <ListingsPreview />
      <Categories />
      <Stats />
      <HowItWorks />
      <HomeCTA />
    </PageShell>
  );
}
