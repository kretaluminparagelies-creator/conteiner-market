/**
 * @file HighlightAccordionMobile.tsx
 * @description Mobile highlights — vertical accordion, no horizontal carousel
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { ChevronDown } from "lucide-react";
import type { HighlightDetailContent } from "@/components/home/HighlightDetailPanel";
import { highlightIcons, highlightThemes } from "@/components/home/highlight-config";
import { SiteButton } from "@/components/ui/site-button";
import { highlightItemKeys, type HighlightItemKey } from "@/lib/constants/home";
import { cn } from "@/lib/utils";

type HighlightAccordionMobileProps = {
  items: Record<HighlightItemKey, { title: string; detail: string }>;
  detailsMap: Partial<Record<HighlightItemKey, HighlightDetailContent>>;
  activeKey: HighlightItemKey | null;
  onCardClick: (key: HighlightItemKey) => void;
  hasDetail: (key: HighlightItemKey) => boolean;
};

function AccordionDetail({ detail }: { detail: HighlightDetailContent }) {
  return (
    <div className="space-y-4 border-t border-cm-light-border-strong/70 px-4 pb-4 pt-3">
      <div>
        <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-cm-accent uppercase">
          {detail.number}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-cm-ink">{detail.title}</h3>
        <p className="mt-1 text-sm font-semibold text-cm-ink-sub">{detail.subtitle}</p>
      </div>

      <p className="text-sm leading-relaxed text-cm-ink-sub">{detail.intro}</p>

      <div>
        <p className="font-display text-sm font-bold text-cm-ink">{detail.bulletsIntro}</p>
        <ul className="mt-2.5 space-y-2">
          {detail.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2 text-sm leading-snug text-cm-ink-sub">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cm-accent" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm leading-relaxed text-cm-ink-sub">{detail.outro}</p>

      {detail.ctaLabel && detail.ctaHref ? (
        <SiteButton href={detail.ctaHref} className="w-full px-6 py-3 text-sm sm:w-auto">
          {detail.ctaLabel}
        </SiteButton>
      ) : null}
    </div>
  );
}

export function HighlightAccordionMobile({
  items,
  detailsMap,
  activeKey,
  onCardClick,
  hasDetail,
}: HighlightAccordionMobileProps) {
  return (
    <div className="flex flex-col gap-2.5 md:hidden">
      {highlightItemKeys.map((key, index) => {
        const item = items[key];
        const detail = detailsMap[key];
        const Icon = highlightIcons[key];
        const theme = highlightThemes[key];
        const isOpen = activeKey === key;
        const canOpen = Boolean(detail) && hasDetail(key);
        const number = String(index + 1).padStart(2, "0");

        return (
          <article
            key={key}
            className={cn(
              "overflow-hidden rounded-2xl border bg-white shadow-cm-light-sm transition-[border-color,box-shadow] duration-200",
              isOpen
                ? "border-cm-accent/45 shadow-[0_12px_32px_-14px_rgba(224,112,48,0.25)]"
                : "border-white/80",
            )}
          >
            <div
              aria-hidden="true"
              className={cn("h-[3px] bg-linear-to-r opacity-90", theme.topBar)}
            />

            <button
              type="button"
              disabled={!canOpen}
              aria-expanded={isOpen}
              onClick={() => onCardClick(key)}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3.5 text-left",
                canOpen ? "cursor-pointer" : "cursor-default opacity-80",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                  theme.iconWrap,
                )}
              >
                <Icon className={cn("h-[18px] w-[18px]", theme.iconColor)} strokeWidth={2.25} aria-hidden />
              </span>

              <span className="min-w-0 flex-1 pt-0.5">
                <span className="font-mono text-[10px] font-bold tracking-widest text-cm-accent/80">
                  {number}
                </span>
                <span className="mt-0.5 block font-display text-[13px] font-bold leading-snug text-cm-ink">
                  {item.title}
                </span>
                <span className="mt-1 block text-xs leading-snug text-cm-ink-sub">{item.detail}</span>
              </span>

              {canOpen ? (
                <ChevronDown
                  className={cn(
                    "mt-1 h-5 w-5 shrink-0 text-cm-ink-muted transition-transform duration-200",
                    isOpen && "rotate-180 text-cm-accent",
                  )}
                  aria-hidden
                />
              ) : null}
            </button>

            {isOpen && detail ? <AccordionDetail detail={detail} /> : null}
          </article>
        );
      })}
    </div>
  );
}
