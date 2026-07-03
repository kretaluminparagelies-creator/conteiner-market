/**
 * @file motion.ts
 * @description CSS transition helpers for scroll animations
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { CSSProperties } from "react";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function fadeUpStyle(visible: boolean, delay = 0): CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.7s ${delay}s, transform 0.7s ${delay}s ${EASE}`,
  };
}

export function slideInStyle(visible: boolean, delay = 0): CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : "translateX(-32px)",
    transition: `opacity 0.7s ${delay + 0.2}s, transform 0.7s ${delay + 0.2}s ${EASE}`,
  };
}

export function heroEnterStyle(ready: boolean, delay: number): CSSProperties {
  return {
    opacity: ready ? 1 : 0,
    transform: ready ? "none" : "translateY(36px)",
    transition: `opacity 0.8s ${delay}s, transform 0.8s ${delay}s ${EASE}`,
  };
}
