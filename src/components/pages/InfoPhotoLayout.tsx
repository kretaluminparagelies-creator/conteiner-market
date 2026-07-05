/**
 * @file InfoPhotoLayout.tsx
 * @description Photo-background layout for help & legal pages (matches contact)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { ReactNode } from "react";
import { PhotoPageSection } from "@/components/pages/PhotoPageSection";
import { SellFlowBackLink } from "@/components/pages/SellFlowBackLink";
import {
  polisiBackgroundImage,
  polisiPhotoImageClass,
  polisiPhotoOverlayFadeClass,
  polisiPhotoOverlayPrimaryClass,
} from "@/lib/constants/home";

type InfoPhotoLayoutProps = {
  backHref?: string;
  backLabel: string;
  children: ReactNode;
  maxWidth?: "3xl" | "4xl" | "6xl";
};

export function InfoPhotoLayout({
  backHref = "/",
  backLabel,
  children,
  maxWidth = "4xl",
}: InfoPhotoLayoutProps) {
  return (
    <div className="h-full min-h-0 overflow-y-auto overscroll-contain">
      <PhotoPageSection
      image={polisiBackgroundImage}
      imageClass={polisiPhotoImageClass}
      overlayPrimaryClass={polisiPhotoOverlayPrimaryClass}
      overlayFadeClass={polisiPhotoOverlayFadeClass}
      maxWidth={maxWidth}
      fillViewport
    >
      <div className="relative pt-[4.25rem] pb-10 sm:pt-20 sm:pb-12">
        <SellFlowBackLink
          href={backHref}
          label={backLabel}
          className="absolute top-6 left-0 z-20 sm:top-7"
        />

        <div className="sell-flow-panel relative overflow-hidden rounded-xl p-5 md:p-7">{children}</div>
      </div>
    </PhotoPageSection>
    </div>
  );
}
