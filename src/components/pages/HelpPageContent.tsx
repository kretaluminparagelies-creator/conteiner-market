/**
 * @file HelpPageContent.tsx
 * @description FAQ / help page content
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { InfoPhotoLayout } from "@/components/pages/InfoPhotoLayout";
import { useLocale } from "@/lib/i18n/locale-context";

export function HelpPageContent() {
  const { t } = useLocale();

  return (
    <InfoPhotoLayout backLabel={t.pages.contact.backToHome}>
      <p className="mb-3 inline-flex w-fit items-center rounded-full border border-cm-ink-muted/35 bg-cm-light-elevated px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.18em] text-cm-ink-sub uppercase">
        {t.help.eyebrow}
      </p>
      <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight text-cm-ink">
        {t.help.title}
      </h1>
      <p className="mt-4 text-base leading-relaxed font-semibold text-cm-ink-sub">{t.help.intro}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/listings"
          className="inline-flex items-center rounded-[6px] bg-cm-accent px-5 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-[#f08848]"
        >
          {t.help.listingsCta}
        </Link>
        <Link
          href="/epikoinonia?intent=inquiry"
          className="inline-flex items-center rounded-[6px] border border-cm-light-border-strong bg-white/90 px-5 py-2.5 font-display text-sm font-semibold text-cm-ink transition-colors hover:border-cm-accent hover:text-cm-accent"
        >
          {t.help.contactCta}
        </Link>
      </div>

      <div className="mt-10 space-y-3">
        {t.help.items.map((item) => (
          <details
            key={item.question}
            className="group rounded-xl border border-cm-light-border-strong bg-white/95 open:border-cm-accent/45"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-display text-[15px] font-semibold text-cm-ink marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 font-mono text-cm-accent transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="border-t border-cm-light-border-strong/80 px-5 pt-3 pb-4 text-sm leading-relaxed text-cm-ink-sub">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </InfoPhotoLayout>
  );
}
