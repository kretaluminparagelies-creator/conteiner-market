/**
 * @file CrmListPaginationBar.tsx
 * @description Server-friendly pagination bar from a paginated slice + base path
 */

import { CrmListPagination } from "@/components/crm/CrmListPagination";
import type { PaginatedSlice } from "@/lib/crm/pagination";
import { paginationPropsFromSlice } from "@/lib/crm/pagination";

type CrmListPaginationBarProps<T> = {
  slice: PaginatedSlice<T>;
  pathname: string;
  searchParams: URLSearchParams;
};

export function CrmListPaginationBar<T>({
  slice,
  pathname,
  searchParams,
}: CrmListPaginationBarProps<T>) {
  return <CrmListPagination {...paginationPropsFromSlice(slice, pathname, searchParams)} />;
}
