/**
 * @file en.ts
 * @description English UI strings
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { Locale } from "@/lib/i18n/types";
import type { Messages } from "@/lib/i18n/messages/el";

export const en: Messages = {
  meta: {
    lang: "en" as Locale,
    localeLabel: "EN",
  },
  language: {
    switchTo: "Ελληνικά",
    ariaLabel: "Change language",
    help: "Greek / English — click to switch",
  },
  nav: {
    ariaLabel: "Main navigation",
    buy: "Buy",
    sell: "Sell",
    rent: "Rent",
    listings: "Offers",
    contact: "Contact",
  },
  footer: {
    country: "Greece",
    help: "Help",
    terms: "Terms",
    privacy: "Privacy",
    cookies: "Cookies",
  },
  hero: {
    ticker:
      "20FT DRY  ·  40FT HIGH CUBE  ·  REEFER  ·  OPEN TOP  ·  FLAT RACK  ·  SIDE OPENER  ·  ISO TANK  ·  45FT  ·  " +
      "USED CONTAINER OFFERS  ·  STORAGE SPACE RENTAL  ·  CARGO WORTHY  ·  WIND & WATERTIGHT  ·  " +
      "DELIVERY NATIONWIDE  ·  500+ AVAILABLE  ·  32 PORTS & WAREHOUSES  ·  ONE-WAY LEASING  ·  " +
      "INSTANT QUOTE  ·  CONTAINER MARKET GR  ·  ",
    eyebrow: "Containers from us",
    words: ["Buy", "Sell", "Rent"],
    subtitleLine1: "We sell and rent our own containers across Greece.",
    subtitleLine2: "Direct contact. No middlemen.",
    scroll: "SCROLL",
  },
  categories: {
    eyebrow: "What you need",
    title: "Find what you're looking for",
    items: [
      {
        tag: "BUY",
        title: "Buy",
        description:
          "Buy our containers — new and used. Direct pricing, no middlemen.",
        note: "320+ available",
        href: "/agora",
      },
      {
        tag: "SELL",
        title: "Sell",
        description: "Sell your container — instant valuation and competitive offer.",
        note: "Instant quote",
        href: "/polisi",
      },
      {
        tag: "RENT",
        title: "Rent",
        description:
          "Rent our containers — flexible terms from 1 month. Dry, reefer, open top.",
        note: "180+ for rent",
        href: "/enoikiasi",
      },
    ],
  },
  stats: {
    containers: "Containers",
    clients: "Clients",
    years: "Years of experience",
    hubs: "Ports & warehouses",
  },
  listings: {
    eyebrow: "Available",
    title: "Offers",
    viewAll: "View all →",
    sale: "Sale",
    rent: "Rent",
    detailClose: "Close",
    detailContact: "Contact",
    detailDescription: "Description",
    catalogHint:
      "Our containers — filter by special offers, new, used, or rent. Swipe or tap, click the center card for details.",
    noResults: "No containers match these criteria.",
    noTabResults: "No containers in this category.",
    clearFilters: "Clear filters",
    resultsHint: "Search results",
    backToListings: "← Back to offers",
    viewPage: "Full page →",
    offerBadge: "Offer",
    tabs: {
      ariaLabel: "Catalog filters",
      offers: "Offers",
      new: "New",
      used: "Used",
      rent: "Rent",
    },
  },
  heroSearch: {
    title: "Find a container",
    dealLabel: "Type",
    dealAll: "Buy & Rent",
    sale: "Buy",
    rent: "Rent",
    sizeLabel: "Size",
    sizeAll: "All sizes",
    submit: "Search",
  },
  help: {
    eyebrow: "Help",
    title: "Frequently asked questions",
    intro:
      "How to find our containers for sale or rent and contact us directly.",
    contactCta: "Contact",
    listingsCta: "Browse offers",
    items: [
      {
        question: "How do I find a container?",
        answer:
          "On the home page, use the search bar (Type + Size) or open «Offers» in the menu. Filter by buy or rent and size (20ft, 40ft, 45ft).",
      },
      {
        question: "What do Buy and Rent mean?",
        answer:
          "Buy = purchase the container. Rent = lease for as long as you need (e.g. per month). Offers show price and unit (/month for rent).",
      },
      {
        question: "How do I see offer details?",
        answer:
          "In the carousel, click the center card for a modal, or open the full page (/listings/[slug], e.g. /listings/20ft-dry-peiraias) with photos, price, condition, and description — ideal for sharing or AI agents.",
      },
      {
        question: "How do I contact you?",
        answer:
          "Use «Contact» in the menu or in the offer modal. Email or call us — no middlemen.",
      },
      {
        question: "Are the containers yours?",
        answer:
          "Yes. We sell and rent our own containers — directly from us. We are not a third-party marketplace. See Offers for what we have available.",
      },
      {
        question: "Can I sell my container to you?",
        answer:
          "Yes. Visit the «Sell» page to request a quote — we buy containers from individuals and businesses.",
      },
      {
        question: "Do you rent storage space?",
        answer:
          "Yes. See «Space rental» for storage in container yards and warehouses.",
      },
      {
        question: "What does location on an offer mean?",
        answer:
          "All containers are at our headquarters — we deliver nationwide. We do not filter by city; location shows where we operate from.",
      },
      {
        question: "Why are there no photos?",
        answer:
          "Photos are being updated. Until then a container icon is shown. Ask us for photos of a specific offer.",
      },
    ],
  },
  howItWorks: {
    eyebrow: "Process",
    title: "How it works",
    steps: [
      {
        number: "01",
        title: "Search",
        body: "Filter by type and size. Find exactly what you need.",
      },
      {
        number: "02",
        title: "Contact",
        body: "Talk to us directly — no middlemen, no hidden fees.",
      },
      {
        number: "03",
        title: "Close the deal",
        body: "Complete the transaction safely and receive the container at your site.",
      },
    ],
  },
  cta: {
    eyebrow: "Get started",
    titleLine1: "Find the container",
    titleLine2: "you need.",
    body: "Our containers, directly from us. No intermediaries.",
    browse: "Browse containers",
    contact: "Contact",
  },
  common: {
    email: "Email",
    phone: "Phone",
    area: "Area",
    lastUpdated: "Last updated",
  },
  siteMeta: {
    tagline: "Buy & Rent Containers — directly from us",
    description:
      "Container Market GR — we sell and rent our own shipping containers across Greece. Direct contact, no middlemen, nationwide delivery.",
  },
  pages: {
    home: {
      metaTitle: "Container Market GR — Buy & Rent Containers",
      metaDescription:
        "Container Market GR — we sell and rent our own shipping containers across Greece. Direct contact, no middlemen.",
    },
    agora: {
      metaTitle: "Buy Containers",
      metaDescription:
        "Buy shipping containers in Greece — new and used 20ft, 40ft, High Cube. Container Market, fast delivery.",
      eyebrow: "Buy",
      title: "Buy containers",
      description:
        "New and used containers for permanent use — storage, logistics, conversions.",
      body: "We sell our own shipping containers — cargo worthy, at competitive prices. Available 20ft, 40ft, High Cube and special types. Browse Offers or contact us for availability, price, and delivery.",
      ctaLabel: "Browse available containers →",
      ctaHref: "/listings",
    },
    enoikiasi: {
      metaTitle: "Rent Containers",
      metaDescription:
        "Rent shipping containers in Greece — dry, reefer, open top. Flexible terms from 1 month. Container Market.",
      eyebrow: "Rent",
      title: "Rent containers",
      description: "Flexible storage and logistics solutions — from 1 month, all types.",
      body: "We rent our own shipping containers — for projects, seasonal needs, or long-term storage. Dry, reefer, open top. Browse Offers or ask us about availability and monthly rates.",
      ctaLabel: "Browse containers for rent →",
      ctaHref: "/listings?tab=rent",
    },
    enoikiasisXoron: {
      metaTitle: "Storage Space Rental",
      metaDescription:
        "Rent storage space in shipping containers — flexible terms, secure storage. Container Market GR.",
      eyebrow: "Space rental",
      title: "Storage space in containers",
      description:
        "Rent space inside a container or in organised storage — ideal for goods, equipment, seasonal needs.",
      body: "We offer flexible storage space rental using shipping containers as storage units. Monthly or long-term terms, access by arrangement, and locations at strategic points across Greece. Contact us for availability, volume, and pricing.",
      ctaLabel: "Request a quote →",
      ctaHref: "/epikoinonia",
    },
    polisi: {
      metaTitle: "Sell Your Container",
      metaDescription:
        "Sell your shipping container in Greece. Container Market — instant valuation, competitive offer, nationwide coverage.",
      eyebrow: "Sell",
      title: "Sell your container",
      description: "Want to sell a container? Send us the details and we will make an offer.",
      body: "Container Market buys shipping containers of all types — dry van, reefer, open top, high cube. We assess condition, propose a fair price, and handle the process simply and transparently.",
      ctaLabel: "Contact us to sell →",
      ctaHref: "/epikoinonia",
    },
    contact: {
      metaTitle: "Contact",
      metaDescription:
        "Contact Container Market for buying, selling, or renting shipping containers in Greece.",
      eyebrow: "Contact",
      title: "Get in touch",
      intro: "For buying, selling, or renting containers — we are here for you.",
      areaValue: "Greece — nationwide coverage",
    },
    listings: {
      metaTitle: "Container Offers",
      metaDescription:
        "Available containers for sale or rent — our own inventory, directly from Container Market GR.",
      schemaName: "Container offers",
    },
    help: {
      metaTitle: "Help & FAQ",
      metaDescription:
        "Container Market GR user guide — search containers, offers, buy, rent, and contact.",
    },
    legal: {
      terms: {
        metaTitle: "Terms of Use",
        metaDescription:
          "Terms of use for Container Market GR — buy, rent containers and storage space from Logiworkpass P.C.",
        title: "Terms of use",
        intro:
          "Terms governing use of the website and our container purchase, rental, and storage space services.",
      },
      privacy: {
        metaTitle: "Privacy Policy",
        metaDescription:
          "Privacy policy and personal data protection (GDPR) — Container Market GR / Logiworkpass P.C.",
        title: "Privacy policy",
        intro: "How we collect, use, and protect your personal data under the GDPR.",
      },
      cookies: {
        metaTitle: "Cookie Policy",
        metaDescription: "Cookie and local storage (localStorage) policy — Container Market GR.",
        title: "Cookie policy",
        intro: "Information about cookies, localStorage, and sessionStorage used on this website.",
      },
    },
  },
};
