/**
 * @file PhotoPageSection.tsx
 * @description Full-width photo background section for service / contact pages
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Image from "next/image";
import type { ReactNode } from "react";

type PhotoPageSectionProps = {
  image: string;
  imageClass: string;
  overlayPrimaryClass: string;
  overlayFadeClass: string;
  children: ReactNode;
  maxWidth?: "3xl" | "4xl" | "6xl";
  /** Cover viewport below nav (sell / contact photo pages) */
  fillViewport?: boolean;
  /** Lock to parent height — single screen, no page scroll */
  fitScreen?: boolean;
  /** Pinned top-left within section padding (e.g. back link) */
  topNav?: ReactNode;
};

export function PhotoPageSection({
  image,
  imageClass,
  overlayPrimaryClass,
  overlayFadeClass,
  children,
  maxWidth = "3xl",
  fillViewport = false,
  fitScreen = false,
  topNav,
}: PhotoPageSectionProps) {
  const maxWidthClass =
    maxWidth === "6xl" ? "max-w-6xl" : maxWidth === "4xl" ? "max-w-4xl" : "max-w-3xl";

  return (
    <section
      className={[
        "relative isolate px-[6%]",
        fitScreen
          ? "h-full overflow-visible pb-2 max-md:h-auto max-md:min-h-0 max-md:pb-8"
          : "overflow-hidden",
        !fitScreen && fillViewport
          ? "min-h-[calc(100dvh-60px)] pt-5 pb-10 sm:pt-6 sm:pb-12 md:pt-7 md:pb-14"
          : !fitScreen
            ? "py-24 md:py-28"
            : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <Image src={image} alt="" fill sizes="100vw" priority className={imageClass} />
        <div className={overlayPrimaryClass} />
        <div className={overlayFadeClass} />
      </div>

      {topNav ? <div className="absolute top-6 left-[6%] z-20 sm:top-7">{topNav}</div> : null}

      <div className={`relative z-10 mx-auto h-full ${maxWidthClass}`}>{children}</div>
    </section>
  );
}
