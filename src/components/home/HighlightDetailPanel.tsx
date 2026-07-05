/**
 * @file HighlightDetailPanel.tsx
 * @description Expanded copy panel for home highlight cards
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { motion, useReducedMotion } from "motion/react";
import { forwardRef } from "react";
import { SiteButton } from "@/components/ui/site-button";

export type HighlightDetailContent = {
  number: string;
  title: string;
  subtitle: string;
  intro: string;
  bulletsIntro: string;
  bullets: string[];
  outro: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type HighlightDetailPanelProps = {
  detail: HighlightDetailContent;
  topBarClass: string;
  quickMotion?: boolean;
};

export const HighlightDetailPanel = forwardRef<HTMLDivElement, HighlightDetailPanelProps>(
  function HighlightDetailPanel({ detail, topBarClass, quickMotion = false }, ref) {
  const reduceMotion = useReducedMotion();
  const fast = quickMotion || reduceMotion;

  return (
    <motion.div
      ref={ref}
      initial={fast ? false : { opacity: 0, y: 16, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={fast ? undefined : { opacity: 0, y: 10, height: 0 }}
      transition={
        fast
          ? { duration: 0.01 }
          : { type: "spring", stiffness: 140, damping: 24, mass: 0.9 }
      }
      className="scroll-mt-[calc(60px+0.75rem)] overflow-hidden"
    >
      <div
        className={[
          "glass-category relative mt-4 overflow-hidden rounded-2xl border border-white/80 p-5 shadow-cm-light-lg md:p-7",
          quickMotion ? "max-md:bg-white/96 max-md:shadow-cm-light-md max-md:[backdrop-filter:none] max-md:[-webkit-backdrop-filter:none]" : "",
        ].join(" ")}
      >
        <div
          aria-hidden="true"
          className={["absolute inset-x-0 top-0 h-1 bg-linear-to-r opacity-90", topBarClass].join(" ")}
        />

        <div className="relative z-[1]">
          <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-cm-accent uppercase">
            {detail.number}
          </p>
          <h3 className="mt-2 font-display text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold leading-tight text-cm-ink">
            {detail.title}
          </h3>
          <p className="mt-2 text-sm font-semibold text-cm-ink-sub md:text-base">{detail.subtitle}</p>

          <p className="mt-4 text-sm leading-[1.75] text-cm-ink-sub md:text-[15px]">{detail.intro}</p>

          <p className="mt-5 font-display text-sm font-bold text-cm-ink">{detail.bulletsIntro}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {detail.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2 text-sm leading-snug text-cm-ink-sub md:text-[15px]"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cm-accent" aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 border-t border-cm-light-border-strong/80 pt-4 text-sm leading-[1.75] text-cm-ink-sub md:text-[15px]">
            {detail.outro}
          </p>

          {detail.ctaLabel && detail.ctaHref ? (
            <div className="mt-6">
              <SiteButton href={detail.ctaHref} className="px-6 py-3 text-sm">
                {detail.ctaLabel}
              </SiteButton>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
},
);
