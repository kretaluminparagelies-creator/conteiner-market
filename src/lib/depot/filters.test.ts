/**
 * @file filters.test.ts
 * @description Tests for depot container filters
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { filterAvailableContainers } from "./filters.ts";
import type { DepotContainer } from "./types.ts";

const base: DepotContainer = {
  id: "1",
  containerNumber: "MSCU1234567",
  containerType: "20dc",
  grade: "A",
  status: "available",
  salePrice: 950,
  images: [],
  createdAt: "2026-07-12T10:00:00.000Z",
  updatedAt: "2026-07-12T10:00:00.000Z",
};

describe("filterAvailableContainers", () => {
  it("returns only available containers", () => {
    const items = [
      base,
      { ...base, id: "2", status: "sold" as const, containerNumber: "MSCU9999999" },
    ];

    const result = filterAvailableContainers(items);
    assert.equal(result.length, 1);
    assert.equal(result[0]?.containerNumber, "MSCU1234567");
  });

  it("filters by type, grade, and max sale price", () => {
    const items = [
      base,
      { ...base, id: "2", containerType: "40hc", containerNumber: "MSCU2222222" },
      { ...base, id: "3", grade: "B", salePrice: 1200, containerNumber: "MSCU3333333" },
    ];

    const result = filterAvailableContainers(items, {
      containerType: "20dc",
      grade: "A",
      maxSalePrice: 1000,
    });

    assert.equal(result.length, 1);
    assert.equal(result[0]?.id, "1");
  });

  it("matches container number in query", () => {
    const result = filterAvailableContainers([base], { query: "1234567" });
    assert.equal(result.length, 1);
  });
});
