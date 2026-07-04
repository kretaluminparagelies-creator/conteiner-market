/**
 * @file ServicePageContent.tsx
 * @description Reusable content layout for service pages (agora, polisi, enoikiasi)
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import Link from "next/link";
import { PhotoPageSection } from "@/components/pages/PhotoPageSection";
import { SellFlowBackLink } from "@/components/pages/SellFlowBackLink";
import { SiteButton } from "@/components/ui/site-button";
import {
  polisiBackgroundImage,
  polisiPhotoImageClass,
  polisiPhotoOverlayFadeClass,
  polisiPhotoOverlayPrimaryClass,
} from "@/lib/constants/home";

type ServicePageContentProps = {
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  note?: string;
  backLink?: string;
  ctaLabel: string;
  ctaHref: string;
  variant?: "default" | "sell-photo";
};

export function ServicePageContent({
  eyebrow,
  title,
  description,
  body,
  note,
  backLink,
  ctaLabel,
  ctaHref,
  variant = "default",
}: ServicePageContentProps) {
  if (variant === "sell-photo") {
    return (
      <PhotoPageSection
        image={polisiBackgroundImage}
        imageClass={polisiPhotoImageClass}
        overlayPrimaryClass={polisiPhotoOverlayPrimaryClass}
        overlayFadeClass={polisiPhotoOverlayFadeClass}
        maxWidth="6xl"
        fillViewport
      >
        {backLink ? <SellFlowBackLink href="/" label={backLink} className="mb-4" /> : null}

        <div className="sell-flow-panel relative overflow-hidden rounded-xl p-5 md:p-7">
          <div className="relative z-[1]">
            <p className="mb-3 inline-flex w-fit items-center rounded-full border border-cm-ink-muted/35 bg-cm-light-elevated px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.18em] text-cm-ink-sub uppercase">
              {eyebrow}
            </p>

            {title ? (
              <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight text-cm-ink">
                {title}
              </h1>
            ) : null}

            <p className={["sell-flow-text", title ? "mt-6" : "mt-2"].join(" ")}>{description}</p>

            {body ? <p className="sell-flow-text mt-5 text-cm-ink-sub">{body}</p> : null}

            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-cm-light-border-strong pt-5">
              {note ? (
                <p className="font-mono text-xs font-bold tracking-wide text-cm-ink-sub">{note}</p>
              ) : null}
              <Link
                href={ctaHref}
                className={[
                  "inline-flex items-center justify-center rounded-[6px] px-8 py-3.5",
                  "font-display text-[15px] font-semibold text-white transition-all duration-200",
                  "bg-cm-ink-sub hover:bg-cm-ink hover:-translate-y-0.5 active:translate-y-0",
                  "shadow-cm-light-md",
                  note ? "ml-auto" : "",
                ].join(" ")}
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </PhotoPageSection>
    );
  }

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
          <SiteButton href={ctaHref}>{ctaLabel}</SiteButton>
        </div>
      </div>
    </section>
  );
}
