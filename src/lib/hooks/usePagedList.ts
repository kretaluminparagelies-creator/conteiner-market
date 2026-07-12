/**
 * @file usePagedList.ts
 * @description Client-side paging for long depot lists
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { useMemo, useState } from "react";

export const DEPOT_LIST_PAGE_SIZE = 30;

type PagedListScroll = {
  bound: number;
  pages: number;
};

export function usePagedList<T>(items: T[], pageSize = DEPOT_LIST_PAGE_SIZE) {
  const [scroll, setScroll] = useState<PagedListScroll>({ bound: items.length, pages: 1 });
  const currentPages = scroll.bound === items.length ? scroll.pages : 1;
  const visibleCount = Math.min(currentPages * pageSize, items.length);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const hasMore = visibleCount < items.length;
  const remaining = Math.max(items.length - visibleCount, 0);
  const nextBatch = Math.min(pageSize, remaining);

  const loadMore = () => {
    setScroll((prev) => {
      const pages = prev.bound === items.length ? prev.pages : 1;
      const nextPages = Math.min(pages + 1, Math.ceil(items.length / pageSize) || 1);
      return { bound: items.length, pages: nextPages };
    });
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
