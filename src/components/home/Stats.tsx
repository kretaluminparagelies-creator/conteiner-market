/**
 * @file Stats.tsx
 * @description Home page value highlights (5 selling points)
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Handshake, Layers, ShieldCheck, Truck, Wrench, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  HighlightDetailPanel,
  type HighlightDetailContent,
} from "@/components/home/HighlightDetailPanel";
import { highlightItemKeys, type HighlightItemKey } from "@/lib/constants/home";
import { useLocale } from "@/lib/i18n/locale-context";
import { useInView } from "@/lib/hooks/useInView";

const highlightIcons: Record<HighlightItemKey, LucideIcon> = {
  conversions: Wrench,
  prices: Handshake,
  variety: Layers,
  certification: ShieldCheck,
  delivery: Truck,
};

const highlightThemes: Record<
  HighlightItemKey,
  { topBar: string; iconWrap: string; iconColor: string; glow: string }
> = {
  conversions: {
    topBar: "from-cm-accent via-[#f08848] to-cm-accent/0",
    iconWrap:
      "border-cm-accent/35 bg-linear-to-br from-cm-accent/18 to-cm-accent/6 shadow-[0_8px_20px_-8px_rgba(224,112,48,0.55)]",
    iconColor: "text-cm-accent",
    glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(224,112,48,0.14),transparent_68%)]",
  },
  prices: {
    topBar: "from-emerald-500 via-emerald-400 to-emerald-500/0",
    iconWrap:
      "border-emerald-500/30 bg-linear-to-br from-emerald-500/16 to-emerald-500/5 shadow-[0_8px_20px_-8px_rgba(16,185,129,0.45)]",
    iconColor: "text-emerald-600",
    glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_68%)]",
  },
  variety: {
    topBar: "from-cm-rent via-[#5ab0e8] to-cm-rent/0",
    iconWrap:
      "border-cm-rent/35 bg-linear-to-br from-cm-rent/18 to-cm-rent/6 shadow-[0_8px_20px_-8px_rgba(74,176,232,0.45)]",
    iconColor: "text-cm-rent",
    glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(74,176,232,0.14),transparent_68%)]",
  },
  certification: {
    topBar: "from-indigo-500 via-violet-400 to-indigo-500/0",
    iconWrap:
      "border-indigo-400/30 bg-linear-to-br from-indigo-500/16 to-indigo-500/5 shadow-[0_8px_20px_-8px_rgba(99,102,241,0.4)]",
    iconColor: "text-indigo-600",
    glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.12),transparent_68%)]",
  },
  delivery: {
    topBar: "from-amber-500 via-orange-400 to-amber-500/0",
    iconWrap:
      "border-amber-500/35 bg-linear-to-br from-amber-500/18 to-amber-500/6 shadow-[0_8px_20px_-8px_rgba(245,158,11,0.45)]",
    iconColor: "text-amber-600",
    glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.13),transparent_68%)]",
  },
};

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
  const [activeKey, setActiveKey] = useState<HighlightItemKey | null>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  const detailsMap = t.stats.details as Partial<Record<HighlightItemKey, HighlightDetailContent>>;
  const activeDetail = activeKey ? getHighlightDetail(detailsMap, activeKey) : null;

  useEffect(() => {
    if (!activeKey) return;

    let openScrollY = window.scrollY;
    let armed = false;
    let armTimer: number | undefined;
    let scrollTimer: number | undefined;

    const armDismiss = () => {
      openScrollY = window.scrollY;
      armed = true;
    };

    scrollTimer = window.setTimeout(() => {
      const panel = detailPanelRef.current;
      if (panel) {
        scrollHighlightPanelIntoView(panel, reduceMotion ? "auto" : "smooth");
      }
      armTimer = window.setTimeout(armDismiss, reduceMotion ? 80 : 700);
    }, 320);

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
      if (armTimer !== undefined) clearTimeout(armTimer);
      if (scrollTimer !== undefined) clearTimeout(scrollTimer);
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, [activeKey, reduceMotion]);

  const handleCardClick = (key: HighlightItemKey) => {
    if (!getHighlightDetail(detailsMap, key)) return;
    setActiveKey((current) => (current === key ? null : key));
  };

  const grid = (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-3.5">
        {highlightItemKeys.map((key, index) => {
          const item = t.stats.items[key];
          const Icon = highlightIcons[key];
          const theme = highlightThemes[key];
          const number = String(index + 1).padStart(2, "0");
          const hasDetail = Boolean(getHighlightDetail(detailsMap, key));
          const isActive = activeKey === key;

          return (
            <motion.button
              key={key}
              type="button"
              disabled={!hasDetail}
              aria-expanded={isActive}
              onClick={() => handleCardClick(key)}
              initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.94 }}
              animate={
                visible
                  ? { opacity: 1, y: 0, scale: 1 }
                  : reduceMotion
                    ? undefined
                    : { opacity: 0, y: 22, scale: 0.94 }
              }
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : {
                      type: "spring",
                      stiffness: 130,
                      damping: 22,
                      mass: 0.85,
                      delay: (embedded ? 0.12 : 0) + index * 0.07,
                    }
              }
              whileHover={
                reduceMotion || !hasDetail ? undefined : { y: -5, transition: { duration: 0.22 } }
              }
              className={[
                "category-card-shine glass-category group relative flex min-h-[108px] flex-col items-center overflow-hidden text-center",
                "rounded-2xl border px-3 py-4 shadow-cm-light-md transition-[border-color,box-shadow,ring-color] duration-300",
                "md:min-h-[116px] md:px-3.5 md:py-4",
                hasDetail
                  ? "cursor-pointer hover:border-white hover:shadow-[0_16px_40px_-12px_rgba(14,24,40,0.18)]"
                  : "cursor-default border-white/80",
                isActive
                  ? "border-cm-accent/50 ring-2 ring-cm-accent/30 shadow-[0_16px_40px_-12px_rgba(224,112,48,0.22)]"
                  : "border-white/80",
              ].join(" ")}
            >
              <div
                aria-hidden="true"
                className={[
                  "absolute inset-x-0 top-0 h-[3px] bg-linear-to-r opacity-90",
                  theme.topBar,
                ].join(" ")}
              />
              <div
                aria-hidden="true"
                className={["pointer-events-none absolute inset-0", theme.glow].join(" ")}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-2 right-2 font-display text-[2rem] leading-none font-bold text-cm-ink/[0.04] md:text-[2.25rem]"
              >
                {number}
              </span>

              <span
                className={[
                  "relative z-[2] inline-flex h-9 w-9 items-center justify-center rounded-xl border",
                  "transition-transform duration-300 group-hover:scale-105",
                  theme.iconWrap,
                ].join(" ")}
              >
                <Icon
                  className={["h-4 w-4", theme.iconColor].join(" ")}
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
              </span>

              <p className="relative z-[2] mt-2.5 font-display text-[11px] leading-snug font-bold text-cm-ink md:text-xs">
                {item.title}
              </p>
              <p className="relative z-[2] mt-1 max-w-[13.5rem] text-[10px] leading-snug text-cm-ink-sub md:max-w-[14rem] md:text-[11px] md:leading-snug">
                {item.detail}
              </p>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeKey && activeDetail ? (
          <HighlightDetailPanel
            key={activeKey}
            ref={detailPanelRef}
            detail={activeDetail}
            topBarClass={highlightThemes[activeKey].topBar}
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
      className="home-mesh-alt relative overflow-hidden border-y border-cm-light-border-strong/70 px-[6%] py-8 md:py-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(224,112,48,0.06),transparent_42%)]"
      />
      <div className="relative mx-auto max-w-6xl">{grid}</div>
    </div>
  );
}
