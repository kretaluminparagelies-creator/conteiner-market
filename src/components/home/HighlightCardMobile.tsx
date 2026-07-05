/**
 * @file HighlightCardMobile.tsx
 * @description Lightweight highlight card for mobile — no Motion runtime
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { LucideIcon } from "lucide-react";
import type { HighlightTheme } from "@/components/home/highlight-config";

type HighlightCardMobileProps = {
  index: number;
  title: string;
  detail: string;
  theme: HighlightTheme;
  Icon: LucideIcon;
  isActive: boolean;
  hasDetail: boolean;
  onClick: () => void;
};

export function HighlightCardMobile({
  index,
  title,
  detail,
  theme,
  Icon,
  isActive,
  hasDetail,
  onClick,
}: HighlightCardMobileProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <button
      type="button"
      disabled={!hasDetail}
      aria-expanded={isActive}
      onClick={onClick}
      className={[
        "category-card-shine group relative flex h-[124px] w-[11rem] shrink-0 snap-center flex-col items-center overflow-hidden text-center",
        "rounded-2xl border bg-white/94 px-2.5 py-3 shadow-cm-light-md",
        "transition-[border-color,box-shadow] duration-150",
        hasDetail ? "cursor-pointer active:border-white/90" : "cursor-default border-white/80",
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
        className="pointer-events-none absolute top-2 right-2 font-display text-[2rem] leading-none font-bold text-cm-ink/[0.04]"
      >
        {number}
      </span>

      <span
        className={[
          "relative z-[2] inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
          theme.iconWrap,
        ].join(" ")}
      >
        <Icon className={["h-4 w-4", theme.iconColor].join(" ")} strokeWidth={2.25} aria-hidden />
      </span>

      <div className="relative z-[2] mt-2.5 flex w-full min-h-0 flex-1 flex-col px-0.5">
        <p className="line-clamp-2 font-display text-[10px] leading-snug font-bold text-cm-ink">
          {title}
        </p>
        <p className="mt-1 line-clamp-2 text-[9px] leading-snug text-cm-ink-sub">{detail}</p>
      </div>
    </button>
  );
}
