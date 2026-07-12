/**
 * @file status.test.ts
 * @description Tests for depot status helpers
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isDepotAvailable, isDepotOut, statusAfterDispatch } from "./status.ts";

describe("statusAfterDispatch", () => {
  it("keeps offer containers available", () => {
    assert.equal(statusAfterDispatch("offer"), null);
  });

  it("maps free storage to with_rep_storage", () => {
    assert.equal(statusAfterDispatch("free_storage"), "with_rep_storage");
  });
});

describe("availability helpers", () => {
  it("knows available vs out statuses", () => {
    assert.equal(isDepotAvailable("available"), true);
    assert.equal(isDepotAvailable("sent_offer"), true);
    assert.equal(isDepotAvailable("sold"), false);
    assert.equal(isDepotOut("with_rep_storage"), true);
    assert.equal(isDepotOut("sent_offer"), false);
    assert.equal(isDepotOut("available"), false);
  });
});
