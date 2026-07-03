/**
 * @file SplineServiceMenu.tsx
 * @description Interactive 3D service picker — Spline dropdown menu
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import type { Application, SplineEvent } from "@splinetool/runtime";
import { resolveSplineMenuRoute, splineMenu } from "@/lib/constants/spline-menu";
import { lockCameraZoom, setupSplineMenu } from "@/lib/spline/setupSplineMenu";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-10 w-10 animate-pulse rounded-full border-2 border-cm-accent/40 border-t-cm-accent" />
    </div>
  ),
});

type SplineServiceMenuProps = {
  className?: string;
  variant?: "hero" | "section";
};

export function SplineServiceMenu({ className, variant = "section" }: SplineServiceMenuProps) {
  const router = useRouter();
  const cleanupRef = useRef<(() => void) | null>(null);
  const appRef = useRef<Application | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const blockWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (appRef.current) lockCameraZoom(appRef.current);
    };

    wrapper.addEventListener("wheel", blockWheel, { passive: false, capture: true });
    return () => wrapper.removeEventListener("wheel", blockWheel, { capture: true });
  }, []);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
      appRef.current = null;
    };
  }, []);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router],
  );

  const handleLoad = useCallback(
    (app: Application) => {
      appRef.current = app;
      cleanupRef.current?.();
      cleanupRef.current = setupSplineMenu(app, navigate);
    },
    [navigate],
  );

  const handleSplineScroll = useCallback(() => {
    if (appRef.current) lockCameraZoom(appRef.current);
  }, []);

  const handleMouseDown = useCallback(
    (event: SplineEvent) => {
      const href = resolveSplineMenuRoute(event.target.name);
      if (href) navigate(href);
    },
    [navigate],
  );

  const heightClass = variant === "hero" ? splineMenu.heroHeightClass : splineMenu.heightClass;

  return (
    <div
      ref={wrapperRef}
      className={[
        "relative touch-none overflow-hidden rounded-xl border border-cm-border bg-cm-bg",
        heightClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Spline
        scene={splineMenu.activeScene}
        onLoad={handleLoad}
        onSplineMouseDown={handleMouseDown}
        onSplineScroll={handleSplineScroll}
        className="pointer-events-auto h-full w-full [&>canvas]:!h-full [&>canvas]:!w-full"
      />
    </div>
  );
}
