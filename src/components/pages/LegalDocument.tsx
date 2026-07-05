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
    <>
      <p className="mb-3 inline-flex w-fit items-center rounded-full border border-cm-ink-muted/35 bg-cm-light-elevated px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.18em] text-cm-ink-sub uppercase">
        {siteName}
      </p>
      <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight text-cm-ink">
        {title}
      </h1>
      {intro ? <p className="mt-4 text-base leading-relaxed font-semibold text-cm-ink-sub">{intro}</p> : null}
      <p className="mt-4 font-mono text-[11px] text-cm-ink-muted">
        {lastUpdatedLabel}: {lastUpdated} · {companyName}
      </p>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <article key={section.id} id={section.id}>
            <h2 className="font-display text-xl font-bold text-cm-ink">{section.title}</h2>
            <div className="mt-4 space-y-4">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-cm-ink-sub">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-cm-ink-sub">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.paragraphsAfterBullets?.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-cm-ink-sub">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
