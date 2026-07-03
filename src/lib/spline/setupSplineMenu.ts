/**
 * @file setupSplineMenu.ts
 * @description Runtime setup for Spline service menu — clicks, fixed camera, no zoom
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { Application, SplineEvent } from "@splinetool/runtime";
import { resolveSplineMenuRouteFromEvent, splineMenu } from "@/lib/constants/spline-menu";

export type SplineNavigateHandler = (href: string) => void;

const LOCKED_ZOOM = splineMenu.lockedZoom;

function buildObjectNamesById(app: Application): Map<string, string> {
  return new Map(app.getAllObjects().map((obj) => [obj.uuid, obj.name]));
}

type OrbitControlsLike = {
  enableZoom?: boolean;
  enablePan?: boolean;
  enableRotate?: boolean;
  zoomSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
  getDistance?: () => number;
};

function lockCameraZoom(app: Application) {
  try {
    app.setZoom(LOCKED_ZOOM);
  } catch {
    /* setZoom unsupported in some runtime builds */
  }

  const controls = app.controls as OrbitControlsLike | undefined;
  if (!controls) return;

  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableRotate = false;
  controls.zoomSpeed = 0;

  const distance = controls.getDistance?.();
  if (typeof distance === "number" && Number.isFinite(distance)) {
    controls.minDistance = distance;
    controls.maxDistance = distance;
  }
}

export function setupSplineMenu(app: Application, onNavigate: SplineNavigateHandler) {
  app.setBackgroundColor(splineMenu.backgroundColor);
  app.setGlobalEvents(true);
  lockCameraZoom(app);

  const objectNamesById = buildObjectNamesById(app);

  const blockWheel = (event: WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();
    lockCameraZoom(app);
  };

  const blockGesture = (event: Event) => {
    event.preventDefault();
    lockCameraZoom(app);
  };

  const canvas = app.canvas;
  canvas.addEventListener("wheel", blockWheel, { passive: false, capture: true });
  canvas.addEventListener("gesturestart", blockGesture, { passive: false, capture: true });
  canvas.addEventListener("gesturechange", blockGesture, { passive: false, capture: true });
  canvas.addEventListener("gestureend", blockGesture, { passive: false, capture: true });

  const handlePointer = (event: SplineEvent) => {
    const href = resolveSplineMenuRouteFromEvent(event, objectNamesById);
    if (href) onNavigate(href);
  };

  const handleScroll = () => {
    lockCameraZoom(app);
  };

  app.addEventListener("mouseDown", handlePointer);
  app.addEventListener("scroll", handleScroll);

  return () => {
    app.removeEventListener("mouseDown", handlePointer);
    app.removeEventListener("scroll", handleScroll);
    canvas.removeEventListener("wheel", blockWheel, { capture: true });
    canvas.removeEventListener("gesturestart", blockGesture, { capture: true });
    canvas.removeEventListener("gesturechange", blockGesture, { capture: true });
    canvas.removeEventListener("gestureend", blockGesture, { capture: true });
  };
}

export { lockCameraZoom };
