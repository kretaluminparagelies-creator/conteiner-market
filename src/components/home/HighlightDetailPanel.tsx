/**
 * @file HighlightDetailPanel.tsx
 * @description Expanded copy panel for home highlight cards
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { motion, useReducedMotion } from "motion/react";
import { forwardRef, useEffect, type Ref } from "react";
import { createPortal } from "react-dom";
import { SiteButton } from "@/components/ui/site-button";
import { useIsClient } from "@/lib/hooks/useIsClient";
import { useLocale } from "@/lib/i18n/locale-context";

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
  onDismiss?: () => void;
};

function HighlightDetailBody({
  detail,
  topBarClass,
  quickMotion,
}: Pick<HighlightDetailPanelProps, "detail" | "topBarClass" | "quickMotion">) {
  return (
    <div
      className={[
        "glass-category relative overflow-hidden rounded-2xl border border-white/80 p-5 shadow-cm-light-lg md:p-7",
        quickMotion
          ? "w-full rounded-none rounded-t-2xl border-x-0 border-b-0 bg-white/98 px-[6%] pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-cm-light-md [backdrop-filter:none] [-webkit-backdrop-filter:none] md:rounded-2xl md:border md:border-white/80 md:p-7 md:shadow-cm-light-lg"
          : "",
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
  );
}

function HighlightDetailMobileSheet({
  detail,
  topBarClass,
  onDismiss,
  sheetRef,
}: Pick<HighlightDetailPanelProps, "detail" | "topBarClass" | "onDismiss"> & {
  sheetRef: Ref<HTMLDivElement>;
}) {
  const { t } = useLocale();
  const isClient = useIsClient();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!isClient) return null;

  return createPortal(
    <>
      <button
        type="button"
        aria-label={t.listings.detailClose}
        className="fixed inset-0 z-[190] bg-black/30"
        onClick={onDismiss}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        className="fixed inset-x-0 bottom-0 z-[191] max-h-[min(85dvh,720px)] w-full overflow-y-auto overscroll-contain touch-pan-y"
      >
        <HighlightDetailBody detail={detail} topBarClass={topBarClass} quickMotion />
      </div>
    </>,
    document.body,
  );
}

export const HighlightDetailPanel = forwardRef<HTMLDivElement, HighlightDetailPanelProps>(
  function HighlightDetailPanel({ detail, topBarClass, quickMotion = false, onDismiss }, ref) {
    const reduceMotion = useReducedMotion();
    const fast = quickMotion || reduceMotion;

    if (quickMotion) {
      return (
        <HighlightDetailMobileSheet
          detail={detail}
          topBarClass={topBarClass}
          onDismiss={onDismiss}
          sheetRef={ref}
        />
      );
    }

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
        <div className="mt-4">
          <HighlightDetailBody detail={detail} topBarClass={topBarClass} quickMotion={false} />
        </div>
      </motion.div>
    );
  },
);
