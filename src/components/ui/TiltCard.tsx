/**
 * @file TiltCard.tsx
 * @description Card wrapper with 3D tilt hover effect
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import type { CSSProperties, ReactNode } from "react";
import { offTilt, onTilt } from "@/lib/utils/tilt";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  showTopBar?: boolean;
};

export function TiltCard({ children, className = "", style, showTopBar = false }: TiltCardProps) {
  return (
    <div
      className={`tilt-card ${className}`}
      style={style}
      onMouseMove={onTilt}
      onMouseLeave={offTilt}
    >
      {showTopBar ? <div className="top-bar" aria-hidden="true" /> : null}
      {children}
    </div>
  );
}
