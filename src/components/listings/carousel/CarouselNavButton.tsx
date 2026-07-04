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
  surface?: "dark" | "light";
};

export function CarouselNavButton({
  onClick,
  ariaLabel,
  children,
  className,
  surface = "dark",
}: CarouselNavButtonProps) {
  const isLight = surface === "light";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        "flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-sm transition-colors",
        isLight
          ? "border-cm-light-border-strong bg-white text-cm-accent shadow-cm-light-md hover:border-cm-accent/50 hover:bg-white hover:shadow-cm-light-lg"
          : "border-cm-border/60 bg-cm-carousel-visual/95 text-cm-accent shadow-[0_8px_20px_rgba(0,0,0,0.18)] hover:border-cm-accent/55 hover:bg-cm-carousel-photo hover:text-cm-text",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
