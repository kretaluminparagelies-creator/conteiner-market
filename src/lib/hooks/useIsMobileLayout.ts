/**
 * @file useIsMobileLayout.ts
 * @description Match sub-md breakpoint (mobile / tablet portrait layout)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useSyncExternalStore } from "react";

const mobileLayoutQuery = "(max-width: 767px)";

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia(mobileLayoutQuery);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(mobileLayoutQuery).matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobileLayout() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
