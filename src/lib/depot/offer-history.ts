/**
 * @file offer-history.ts
 * @description Group depot offer dispatches by container for history UI
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { representativeDisplayLabel } from "@/lib/depot/filter-representatives";
import { EXTERNAL_DISPATCH_RECIPIENT_LABEL } from "@/lib/depot/types";
import type { DepotContainer, DepotDispatch, DepotRepresentative } from "@/lib/depot/types";

export const EXTERNAL_RECIPIENT_FILTER = "__external__";

export type OfferHistoryFilterState = {
  containerQuery: string;
  representativeId: string;
  recipientQuery: string;
};

export const emptyOfferHistoryFilters: OfferHistoryFilterState = {
  containerQuery: "",
  representativeId: "",
  recipientQuery: "",
};

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
  if (dispatch.recipientLabel?.trim()) {
    return dispatch.recipientLabel.trim();
  }
  return EXTERNAL_DISPATCH_RECIPIENT_LABEL;
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

function dispatchMatchesRecipientFilter(dispatch: DepotDispatch, recipientQuery: string): boolean {
  const needle = recipientQuery.trim().toLowerCase();
  if (!needle) return true;
  return dispatchRecipientLabel(dispatch).toLowerCase().includes(needle);
}

function dispatchMatchesRepresentativeFilter(
  dispatch: DepotDispatch,
  representativeId: string,
): boolean {
  if (!representativeId) return true;
  if (representativeId === EXTERNAL_RECIPIENT_FILTER) {
    return !dispatch.representativeId;
  }
  return dispatch.representativeId === representativeId;
}

export function collectOfferHistoryRepresentatives(
  histories: ContainerOfferHistory[],
): DepotRepresentative[] {
  const byId = new Map<string, DepotRepresentative>();

  for (const history of histories) {
    for (const dispatch of history.dispatches) {
      if (dispatch.representative) {
        byId.set(dispatch.representative.id, dispatch.representative);
      }
    }
  }

  return [...byId.values()].sort((a, b) =>
    representativeDisplayLabel(a).localeCompare(representativeDisplayLabel(b), "el"),
  );
}

export function filterContainerOfferHistories(
  histories: ContainerOfferHistory[],
  filters: OfferHistoryFilterState,
): ContainerOfferHistory[] {
  const containerNeedle = filters.containerQuery.trim().toLowerCase();

  return histories
    .map((history) => {
      const matchingDispatches = history.dispatches.filter(
        (dispatch) =>
          dispatchMatchesRepresentativeFilter(dispatch, filters.representativeId) &&
          dispatchMatchesRecipientFilter(dispatch, filters.recipientQuery),
      );

      if (matchingDispatches.length === 0) return null;

      const container = history.container;
      if (
        containerNeedle &&
        !container.containerNumber.toLowerCase().includes(containerNeedle)
      ) {
        return null;
      }

      return {
        container,
        dispatches: matchingDispatches,
        latestDispatch: matchingDispatches[0]!,
      };
    })
    .filter((item): item is ContainerOfferHistory => item !== null);
}
