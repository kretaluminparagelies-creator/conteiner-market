/**
 * @file Footer.tsx
 * @description Site footer with legal links and branding
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { FooterLink } from "@/components/layout/FooterLink";
import { useLocale } from "@/lib/i18n/locale-context";
import { site } from "@/lib/constants/site";

export function Footer() {
  const { t } = useLocale();

  const footerLegal = [
    { href: "/help", label: t.footer.help },
    { href: "/oroi", label: t.footer.terms },
    { href: "/aporrito", label: t.footer.privacy },
    { href: "/cookies", label: t.footer.cookies },
  ];

  return (
    <footer className="flex flex-col items-center gap-5 border-t border-cm-border bg-cm-bg px-[6%] py-8">
      <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="font-display text-[15px] font-bold">
          <span className="text-cm-accent">CONTAINER</span>
          <span className="font-light text-cm-sub">MARKET</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {footerLegal.map((item) => (
            <FooterLink key={item.href} href={item.href} label={item.label} />
          ))}
        </div>

        <div className="font-mono text-[11px] text-cm-muted">
          © {site.copyrightYear} {site.author} · {t.footer.country}
        </div>
      </div>
    </footer>
  );
}
