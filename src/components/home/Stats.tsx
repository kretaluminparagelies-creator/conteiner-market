/**
 * @file Stats.tsx
 * @description Home page value highlights (6 selling points)
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HighlightCardButton } from "@/components/home/HighlightCardButton";
import { HighlightCardsMobile } from "@/components/home/HighlightCardsMobile";
import {
  HighlightDetailPanel,
  type HighlightDetailContent,
} from "@/components/home/HighlightDetailPanel";
import { highlightIcons, highlightThemes } from "@/components/home/highlight-config";
import { highlightItemKeys, type HighlightItemKey } from "@/lib/constants/home";
import { useLocale } from "@/lib/i18n/locale-context";
import { useIsMobileLayout } from "@/lib/hooks/useIsMobileLayout";
import { useInView } from "@/lib/hooks/useInView";

/** Vertical offset from viewport center when a detail panel opens. */
const autoScrollBelowCenterPx = -92;

function scrollHighlightPanelIntoView(el: HTMLElement, behavior: ScrollBehavior) {
  const rect = el.getBoundingClientRect();
  const panelTop = rect.top + window.scrollY;
  const panelCenter = panelTop + rect.height / 2;
  const targetScrollY = panelCenter - window.innerHeight / 2 + autoScrollBelowCenterPx;

  window.scrollTo({ top: Math.max(0, targetScrollY), behavior });
}

type StatsProps = {
  embedded?: boolean;
  visible?: boolean;
};

function getHighlightDetail(
  details: Partial<Record<HighlightItemKey, HighlightDetailContent>> | undefined,
  key: HighlightItemKey,
): HighlightDetailContent | null {
  return details?.[key] ?? null;
}

export function Stats({ embedded = false, visible: visibleProp }: StatsProps) {
  const { t } = useLocale();
  const reduceMotion = useReducedMotion();
  const { ref, visible: ownVisible } = useInView<HTMLDivElement>({ threshold: 0.12 });
  const visible = visibleProp ?? ownVisible;
  const isMobileLayout = useIsMobileLayout();
  const quickMotion = isMobileLayout;
  const [activeKey, setActiveKey] = useState<HighlightItemKey | null>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  const detailsMap = t.stats.details as Partial<Record<HighlightItemKey, HighlightDetailContent>>;
  const activeDetail = activeKey ? getHighlightDetail(detailsMap, activeKey) : null;

  useEffect(() => {
    if (!activeKey || quickMotion) return;

    let openScrollY = window.scrollY;
    let armed = false;
    let armTimer: number | undefined;
    let scrollTimer: number | undefined;
    let scrollRaf: number | undefined;

    const armDismiss = () => {
      openScrollY = window.scrollY;
      armed = true;
    };

    const runScroll = () => {
      const panel = detailPanelRef.current;
      if (panel) {
        scrollHighlightPanelIntoView(panel, quickMotion || reduceMotion ? "auto" : "smooth");
      }
      armTimer = window.setTimeout(armDismiss, quickMotion || reduceMotion ? 120 : 700);
    };

    if (quickMotion) {
      scrollRaf = requestAnimationFrame(runScroll);
    } else {
      scrollTimer = window.setTimeout(runScroll, 320);
    }

    const dismiss = () => setActiveKey(null);

    const onScroll = () => {
      if (!armed) return;
      if (Math.abs(window.scrollY - openScrollY) > 20) dismiss();
    };

    const hero = document.getElementById("home-hero");
    const observer =
      hero &&
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) dismiss();
        },
        { threshold: 0.12 },
      );

    if (hero && observer) observer.observe(hero);

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (scrollRaf !== undefined) cancelAnimationFrame(scrollRaf);
      if (armTimer !== undefined) clearTimeout(armTimer);
      if (scrollTimer !== undefined) clearTimeout(scrollTimer);
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, [activeKey, reduceMotion, quickMotion]);

  const handleCardClick = (key: HighlightItemKey) => {
    if (!getHighlightDetail(detailsMap, key)) return;
    setActiveKey((current) => (current === key ? null : key));
  };

  const hasDetail = (key: HighlightItemKey) => Boolean(getHighlightDetail(detailsMap, key));

  const grid = (
    <>
      <HighlightCardsMobile
        items={t.stats.items}
        detailsMap={detailsMap}
        activeKey={activeKey}
        onCardClick={handleCardClick}
        hasDetail={hasDetail}
      />

      <div className="hidden md:grid md:grid-cols-6 md:gap-2.5 lg:gap-3">
        {highlightItemKeys.map((key, index) => {
          const item = t.stats.items[key];
          const Icon = highlightIcons[key];
          const theme = highlightThemes[key];

          return (
            <HighlightCardButton
              key={key}
              index={index}
              title={item.title}
              detail={item.detail}
              theme={theme}
              Icon={Icon}
              isActive={activeKey === key}
              hasDetail={hasDetail(key)}
              visible={visible}
              reduceMotion={reduceMotion ?? false}
              embedded={embedded}
              variant="desktop"
              onClick={() => handleCardClick(key)}
            />
          );
        })}
      </div>

      <AnimatePresence mode={quickMotion ? "sync" : "wait"}>
        {activeKey && activeDetail ? (
          <HighlightDetailPanel
            key={activeKey}
            ref={detailPanelRef}
            detail={activeDetail}
            topBarClass={highlightThemes[activeKey].topBar}
            quickMotion={quickMotion}
            onDismiss={quickMotion ? () => setActiveKey(null) : undefined}
          />
        ) : null}
      </AnimatePresence>
    </>
  );

  if (embedded) return grid;

  return (
    <div
      ref={ref}
      id="home-highlights"
      className="home-mesh-alt relative max-md:overflow-x-clip md:overflow-hidden border-y border-cm-light-border-strong/70 px-[6%] py-8 md:py-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(224,112,48,0.06),transparent_42%)]"
      />
      <div className="relative mx-auto max-w-7xl">{grid}</div>
    </div>
  );
}
