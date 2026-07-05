/**
 * @file ContactPhotoLayout.tsx
 * @description Shared photo-background layout for sell & inquiry contact flows
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { ReactNode } from "react";
import { PhotoPageSection } from "@/components/pages/PhotoPageSection";
import { SellFlowBackLink } from "@/components/pages/SellFlowBackLink";
import { site } from "@/lib/constants/site";
import {
  polisiBackgroundImage,
  polisiPhotoImageClass,
  polisiPhotoOverlayFadeClass,
  polisiPhotoOverlayPrimaryClass,
} from "@/lib/constants/home";

type ContactPhotoLayoutProps = {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  intro: string;
  emailLabel: string;
  phoneLabel: string;
  areaLabel: string;
  areaValue: string;
  contactPhone: string;
  form: ReactNode;
};

export function ContactPhotoLayout({
  backHref,
  backLabel,
  eyebrow,
  title,
  intro,
  emailLabel,
  phoneLabel,
  areaLabel,
  areaValue,
  contactPhone,
  form,
}: ContactPhotoLayoutProps) {
  return (
    <PhotoPageSection
      image={polisiBackgroundImage}
      imageClass={polisiPhotoImageClass}
      overlayPrimaryClass={polisiPhotoOverlayPrimaryClass}
      overlayFadeClass={polisiPhotoOverlayFadeClass}
      maxWidth="6xl"
      fillViewport
      fitScreen
    >
      <div className="relative flex h-full min-h-0 flex-col justify-start pt-[4.25rem] pb-6 sm:pt-20 max-md:h-auto max-md:min-h-0 max-md:pb-10">
        <SellFlowBackLink
          href={backHref}
          label={backLabel}
          className="absolute top-6 left-0 z-20 sm:top-7"
        />

        <div className="grid w-full grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-4">
          <div className="sell-flow-panel flex flex-col rounded-xl p-3.5 md:p-4">
            <p className="mb-1.5 inline-flex w-fit items-center rounded-full border border-cm-ink-muted/35 bg-cm-light-elevated px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.16em] text-cm-ink-sub uppercase">
              {eyebrow}
            </p>
            <h1 className="font-display text-[clamp(1.2rem,2vw,1.75rem)] font-bold leading-tight text-cm-ink">
              {title}
            </h1>
            <p className="mt-1.5 text-sm leading-snug font-semibold text-cm-ink">{intro}</p>

            <div className="mt-3 grid gap-2 border-t border-cm-light-border-strong pt-2.5 sm:grid-cols-3 lg:grid-cols-1 lg:gap-1.5">
              <div>
                <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-cm-ink-muted uppercase">
                  {emailLabel}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-cm-ink">
                  <a href={`mailto:${site.contactEmail}`} className="hover:underline">
                    {site.contactEmail}
                  </a>
                </p>
              </div>
              <div>
                <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-cm-ink-muted uppercase">
                  {phoneLabel}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-cm-ink">{contactPhone}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-cm-ink-muted uppercase">
                  {areaLabel}
                </p>
                <p className="mt-0.5 text-sm font-semibold leading-snug text-cm-ink">{areaValue}</p>
              </div>
            </div>
          </div>

          <div className="w-full">{form}</div>
        </div>
      </div>
    </PhotoPageSection>
  );
}
