/**
 * @file ServicePageContent.tsx
 * @description Reusable content layout for service pages (agora, polisi, enoikiasi)
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import { Button } from "@/components/ui/Button";

type ServicePageContentProps = {
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export function ServicePageContent({
  eyebrow,
  title,
  description,
  body,
  ctaLabel,
  ctaHref,
}: ServicePageContentProps) {
  return (
    <section className="px-[6%] py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-cm-accent uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{title}</h1>
        <p className="mt-6 text-lg font-light text-cm-sub">{description}</p>
        <p className="mt-8 text-[15px] leading-8 text-cm-sub">{body}</p>
        <div className="mt-10">
          <Button href={ctaHref}>{ctaLabel}</Button>
        </div>
      </div>
    </section>
  );
}
