/**
 * @file filters.ts
 * @description Filter depot containers for field sales
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { DepotContainer, DepotGrade } from "@/lib/depot/types";
import { isDepotAvailable } from "@/lib/depot/status";

export type DepotListFilters = {
  containerType?: string;
  grade?: DepotGrade;
  maxSalePrice?: number;
  query?: string;
};

function matchesType(container: DepotContainer, containerType?: string): boolean {
  if (!containerType) return true;
  return container.containerType === containerType;
}

function matchesGrade(container: DepotContainer, grade?: DepotGrade): boolean {
  if (!grade) return true;
  return container.grade === grade;
}

function matchesSalePrice(container: DepotContainer, maxSalePrice?: number): boolean {
  if (maxSalePrice === undefined) return true;
  if (container.salePrice === undefined) return true;
  return container.salePrice <= maxSalePrice;
}

function matchesQuery(container: DepotContainer, query?: string): boolean {
  if (!query?.trim()) return true;
  const needle = query.trim().toLowerCase();
  return (
    container.containerNumber.toLowerCase().includes(needle) ||
    container.containerType.toLowerCase().includes(needle) ||
    (container.notes?.toLowerCase().includes(needle) ?? false)
  );
}

export function filterAvailableContainers(
  containers: DepotContainer[],
  filters: DepotListFilters = {},
): DepotContainer[] {
  return containers
    .filter((item) => isDepotAvailable(item.status))
    .filter((item) => matchesType(item, filters.containerType))
    .filter((item) => matchesGrade(item, filters.grade))
    .filter((item) => matchesSalePrice(item, filters.maxSalePrice))
    .filter((item) => matchesQuery(item, filters.query))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
