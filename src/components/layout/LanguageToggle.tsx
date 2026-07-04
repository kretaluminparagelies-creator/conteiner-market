/**
 * @file LanguageToggle.tsx
 * @description Globe icon — switch between Greek and English
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import { useLightNavSurface } from "@/lib/nav/use-light-nav-surface";

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-[18px] w-[18px]"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.8 2.5 14.2 0 18M12 3c-2.5 2.8-2.5 14.2 0 18" />
    </svg>
  );
}

export function LanguageToggle() {
  const { locale, toggleLocale, t } = useLocale();
  const isLightNav = useLightNavSurface();
  const nextLabel = locale === "el" ? "EN" : "ΕΛ";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      title={`${t.language.help} → ${t.language.switchTo}`}
      aria-label={`${t.language.ariaLabel}: ${t.language.switchTo}`}
      className={[
        "flex h-9 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[10px] tracking-[0.12em] transition-colors",
        isLightNav
          ? "border-cm-light-border-strong bg-white text-cm-ink-sub shadow-cm-light-xs hover:border-cm-accent/40 hover:text-cm-ink"
          : "border-cm-border bg-cm-card/60 text-cm-sub hover:border-cm-accent hover:text-cm-text",
      ].join(" ")}
    >
      <GlobeIcon />
      <span className={isLightNav ? "text-cm-ink-muted" : "text-cm-muted"}>
        {t.meta.localeLabel}
      </span>
      <span aria-hidden="true" className={isLightNav ? "text-cm-ink-muted/50" : "text-cm-muted/60"}>
        /
      </span>
      <span className="text-cm-accent">{nextLabel}</span>
    </button>
  );
}
