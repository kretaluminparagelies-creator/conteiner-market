/**
 * @file container.ts
 * @description Container dimensions and colors — edit here to tweak the 3D/SVG model
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

/** Normalized 20ft container proportions (length : width : height ≈ 6.1 : 2.44 : 2.59) */
export const container20ft = {
  length: 2.44,
  width: 1,
  height: 1.06,
  corrugationCount: 11,
  corrugationDepth: 0.035,
  corrugationWidth: 0.14,
  cornerSize: 0.09,
  doorInset: 0.04,
  rotationSpeed: 0.35,
  doorOpenAngle: 1.35,
  doorAnimSpeed: 4.5,
  doorStaggerThreshold: 0.65,
  doorCloseThreshold: 0.25,
  /** Y rotation so the door end faces the hero camera when opening */
  faceCameraYaw: -Math.PI / 4,
  faceCameraLerp: 3.5,
} as const;

export const containerColors = {
  body: "#2a4870",
  bodyDark: "#1a3050",
  door: "#243d58",
  accent: "#e07030",
  accentSoft: "#4ab0e8",
  edge: "#e07030",
  metalHighlight: "#3a6080",
} as const;
