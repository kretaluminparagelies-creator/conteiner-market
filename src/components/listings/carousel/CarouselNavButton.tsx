/**
 * @file CarouselNavButton.tsx
 * @description Prev/next control for 3D carousel
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import type { ReactNode } from "react";

type CarouselNavButtonProps = {
  onClick: () => void;
  ariaLabel: string;
  children: ReactNode;
  className?: string;
};

export function CarouselNavButton({
  onClick,
  ariaLabel,
  children,
  className,
}: CarouselNavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        "flex h-11 w-11 items-center justify-center rounded-full",
        "border border-cm-border/60 bg-cm-carousel-visual/95 text-cm-accent backdrop-blur-sm",
        "shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition-colors",
        "hover:border-cm-accent/55 hover:bg-cm-carousel-photo hover:text-cm-text",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
