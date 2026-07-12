/**
 * @file usePagedList.ts
 * @description Client-side paging for long depot lists
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { useEffect, useMemo, useState } from "react";

export const DEPOT_LIST_PAGE_SIZE = 30;

export function usePagedList<T>(items: T[], pageSize = DEPOT_LIST_PAGE_SIZE) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const hasMore = visibleCount < items.length;
  const remaining = Math.max(items.length - visibleCount, 0);
  const nextBatch = Math.min(pageSize, remaining);

  const loadMore = () => {
    setVisibleCount((count) => Math.min(count + pageSize, items.length));
  };

  return {
    visibleItems,
    hasMore,
    loadMore,
    total: items.length,
    shown: visibleItems.length,
    nextBatch,
  };
}
