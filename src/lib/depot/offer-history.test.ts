/**
 * @file offer-history.test.ts
 * @description Tests for depot offer history grouping
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildContainerOfferHistories, dispatchRecipientLabel } from "@/lib/depot/offer-history";
import type { DepotContainer, DepotDispatch, DepotRepresentative } from "@/lib/depot/types";

const representative: DepotRepresentative = {
  id: "rep-1",
  companyName: "Gamma AE",
  name: "Γιώργος",
  active: true,
  createdAt: "2026-01-01T00:00:00.000Z",
};

const containerA: DepotContainer = {
  id: "c-1",
  containerNumber: "MSCU 123456-7",
  containerType: "20dc",
  grade: "A",
  status: "available",
  images: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const containerB: DepotContainer = {
  id: "c-2",
  containerNumber: "TCLU 654321-0",
  containerType: "40hc",
  grade: "B",
  status: "available",
  images: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("buildContainerOfferHistories", () => {
  it("groups offer dispatches by container and sorts by latest first", () => {
    const dispatches: DepotDispatch[] = [
      {
        id: "d-1",
        containerId: "c-1",
        representativeId: "rep-1",
        dispatchType: "offer",
        createdAt: "2026-07-01T10:00:00.000Z",
        container: containerA,
        representative,
      },
      {
        id: "d-2",
        containerId: "c-1",
        representativeId: "rep-1",
        dispatchType: "offer",
        createdAt: "2026-07-10T10:00:00.000Z",
        container: containerA,
        representative,
      },
      {
        id: "d-3",
        containerId: "c-2",
        representativeId: "rep-1",
        dispatchType: "offer",
        createdAt: "2026-07-05T10:00:00.000Z",
        container: containerB,
        representative,
      },
      {
        id: "d-4",
        containerId: "c-2",
        representativeId: "rep-1",
        dispatchType: "free_storage",
        createdAt: "2026-07-12T10:00:00.000Z",
        container: containerB,
        representative,
      },
    ];

    const histories = buildContainerOfferHistories([containerA, containerB], dispatches);

    assert.equal(histories.length, 2);
    assert.equal(histories[0]?.container.id, "c-1");
    assert.equal(histories[0]?.dispatches.length, 2);
    assert.equal(histories[0]?.latestDispatch.id, "d-2");
    assert.equal(histories[1]?.container.id, "c-2");
    assert.equal(histories[1]?.dispatches.length, 1);
  });
});

describe("dispatchRecipientLabel", () => {
  it("shows representative label when present", () => {
    const dispatch: DepotDispatch = {
      id: "d-1",
      containerId: "c-1",
      representativeId: "rep-1",
      dispatchType: "offer",
      createdAt: "2026-07-01T10:00:00.000Z",
      representative,
    };

    assert.match(dispatchRecipientLabel(dispatch), /Gamma AE/);
  });
});
