/**
 * @file HighlightCardsMobile.tsx
 * @description Mobile-only horizontal highlight cards row (< md)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { HighlightCardMobile } from "@/components/home/HighlightCardMobile";
import type { HighlightDetailContent } from "@/components/home/HighlightDetailPanel";
import { highlightIcons, highlightThemes } from "@/components/home/highlight-config";
import { highlightItemKeys, type HighlightItemKey } from "@/lib/constants/home";

type HighlightCardsMobileProps = {
  items: Record<HighlightItemKey, { title: string; detail: string }>;
  detailsMap: Partial<Record<HighlightItemKey, HighlightDetailContent>>;
  activeKey: HighlightItemKey | null;
  onCardClick: (key: HighlightItemKey) => void;
  hasDetail: (key: HighlightItemKey) => boolean;
};

export function HighlightCardsMobile({
  items,
  detailsMap,
  activeKey,
  onCardClick,
  hasDetail,
}: HighlightCardsMobileProps) {
  return (
    <div
      className={[
        "-mx-[6%] flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-[6%] pb-1",
        "scroll-px-[6%] touch-pan-x overscroll-x-contain",
        "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      ].join(" ")}
    >
      {highlightItemKeys.map((key, index) => {
        const item = items[key];
        const Icon = highlightIcons[key];
        const theme = highlightThemes[key];

        return (
          <HighlightCardMobile
            key={key}
            index={index}
            title={item.title}
            detail={item.detail}
            theme={theme}
            Icon={Icon}
            isActive={activeKey === key}
            hasDetail={Boolean(detailsMap[key]) && hasDetail(key)}
            onClick={() => onCardClick(key)}
          />
        );
      })}
    </div>
  );
}
