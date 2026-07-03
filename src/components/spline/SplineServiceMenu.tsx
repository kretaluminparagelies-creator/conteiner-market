/**
 * @file SplineServiceMenu.tsx
 * @description Interactive 3D service picker — Spline dropdown menu
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Application } from "@splinetool/runtime";
import { splineMenu } from "@/lib/constants/spline-menu";
import { useIsDesktop } from "@/lib/hooks/useIsDesktop";
import { useLocale } from "@/lib/i18n/locale-context";
import { navigateSplineRoute } from "@/lib/spline/navigate-spline-route";
import { lockCameraZoom, setupSplineMenu } from "@/lib/spline/setupSplineMenu";

const SPLINE_HINT_KEY = "cm-spline-hint-seen";
const HINT_AUTO_HIDE_MS = 5500;

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-10 w-10 animate-pulse rounded-full border-2 border-cm-accent/40 border-t-cm-accent" />
    </div>
  ),
});

function TapIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-3.5 w-3.5 animate-tap-nudge text-cm-accent"
    >
      <path d="M8 13V4.5a1.5 1.5 0 0 1 3 0V12" strokeLinecap="round" />
      <path d="M11 11.5V5.5a1.5 1.5 0 0 1 3 0V14" strokeLinecap="round" />
      <path d="M14 13.5V7a1.5 1.5 0 0 1 3 0v7.5a5.5 5.5 0 0 1-11 0V12" strokeLinecap="round" />
    </svg>
  );
}

function ClickIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-3.5 w-3.5 animate-tap-nudge text-cm-accent"
    >
      <path d="M5 3l3.5 3.5L5 10V3z" strokeLinejoin="round" />
      <path d="M8.5 6.5H13a4 4 0 0 1 4 4v6.5a2.5 2.5 0 0 1-5 0V11" strokeLinecap="round" />
    </svg>
  );
}

type SplineServiceMenuProps = {
  className?: string;
  variant?: "hero" | "section";
};

export function SplineServiceMenu({ className, variant = "section" }: SplineServiceMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocale();
  const isDesktop = useIsDesktop(768);
  const cleanupRef = useRef<(() => void) | null>(null);
  const appRef = useRef<Application | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showHintRef = useRef(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintFading, setHintFading] = useState(false);

  useEffect(() => {
    showHintRef.current = showHint;
  }, [showHint]);

  const dismissHint = useCallback(() => {
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    if (!showHintRef.current) return;

    setHintFading(true);
    try {
      window.sessionStorage.setItem(SPLINE_HINT_KEY, "1");
    } catch {
      /* private mode */
    }
    window.setTimeout(() => {
      setShowHint(false);
      setHintFading(false);
    }, 450);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SPLINE_HINT_KEY) === "1";
    } catch {
      /* private mode */
    }
    if (seen) return;

    setShowHint(true);
    hintTimerRef.current = setTimeout(dismissHint, HINT_AUTO_HIDE_MS);

    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, [isLoaded, dismissHint]);

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
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, []);

  const navigate = useCallback(
    (href: string) => {
      navigateSplineRoute(href, pathname, router.push);
    },
    [router, pathname],
  );

  const handleLoad = useCallback(
    (app: Application) => {
      appRef.current = app;
      cleanupRef.current?.();
      cleanupRef.current = setupSplineMenu(app, navigate);
      setIsLoaded(true);
    },
    [navigate],
  );

  const handleSplineScroll = useCallback(() => {
    if (appRef.current) lockCameraZoom(appRef.current);
  }, []);

  const handleMouseDown = useCallback(() => {
    dismissHint();
  }, [dismissHint]);

  const handlePointerDown = useCallback(() => {
    dismissHint();
  }, [dismissHint]);

  const heightClass = variant === "hero" ? splineMenu.heroHeightClass : splineMenu.heightClass;
  const hintLabel = isDesktop ? t.spline.clickHint : t.spline.touchHint;
  const hintAria = isDesktop ? t.spline.clickHintAria : t.spline.touchHintAria;

  return (
    <div
      ref={wrapperRef}
      onPointerDown={handlePointerDown}
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

      {showHint ? (
        <div
          role="status"
          aria-live="polite"
          aria-label={hintAria}
          className={[
            "pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2",
            "flex items-center gap-2 rounded-full border border-cm-border/80",
            "bg-cm-bg/75 px-3 py-1.5 backdrop-blur-sm",
            hintFading ? "animate-hint-fade" : "",
          ].join(" ")}
        >
          {isDesktop ? <ClickIcon /> : <TapIcon />}
          <span className="font-mono text-[9px] tracking-[0.14em] text-cm-sub uppercase">
            {hintLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}
