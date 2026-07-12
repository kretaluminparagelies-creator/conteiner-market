/**
 * @file filter-representatives.test.ts
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  filterRepresentatives,
  representativeDisplayLabel,
} from "./filter-representatives.ts";
import type { DepotRepresentative } from "./types.ts";

const sample: DepotRepresentative = {
  id: "1",
  companyName: "Alpha Logistics AE",
  name: "Γιάννης Π.",
  phone: "6912345678",
  city: "Θεσσαλονίκη",
  afm: "123456789",
  active: true,
  createdAt: "2026-07-12T10:00:00.000Z",
};

describe("filterRepresentatives", () => {
  it("matches company, city, and afm", () => {
    assert.equal(filterRepresentatives([sample], "alpha").length, 1);
    assert.equal(filterRepresentatives([sample], "θεσσαλον").length, 1);
    assert.equal(filterRepresentatives([sample], "123456789").length, 1);
    assert.equal(filterRepresentatives([sample], "missing").length, 0);
  });
});

describe("representativeDisplayLabel", () => {
  it("combines company and contact when different", () => {
    assert.equal(representativeDisplayLabel(sample), "Alpha Logistics AE — Γιάννης Π.");
  });

  it("falls back when companyName is missing", () => {
    assert.equal(
      representativeDisplayLabel({ ...sample, companyName: undefined as unknown as string }),
      "Γιάννης Π.",
    );
  });
});
