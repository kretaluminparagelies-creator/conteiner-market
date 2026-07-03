/**
 * @file LocaleHead.tsx
 * @description Updates document title & description when locale changes (client-side)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import type { Messages } from "@/lib/i18n/messages";
import { site } from "@/lib/constants/site";

type PageMeta = {
  title: string;
  description: string;
};

function pickMeta(page: { metaTitle: string; metaDescription: string }): PageMeta {
  return {
    title: page.metaTitle,
    description: page.metaDescription,
  };
}

function resolvePageMeta(pathname: string, t: Messages): PageMeta {
  const pages = t.pages;

  if (pathname === "/") return pickMeta(pages.home);
  if (pathname === "/agora") return pickMeta(pages.agora);
  if (pathname === "/enoikiasi") return pickMeta(pages.enoikiasi);
  if (pathname === "/enoikiasis-xoron") return pickMeta(pages.enoikiasisXoron);
  if (pathname === "/polisi") return pickMeta(pages.polisi);
  if (pathname === "/epikoinonia") return pickMeta(pages.contact);
  if (pathname === "/listings") return pickMeta(pages.listings);
  if (pathname === "/help") return pickMeta(pages.help);
  if (pathname === "/oroi") return pickMeta(pages.legal.terms);
  if (pathname === "/aporrito") return pickMeta(pages.legal.privacy);
  if (pathname === "/cookies") return pickMeta(pages.legal.cookies);

  return {
    title: `${site.nameFull} — ${t.siteMeta.tagline}`,
    description: t.siteMeta.description,
  };
}

function formatTitle(title: string, pathname: string): string {
  if (pathname === "/") return title;
  return `${title} | ${site.name}`;
}

export function LocaleHead() {
  const pathname = usePathname();
  const { locale, t } = useLocale();

  useEffect(() => {
    if (pathname.startsWith("/listings/") && pathname.length > "/listings/".length) {
      return;
    }

    const meta = resolvePageMeta(pathname, t);
    document.title = formatTitle(meta.title, pathname);

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute("content", meta.description);
  }, [pathname, locale, t]);

  return null;
}
