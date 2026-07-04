/**
 * @file HomeCTA.tsx
 * @description Call-to-action section on the home page
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/locale-context";

export function HomeCTA() {
  const { t } = useLocale();

  return (
    <section className="border-t border-cm-light-border bg-cm-light-surf px-[6%] py-24 text-center">
      <p className="mb-5 font-mono text-[10px] tracking-[0.25em] text-cm-accent uppercase">
        {t.cta.eyebrow}
      </p>
      <h2 className="mx-auto mb-5 max-w-3xl font-display text-[clamp(1.75rem,5.5vw,4rem)] leading-[1.1] font-bold text-cm-ink">
        {t.cta.titleLine1}
        <br />
        {t.cta.titleLine2}
      </h2>
      <p className="mx-auto mb-11 max-w-xl text-base font-light text-cm-ink-sub">{t.cta.body}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/listings" className="px-11 py-4 text-base">
          {t.cta.browse}
        </Button>
        <Button href="/epikoinonia" variant="secondary" className="px-11 py-4 text-base">
          {t.cta.contact}
        </Button>
      </div>
    </section>
  );
}
