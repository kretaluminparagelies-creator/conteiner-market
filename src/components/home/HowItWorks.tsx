/**
 * @file HowItWorks.tsx
 * @description Process steps section on the home page
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import { useInView } from "@/lib/hooks/useInView";
import { fadeUpStyle, slideInStyle } from "@/lib/utils/motion";

export function HowItWorks() {
  const { t } = useLocale();
  const { ref, visible } = useInView<HTMLElement>({ threshold: 0.05 });

  return (
    <section ref={ref} className="bg-cm-light-bg px-[6%] py-24">
      <div className="mx-auto max-w-[820px]">
        <p
          className="mb-4 font-mono text-[10px] tracking-[0.25em] text-cm-accent uppercase"
          style={fadeUpStyle(visible, 0)}
        >
          {t.howItWorks.eyebrow}
        </p>
        <h2
          className="mb-16 font-display text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold text-cm-ink md:mb-[72px]"
          style={fadeUpStyle(visible, 0.1)}
        >
          {t.howItWorks.title}
        </h2>

        {t.howItWorks.steps.map((step, index) => (
          <div
            key={step.number}
            className={[
              "grid grid-cols-[72px_1fr] gap-7",
              index < t.howItWorks.steps.length - 1
                ? "mb-12 border-b border-cm-light-border pb-12"
                : "",
            ].join(" ")}
            style={slideInStyle(visible, index * 0.2)}
          >
            <div className="pt-1 font-display text-[52px] leading-none font-bold text-cm-light-border">
              {step.number}
            </div>
            <div>
              <h3 className="mb-2.5 font-display text-[22px] font-bold text-cm-ink">{step.title}</h3>
              <p className="text-[15px] leading-[1.85] text-cm-ink-sub">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
