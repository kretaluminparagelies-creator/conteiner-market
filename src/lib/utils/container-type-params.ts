/**
 * @file container-type-params.ts
 * @description Parse / serialize container type filter URL params
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { isKnownContainerTypeId } from "@/lib/constants/container-types";

export function parseContainerTypeParam(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter((id) => isKnownContainerTypeId(id));
}

export function serializeContainerTypeParam(ids: string[]): string | undefined {
  const valid = ids.filter((id) => isKnownContainerTypeId(id));
  return valid.length > 0 ? valid.join(",") : undefined;
}
