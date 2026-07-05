/**
 * @file useScrollLock.ts
 * @description Lock page scroll — iOS Safari + Android (position fixed body)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useEffect } from "react";

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const { body, documentElement: html } = document;

    const prev = {
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyTouchAction: body.style.touchAction,
      htmlOverflow: html.style.overflow,
    };

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.touchAction = "none";

    const blockBackgroundTouch = (event: TouchEvent) => {
      const sheet = document.getElementById("highlight-mobile-sheet");
      if (sheet?.contains(event.target as Node)) return;
      event.preventDefault();
    };

    document.addEventListener("touchmove", blockBackgroundTouch, { passive: false });

    return () => {
      document.removeEventListener("touchmove", blockBackgroundTouch);
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      body.style.touchAction = prev.bodyTouchAction;
      html.style.overflow = prev.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
