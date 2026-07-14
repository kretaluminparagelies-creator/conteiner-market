/**
 * @file page.tsx
 * @description Home page — full landing with CSS animations
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { Suspense } from "react";
import { Categories } from "@/components/home/Categories";
import { Hero } from "@/components/home/Hero";
import { HomeCTA } from "@/components/home/HomeCTA";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ListingsPreview } from "@/components/home/ListingsPreview";
import { Stats } from "@/components/home/Stats";
import { PageShell } from "@/components/layout/PageShell";
import { fetchPublicListings } from "@/lib/data/listings-server";
import { JsonLd } from "@/components/seo/JsonLd";
import { company } from "@/lib/constants/company";
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
    email: site.contactEmail,
    telephone: site.contactPhone,
    availableLanguage: ["Greek", "English"],
    areaServed: "GR",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.nameFull,
  url: site.url,
  description: site.description,
  email: site.contactEmail,
  telephone: site.contactPhone,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.addressLine,
    postalCode: company.postalCode,
    addressLocality: "Athens",
    addressCountry: "GR",
  },
  areaServed: {
    "@type": "Country",
    name: "Greece",
  },
  priceRange: "€€",
  knowsAbout: [
    "shipping containers",
    "container sales",
    "container rental",
    "storage containers",
    "20ft containers",
    "40ft containers",
  ],
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
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={websiteSchema} />
      <Hero />
      <Suspense fallback={null}>
        <ListingsPreview />
      </Suspense>
      <Categories />
      <Stats />
      <HowItWorks />
      <HomeCTA />
    </PageShell>
  );
}
