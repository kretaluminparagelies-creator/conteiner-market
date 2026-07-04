/**

 * @file HowItWorks.tsx

 * @description Process steps section on the home page

 * @author Katsoulakis

 * @copyright 2025 Katsoulakis. All rights reserved.

 */

"use client";

import Image from "next/image";

import {
  homePhotoImageClass,
  homePhotoOverlayFadeClass,
  homePhotoOverlayPrimaryClass,
  howItWorksBackgroundImage,
} from "@/lib/constants/home";

import { useLocale } from "@/lib/i18n/locale-context";

import { useInView } from "@/lib/hooks/useInView";

import { fadeUpStyle, slideInStyle } from "@/lib/utils/motion";

export function HowItWorks() {
  const { t } = useLocale();

  const { ref, visible } = useInView<HTMLElement>({ threshold: 0.05 });

  return (
    <section ref={ref} className="relative isolate overflow-hidden px-[6%] py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={howItWorksBackgroundImage}

          alt=""

          fill

          sizes="100vw"

          className={[homePhotoImageClass, "object-[center_42%]"].join(" ")}
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

      <div className="relative z-10 mx-auto max-w-[820px]">
        <p
          className="mb-4 inline-flex w-fit items-center rounded-full border border-cm-accent/40 bg-white/92 px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.18em] text-cm-accent uppercase shadow-cm-light-sm"
          style={fadeUpStyle(visible, 0)}
        >
          {t.howItWorks.eyebrow}
        </p>

        <h2
          className="mb-16 font-display text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold text-cm-ink drop-shadow-[0_1px_10px_rgba(255,255,255,0.95)] md:mb-[72px]"

          style={fadeUpStyle(visible, 0.1)}
        >
          {t.howItWorks.title}
        </h2>

        {t.howItWorks.steps.map((step, index) => (
          <div
            key={step.number}

            className={[
              "glass-category rounded-2xl p-6 md:p-8",

              index < t.howItWorks.steps.length - 1 ? "mb-5" : "",
            ].join(" ")}

            style={slideInStyle(visible, index * 0.2)}
          >
            <div className="grid grid-cols-[56px_1fr] gap-6 md:grid-cols-[72px_1fr] md:gap-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cm-accent/10 font-display text-2xl font-bold text-cm-accent md:h-16 md:w-16 md:text-[28px]">
                {step.number}
              </div>

              <div>
                <h3 className="mb-2.5 font-display text-[22px] font-bold text-cm-ink">
                  {step.title}
                </h3>

                <p className="text-[15px] leading-[1.85] text-cm-ink/90">{step.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
