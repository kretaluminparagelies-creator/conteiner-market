/**
 * @file Categories.tsx
 * @description Service category cards on the home page
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import Image from "next/image";
import { CategoryCards } from "@/components/home/CategoryCards";
import {
  categoriesBackgroundImage,
  homePhotoImageClass,
  homePhotoOverlayFadeClass,
  homePhotoOverlayPrimaryClass,
} from "@/lib/constants/home";
import { useLocale } from "@/lib/i18n/locale-context";
import { useInView } from "@/lib/hooks/useInView";
import { fadeUpStyle } from "@/lib/utils/motion";

export function Categories() {
  const { t } = useLocale();
  const { ref, visible } = useInView<HTMLElement>();

  return (
    <section ref={ref} className="relative isolate overflow-hidden px-[6%] py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={categoriesBackgroundImage}
          alt=""
          fill
          sizes="100vw"
          className={[homePhotoImageClass, "object-[center_45%]"].join(" ")}
        />
      </div>

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 z-[1]",
          homePhotoOverlayPrimaryClass,
        ].join(" ")}
      />
      <div
        aria-hidden="true"
        className={["pointer-events-none absolute inset-0 z-[1]", homePhotoOverlayFadeClass].join(
          " ",
        )}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <p
          className="mb-4 inline-flex w-fit items-center rounded-full border border-cm-accent/40 bg-white/92 px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.18em] text-cm-accent uppercase shadow-cm-light-sm"
          style={fadeUpStyle(visible, 0)}
        >
          {t.categories.eyebrow}
        </p>
        <h2
          className="mb-14 font-display text-[clamp(1.625rem,4vw,2.875rem)] font-bold text-cm-ink drop-shadow-[0_1px_10px_rgba(255,255,255,0.95)]"
          style={fadeUpStyle(visible, 0.1)}
        >
          {t.categories.title}
        </h2>

        <CategoryCards />
      </div>
    </section>
  );
}
