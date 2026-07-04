/**
 * @file HelpPageContent.tsx
 * @description FAQ / help page content
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-context";

export function HelpPageContent() {
  const { t } = useLocale();

  return (
    <section className="px-[6%] py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-cm-accent uppercase">
          {t.help.eyebrow}
        </p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{t.help.title}</h1>
        <p className="mt-6 text-lg font-light text-cm-sub">{t.help.intro}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/listings"
            className="inline-flex items-center rounded-[6px] bg-cm-accent px-5 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-[#f08848]"
          >
            {t.help.listingsCta}
          </Link>
          <Link
            href="/epikoinonia?intent=inquiry"
            className="inline-flex items-center rounded-[6px] border border-cm-border px-5 py-2.5 font-display text-sm font-semibold text-cm-text transition-colors hover:border-cm-accent hover:text-cm-accent"
          >
            {t.help.contactCta}
          </Link>
        </div>

        <div className="mt-12 space-y-4">
          {t.help.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-cm-border bg-cm-card/50 open:border-cm-accent/40"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-display text-[15px] font-semibold text-cm-text marker:content-none [&::-webkit-details-marker]:hidden">
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
              <p className="border-t border-cm-border/60 px-5 pt-3 pb-4 text-sm leading-relaxed text-cm-sub">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
