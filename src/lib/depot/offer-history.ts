/**
 * @file offer-history.ts
 * @description Group depot offer dispatches by container for history UI
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { representativeDisplayLabel } from "@/lib/depot/filter-representatives";
import type { DepotContainer, DepotDispatch } from "@/lib/depot/types";

export type ContainerOfferHistory = {
  container: DepotContainer;
  dispatches: DepotDispatch[];
  latestDispatch: DepotDispatch;
};

export function formatDepotDispatchDate(iso: string): string {
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function dispatchRecipientLabel(dispatch: DepotDispatch): string {
  if (dispatch.representative) {
    return representativeDisplayLabel(dispatch.representative);
  }
  return "—";
}

export function buildContainerOfferHistories(
  containers: DepotContainer[],
  dispatches: DepotDispatch[],
): ContainerOfferHistory[] {
  const containerById = new Map(containers.map((item) => [item.id, item]));
  const byContainer = new Map<string, DepotDispatch[]>();

  for (const dispatch of dispatches) {
    if (dispatch.dispatchType !== "offer") continue;
    const list = byContainer.get(dispatch.containerId) ?? [];
    list.push(dispatch);
    byContainer.set(dispatch.containerId, list);
  }

  const histories: ContainerOfferHistory[] = [];

  for (const [containerId, list] of byContainer) {
    const sorted = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const container = sorted[0]?.container ?? containerById.get(containerId);
    if (!container || !sorted[0]) continue;

    histories.push({
      container,
      dispatches: sorted,
      latestDispatch: sorted[0],
    });
  }

  return histories.sort((a, b) =>
    b.latestDispatch.createdAt.localeCompare(a.latestDispatch.createdAt),
  );
}
