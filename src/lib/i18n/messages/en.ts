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
    returns: "Returns",
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
        title: "",
        description: "Buy our containers — new and used. Direct pricing, no middlemen.",
        note: "320+ available",
        href: "/agora",
      },
      {
        tag: "SELL",
        title: "",
        description:
          "Have a container you no longer use? Send us the details and photos, our team evaluates it immediately and gives you a competitive offer within 24 hours. We handle pickup — you simply close the deal.",
        note: "Instant quote",
        href: "/polisi",
      },
      {
        tag: "RENT",
        title: "",
        description:
          "Need storage space or a special container without committing to a purchase? We offer rental with flexible terms from 1 month and up, in dry, reefer and open top types, depending on your intended use. An ideal solution for seasonal needs, projects or temporary storage.",
        note: "180+ for rent",
        href: "/enoikiasi",
      },
    ],
  },
  stats: {
    items: {
      conversions: {
        title: "Certified conversions",
        detail: "High-quality functional solutions tailored to every application",
      },
      prices: {
        title: "Direct from us",
        detail: "No middlemen. Better pricing and immediate service.",
      },
      variety: {
        title: "Large availability",
        detail: "Hundreds of options in new and used containers.",
      },
      certification: {
        title: "Guaranteed quality",
        detail: "Every container is delivered after rigorous technical inspection.",
      },
      delivery: {
        title: "Fast delivery",
        detail: "Immediate dispatch from our available stock nationwide across Greece.",
      },
      monthlyRental: {
        title: "Monthly Container & Space Rental",
        detail:
          "Ideal for stable storage or professional use. Rent a container and/or outdoor space from 1 month upwards, with flexible renewal.",
      },
    },
    details: {
      conversions: {
        number: "01",
        title: "Certified conversions",
        subtitle: "We build the container exactly the way you need it",
        intro:
          "We deliver professional container conversions for every use — from simple modifications to complete custom builds.",
        bulletsIntro: "Our work can include:",
        bullets: [
          "Door and window installation",
          "Security roller shutters",
          "Insulation and lining",
          "Electrical installation",
          "Lighting and ventilation",
          "Shelving and storage systems",
          "Painting and special builds",
        ],
        outro: "Every conversion is carried out with a focus on quality, safety, and functionality.",
      },
      prices: {
        number: "02",
        title: "The lowest prices",
        subtitle: "Excellent value for money",
        intro:
          "We supply containers directly from our company, with no unnecessary middlemen.",
        bulletsIntro: "That means we can offer:",
        bullets: [
          "Competitive pricing",
          "Consistent availability",
          "Transparent quotes with no hidden fees",
          "Proposals tailored to each customer's needs",
        ],
        outro: "Our goal is for you to get the right container at the best possible value.",
      },
      variety: {
        number: "03",
        title: "Wide selection",
        subtitle: "A container for every need",
        intro: "We offer a large range of containers for purchase or rent.",
        bulletsIntro: "You can choose from:",
        bullets: [
          "New containers",
          "Used containers",
          "Dry containers",
          "High cube",
          "Reefer",
          "Open top",
          "Flat rack",
          "Side opener",
          "Tank containers",
        ],
        outro:
          "Different sizes and solutions for transport, storage, or professional use.",
      },
      certification: {
        number: "04",
        title: "Certified quality",
        subtitle: "Every container is inspected before delivery",
        intro:
          "Before every sale or rental, a technical inspection ensures the container meets high quality standards.",
        bulletsIntro: "The inspection covers:",
        bullets: [
          "Structural condition",
          "Weather-tightness",
          "Doors and locking mechanisms",
          "Floor",
          "Overall functionality",
        ],
        outro: "Our goal is for every customer to receive a reliable and safe container.",
      },
      delivery: {
        number: "05",
        title: "Immediate delivery",
        subtitle: "Fast service across Greece",
        intro:
          "We maintain available stock so most orders are fulfilled without long delays.",
        bulletsIntro: "We offer:",
        bullets: [
          "Immediate availability of selected containers",
          "Transport arranged to your site",
          "Delivery throughout Greece",
          "Ongoing updates on your order progress",
        ],
        outro:
          "Our team ensures your container arrives quickly and safely at its destination.",
      },
      monthlyRental: {
        number: "06",
        title: "Monthly Container & Space Rental",
        subtitle: "Stable / long-term rental",
        intro:
          "This option is for customers who need a reliable space for medium- or long-term use. It suits storage of goods, equipment, or professional needs. Duration is flexible, with a minimum commitment of 1 month and the option to extend without renegotiation.",
        bulletsIntro: "Key features:",
        bullets: [
          "Minimum duration: 1 month",
          "Container or open yard space",
          "Fixed monthly rate",
          "Renewal without interruption",
          "Suitable for professional use or storage",
        ],
        outro:
          "Clearly distinct from short-term options — ideal when you need stability and a predictable monthly cost.",
        ctaLabel: "Request a monthly rental quote",
        ctaHref: "/epikoinonia?intent=inquiry",
      },
    },
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
    peerSelect: "View {type}",
    detailActiveIn: "{type} · {category}",
    sectionEyebrow: "Available containers",
    sectionSubtitle: "Find the container you're looking for",
    tabs: {
      ariaLabel: "Catalog filters",
      offers: "Offers",
      new: "New",
      used: "Used",
      rent: "Rent",
      navOffers: "Offers",
      navNew: "New",
      navUsed: "Used",
      navRent: "Rent",
    },
  },
  heroSearch: {
    title: "Find a container",
    dealLabel: "Deal",
    dealAll: "All",
    sale: "Buy",
    rent: "Rent",
    containerTypeLabel: "Container type",
    containerTypeAll: "All types",
    containerTypePick: "Select types",
    containerTypesSelected: "{count} types selected",
    clearSelection: "Clear selection",
    sizeLabel: "Size",
    sizeAll: "All sizes",
    submit: "Search",
    activeFilters: "Filters",
    clearFilters: "Clear",
    containerTypeInfo: {
      infoAria: "Type information",
      iso: "ISO",
      internalDims: "Internal dimensions (L×W×H)",
      volume: "Volume",
      tare: "Tare weight",
      payload: "Payload",
      notes: "Notes",
    },
  },
  help: {
    eyebrow: "Help",
    title: "Frequently asked questions",
    intro: "How to find our containers for sale or rent and contact us directly.",
    contactCta: "Contact",
    listingsCta: "Browse offers",
    items: [
      {
        question: "How do I find a container?",
        answer:
          "On the home page, use the search bar (Deal + Container type) or open «Offers» in the menu. Pick one or more types (20DC, 40HC, Reefer, etc.) — the (i) icon next to each type shows dimensions, volume, and typical uses.",
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
        answer: "Use «Contact» in the menu or in the offer modal. Email or call us — no middlemen.",
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
        answer: "Yes. See «Space rental» for storage in container yards and warehouses.",
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
    name: "Name",
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
      description: "New and used containers for permanent use — storage, logistics, conversions.",
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
      eyebrow: "SELL",
      title: "",
      description:
        "Have a container you no longer use? Send us the details and photos, our team evaluates it immediately and gives you a competitive offer within 24 hours. We handle pickup — you simply close the deal.",
      body: "",
      note: "Instant quote",
      backLink: "Back to home",
      ctaLabel: "Contact us to sell →",
      ctaHref: "/epikoinonia?intent=sell",
    },
    contact: {
      metaTitle: "Contact",
      metaDescription:
        "Contact Container Market for buying, selling, or renting shipping containers in Greece.",
      eyebrow: "Contact",
      title: "Get in touch",
      intro: "For buying, selling, or renting containers — we are here for you.",
      sellEyebrow: "SELL",
      sellTitle: "Sell your container",
      sellIntro:
        "Send us your container details and photos — our team will get back to you with an offer within 24 hours.",
      backToPolisi: "Back to sell",
      backToHome: "Back to home",
      inquiryEyebrow: "CONTACT",
      inquiryTitle: "Interested in a container?",
      inquiryIntro:
        "For buying or renting — tell us what you need and we will get back to you soon with availability and pricing.",
      formInterestLabel: "I am interested in",
      formInterestBuy: "Purchase",
      formInterestRent: "Rental",
      formInterestBoth: "Purchase & rental",
      areaValue: "Greece — nationwide coverage",
      formTitle: "Contact form",
      formMessage: "Message",
      formSubmit: "Send",
      formSuccess: "Your message was sent. We will get back to you soon.",
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
      returns: {
        metaTitle: "Returns & Withdrawal Policy",
        metaDescription:
          "14-day withdrawal right, return conditions, and refunds — Container Market GR / Logiworkpass P.C.",
        title: "Returns & withdrawal policy",
        intro:
          "How to exercise your right of withdrawal, when returns are accepted, and when refunds are issued.",
      },
    },
  },
};
