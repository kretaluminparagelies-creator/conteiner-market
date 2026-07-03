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
    listings: "Catalog",
    contact: "Contact",
  },
  footer: {
    country: "Greece",
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
    eyebrow: "Greek container market",
    words: ["Buy", "Sell", "Rent"],
    subtitleLine1: "Container Market GR — shipping containers in Greece.",
    subtitleLine2: "Direct contact. No middlemen.",
    scroll: "SCROLL",
  },
  spline: {
    offers: "Container offers",
    spaceRent: "Space rental",
    quickLinksAria: "Quick service selection",
    touchHint: "Tap to choose",
    touchHintAria: "Interactive 3D menu — tap to select a service",
    clickHint: "Click to choose",
    clickHintAria: "Interactive 3D menu — click to select a service",
  },
  categories: {
    eyebrow: "What you need",
    title: "Find what you're looking for",
    items: [
      {
        tag: "BUY",
        title: "Buy",
        description:
          "New & used containers for permanent purchase. Direct pricing from our company.",
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
          "Flexible terms from 1 month. Reefers, open top, dry — all types available.",
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
    title: "Available containers",
    viewAll: "View all →",
    sale: "Sale",
    rent: "Rent",
  },
  howItWorks: {
    eyebrow: "Process",
    title: "How it works",
    steps: [
      {
        number: "01",
        title: "Search",
        body: "Filter by type, size, location and condition. Find exactly what you need.",
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
    body: "Dozens of available units. Direct contact. No intermediaries.",
    browse: "Browse containers",
    contact: "Contact",
  },
};
