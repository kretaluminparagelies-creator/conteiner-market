/**
 * @file HighlightCardButton.tsx
 * @description Single highlight card — desktop and mobile variants
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import type { HighlightTheme } from "@/components/home/highlight-config";

type HighlightCardButtonProps = {
  index: number;
  title: string;
  detail: string;
  theme: HighlightTheme;
  Icon: LucideIcon;
  isActive: boolean;
  hasDetail: boolean;
  visible: boolean;
  reduceMotion: boolean;
  embedded: boolean;
  variant: "desktop" | "mobile";
  onClick: () => void;
};

export function HighlightCardButton({
  index,
  title,
  detail,
  theme,
  Icon,
  isActive,
  hasDetail,
  visible,
  reduceMotion,
  embedded,
  variant,
  onClick,
}: HighlightCardButtonProps) {
  const number = String(index + 1).padStart(2, "0");
  const isDesktop = variant === "desktop";
  const skipEntrance = !isDesktop || reduceMotion;

  return (
    <motion.button
      type="button"
      disabled={!hasDetail}
      aria-expanded={isActive}
      onClick={onClick}
      initial={skipEntrance ? false : { opacity: 0, y: 22, scale: 0.94 }}
      animate={
        visible
          ? { opacity: 1, y: 0, scale: 1 }
          : skipEntrance
            ? undefined
            : { opacity: 0, y: 22, scale: 0.94 }
      }
      transition={
        skipEntrance
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
        isDesktop && !reduceMotion && hasDetail
          ? { y: -5, transition: { duration: 0.22 } }
          : undefined
      }
      className={[
        "category-card-shine glass-category group relative flex flex-col items-center overflow-hidden text-center",
        "rounded-2xl border shadow-cm-light-md transition-[border-color,box-shadow,ring-color] duration-300",
        isDesktop
          ? "min-h-[112px] px-2 py-3"
          : "h-[124px] w-[11rem] shrink-0 snap-center px-2.5 py-3",
        hasDetail
          ? isDesktop
            ? "cursor-pointer hover:border-white hover:shadow-[0_16px_40px_-12px_rgba(14,24,40,0.18)]"
            : "cursor-pointer active:border-white/90"
          : "cursor-default border-white/80",
        isActive
          ? "border-cm-accent/50 ring-2 ring-cm-accent/30 shadow-[0_16px_40px_-12px_rgba(224,112,48,0.22)]"
          : "border-white/80",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={["absolute inset-x-0 top-0 h-[3px] bg-linear-to-r opacity-90", theme.topBar].join(" ")}
      />
      <div
        aria-hidden="true"
        className={["pointer-events-none absolute inset-0", theme.glow].join(" ")}
      />
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute top-2 right-2 font-display leading-none font-bold text-cm-ink/[0.04]",
          isDesktop ? "text-[2.25rem]" : "text-[2rem]",
        ].join(" ")}
      >
        {number}
      </span>

      <span
        className={[
          "relative z-[2] inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
          isDesktop ? "transition-transform duration-300 group-hover:scale-105" : "",
          theme.iconWrap,
        ].join(" ")}
      >
        <Icon
          className={["h-4 w-4", theme.iconColor].join(" ")}
          strokeWidth={2.25}
          aria-hidden
        />
      </span>

      <div className={["relative z-[2] mt-2.5 flex w-full min-h-0 flex-1 flex-col", isDesktop ? "" : "px-0.5"].join(" ")}>
        <p
          className={[
            "font-display font-bold leading-snug text-cm-ink",
            isDesktop
              ? "line-clamp-3 text-[11px]"
              : "line-clamp-2 text-[10px]",
          ].join(" ")}
        >
          {title}
        </p>
        <p
          className={[
            "mt-1 leading-snug text-cm-ink-sub",
            isDesktop
              ? "line-clamp-3 text-[10px] md:leading-snug"
              : "line-clamp-2 text-[9px]",
          ].join(" ")}
        >
          {detail}
        </p>
      </div>
    </motion.button>
  );
}
