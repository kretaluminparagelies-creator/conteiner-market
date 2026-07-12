/**
 * @file depot-to-listing.test.ts
 * @description Tests for depot container to listing form mapping
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { depotContainerToListingFormInput } from "@/lib/depot/depot-to-listing";
import type { DepotContainer } from "@/lib/depot/types";

const container: DepotContainer = {
  id: "c-1",
  containerNumber: "MSCU 123456-7",
  containerType: "40hc",
  grade: "A",
  status: "available",
  salePrice: 2500,
  images: ["https://example.com/photo.jpg"],
  notes: "Καθαρό",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("depotContainerToListingFormInput", () => {
  it("maps depot stock to a listing draft", () => {
    const draft = depotContainerToListingFormInput(container);

    assert.equal(draft.type, "40ft High Cube");
    assert.equal(draft.containerNumber, "MSCU 123456-7");
    assert.equal(draft.price, 2500);
    assert.equal(draft.stockCondition, "used");
    assert.equal(draft.image, "https://example.com/photo.jpg");
    assert.match(draft.description, /Καθαρό/);
    assert.equal(draft.active, true);
    assert.equal(draft.isOffer, false);
  });

  it("applies publish options from depot", () => {
    const draft = depotContainerToListingFormInput(container, {
      active: false,
      isOffer: true,
      listingType: "rent",
    });

    assert.equal(draft.active, false);
    assert.equal(draft.isOffer, true);
    assert.equal(draft.listingType, "rent");
    assert.equal(draft.unit, "/μήνα");
  });
});
