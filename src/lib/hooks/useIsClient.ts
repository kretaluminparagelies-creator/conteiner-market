/**
 * @file useIsClient.ts
 * @description True after client hydration — avoids setState-in-effect mount guards
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  return () => {};
}

export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
