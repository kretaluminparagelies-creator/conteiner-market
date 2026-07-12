/**
 * @file Footer.tsx
 * @description Site footer with legal links and branding
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { BrandHomeLink } from "@/components/layout/BrandHomeLink";
import { FooterLink } from "@/components/layout/FooterLink";
import { useLocale } from "@/lib/i18n/locale-context";
import { useLightNavSurface } from "@/lib/nav/use-light-nav-surface";
import { site } from "@/lib/constants/site";
import { appVersionLabel } from "@/lib/constants/version";

type FooterProps = {
  compact?: boolean;
};

export function Footer({ compact = false }: FooterProps) {
  const { t } = useLocale();
  const isLightFooter = useLightNavSurface();

  const footerLegal = [
    { href: "/help", label: t.footer.help },
    { href: "/oroi", label: t.footer.terms },
    { href: "/aporrito", label: t.footer.privacy },
    { href: "/cookies", label: t.footer.cookies },
    { href: "/epistrofes", label: t.footer.returns },
  ];

  if (compact) {
    return (
      <footer
        className={[
          "shrink-0 border-t px-[6%] py-2.5",
          "border-white/35 bg-white/90 text-cm-ink backdrop-blur-sm",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 sm:flex-row sm:gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {footerLegal.map((item) => (
              <FooterLink key={item.href} href={item.href} label={item.label} />
            ))}
          </div>
          <div className="font-mono text-[10px] text-cm-ink-muted">
            © {site.copyrightYear} {site.author} · {t.footer.country} · {appVersionLabel}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={[
        "flex flex-col items-center gap-5 border-t px-[6%] py-8",
        isLightFooter
          ? "border-cm-light-border-strong bg-white text-cm-ink"
          : "border-cm-border/80 bg-linear-to-b from-[#152438] to-[#0e1828]",
      ].join(" ")}
    >
      <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative z-10 font-display text-[15px] font-bold">
          {isLightFooter ? (
            <BrandHomeLink
              aria-label="Container Market — Αρχική"
              className="nav-brand-chip nav-brand-chip--elevated inline-flex cursor-pointer items-center px-2.5 py-1.5 transition-shadow hover:shadow-[0_6px_22px_rgba(23,37,56,0.28)]"
            >
              <span className="text-cm-brand-red">CONTAINER</span>
              <span className="font-light text-white/78">MARKET</span>
            </BrandHomeLink>
          ) : (
            <BrandHomeLink
              aria-label="Container Market — Αρχική"
              className="inline-flex cursor-pointer transition-opacity hover:opacity-90"
            >
              <span className="text-cm-accent">CONTAINER</span>
              <span className="font-light text-cm-sub">MARKET</span>
            </BrandHomeLink>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {footerLegal.map((item) => (
            <FooterLink key={item.href} href={item.href} label={item.label} />
          ))}
        </div>

        <div
          className={[
            "font-mono text-[11px]",
            isLightFooter ? "text-cm-ink-muted" : "text-cm-muted",
          ].join(" ")}
        >
          © {site.copyrightYear} {site.author} · {t.footer.country}
        </div>
      </div>
    </footer>
  );
}
