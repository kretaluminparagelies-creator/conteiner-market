/**
 * @file ContactPageContent.tsx
 * @description Locale-aware contact page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { ContactLeadForm } from "@/components/pages/ContactLeadForm";
import { useLocale } from "@/lib/i18n/locale-context";

const contactEmail = "info@containermarket.gr";
const contactPhone = "+30 210 000 0000";

export function ContactPageContent() {
  const { t } = useLocale();
  const page = t.pages.contact;

  return (
    <section className="px-[6%] py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-cm-accent uppercase">
          {page.eyebrow}
        </p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{page.title}</h1>
        <p className="mt-6 text-lg font-light text-cm-sub">{page.intro}</p>

        <div className="mt-12 space-y-6 rounded border border-cm-border bg-cm-card p-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-cm-muted uppercase">
              {t.common.email}
            </p>
            <p className="mt-2 text-cm-text">{contactEmail}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-cm-muted uppercase">
              {t.common.phone}
            </p>
            <p className="mt-2 text-cm-text">{contactPhone}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-cm-muted uppercase">
              {t.common.area}
            </p>
            <p className="mt-2 text-cm-text">{page.areaValue}</p>
          </div>
        </div>

        <ContactLeadForm />
      </div>
    </section>
  );
}
