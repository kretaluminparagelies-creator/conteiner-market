/**
 * @file tilt.ts
 * @description 3D tilt handlers for interactive cards
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { MouseEvent } from "react";

export function onTilt(event: MouseEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  event.currentTarget.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(10px)`;
}

export function offTilt(event: MouseEvent<HTMLElement>) {
  event.currentTarget.style.transform = "perspective(700px) rotateX(0) rotateY(0) translateZ(0)";
}
