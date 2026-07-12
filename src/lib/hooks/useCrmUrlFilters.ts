/**
 * @file useCrmUrlFilters.ts
 * @description Push CRM filter changes to URL (resets page)
 */

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useCrmUrlFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return { pathname, searchParams, pushParams };
}
