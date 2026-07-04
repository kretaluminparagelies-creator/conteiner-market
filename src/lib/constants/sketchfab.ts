/**
 * @file sketchfab.ts
 * @description Sketchfab GLB model paths and CC-BY credit
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

export const sketchfabModel = {
  path: "/models/shipping_containers/scene.gltf",
  /** Container node names to hide (scene has 4 — we show one) */
  hiddenNodes: ["Crate.001", "Crate.002", "Crate.003"],
  targetSize: 2.6,
  /** Camera & framing */
  cameraPosition: [6.6, 2.6, 6.6] as const,
  cameraFov: 42,
  modelScale: 0.92,
  faceCameraYaw: -Math.PI / 4,
  faceCameraLerp: 0.55,
  rotationSpeed: 0.15,
  maxFrameDelta: 1 / 30,
  canvasBackground: "#1a3050",
} as const;

export const sketchfabCredit = {
  title: "Shipping containers",
  author: "Mateusz Woliński",
  authorUrl: "https://sketchfab.com/jeandiz",
  modelUrl:
    "https://sketchfab.com/3d-models/shipping-containers-cc3f7136710f4905905eae1d10ac50b7",
  license: "CC-BY-4.0",
  licenseUrl: "http://creativecommons.org/licenses/by/4.0/",
} as const;
