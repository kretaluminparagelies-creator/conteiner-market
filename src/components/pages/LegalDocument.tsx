/**
 * @file LegalDocument.tsx
 * @description Renders structured legal sections (terms, privacy, cookies)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { LegalSection } from "@/lib/content/legal-el";

type LegalDocumentProps = {
  siteName: string;
  title: string;
  intro?: string;
  sections: LegalSection[];
  lastUpdated: string;
  lastUpdatedLabel: string;
  companyName: string;
};

export function LegalDocument({
  siteName,
  title,
  intro,
  sections,
  lastUpdated,
  lastUpdatedLabel,
  companyName,
}: LegalDocumentProps) {
  return (
    <section className="px-[6%] py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-cm-accent uppercase">
          {siteName}
        </p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{title}</h1>
        {intro ? <p className="mt-6 text-lg font-light text-cm-sub">{intro}</p> : null}
        <p className="mt-4 font-mono text-[11px] text-cm-muted">
          {lastUpdatedLabel}: {lastUpdated} · {companyName}
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <article key={section.id} id={section.id}>
              <h2 className="font-display text-xl font-bold text-cm-text">{section.title}</h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-cm-sub">
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-cm-sub">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.paragraphsAfterBullets?.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-cm-sub">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
