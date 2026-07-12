/**
 * @file pagination.ts
 * @description Shared CRM list pagination helpers
 */

export const CRM_LIST_PAGE_SIZE = 30;

export type PaginatedSlice<T> = {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
  rangeStart: number;
  rangeEnd: number;
  rowOffset: number;
};

export function parsePageParam(raw?: string | null): number {
  const value = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(value) && value >= 1 ? value : 1;
}

export function getPageRange(page: number, pageSize = CRM_LIST_PAGE_SIZE) {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize = CRM_LIST_PAGE_SIZE,
): PaginatedSlice<T> {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items,
    page: safePage,
    totalPages,
    total,
    rangeStart: total === 0 ? 0 : start + 1,
    rangeEnd: total === 0 ? 0 : Math.min(start + items.length, total),
    rowOffset: start,
  };
}

export function paginateSlice<T>(
  items: T[],
  page: number,
  pageSize = CRM_LIST_PAGE_SIZE,
): PaginatedSlice<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    total,
    rangeStart: total === 0 ? 0 : start + 1,
    rangeEnd: Math.min(start + pageSize, total),
    rowOffset: start,
  };
}

export function buildPageSearchParams(
  current: URLSearchParams | { toString(): string } | string,
  page: number,
): string {
  const params = new URLSearchParams(
    typeof current === "string" ? current : current.toString(),
  );

  if (page <= 1) {
    params.delete("page");
  } else {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function buildCrmListHref(pathname: string, params: URLSearchParams, page: number) {
  return `${pathname}${buildPageSearchParams(params, page)}`;
}

export function setSearchParam(params: URLSearchParams, key: string, value?: string | null) {
  const trimmed = value?.trim();
  if (trimmed) {
    params.set(key, trimmed);
  } else {
    params.delete(key);
  }
}

export function paginationPropsFromSlice<T>(slice: PaginatedSlice<T>, pathname: string, params: URLSearchParams) {
  return {
    page: slice.page,
    totalPages: slice.totalPages,
    total: slice.total,
    rangeStart: slice.rangeStart,
    rangeEnd: slice.rangeEnd,
    canPrev: slice.page > 1,
    canNext: slice.page < slice.totalPages,
    prevHref:
      slice.page > 1 ? buildCrmListHref(pathname, params, slice.page - 1) : null,
    nextHref:
      slice.page < slice.totalPages
        ? buildCrmListHref(pathname, params, slice.page + 1)
        : null,
  };
}
