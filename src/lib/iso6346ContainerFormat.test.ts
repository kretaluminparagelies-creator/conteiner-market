/**
 * @file iso6346ContainerFormat.test.ts
 * @description Tests for ISO 6346 container number formatting
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  compactIso6346FromDisplay,
  computeIso6346CheckDigit,
  displayIso6346FromCompact,
  formatIso6346ContainerField,
  isCompleteIso6346Display,
} from "./iso6346ContainerFormat.ts";

describe("formatIso6346ContainerField", () => {
  it("builds partial input progressively", () => {
    assert.equal(formatIso6346ContainerField("m"), "M");
    assert.equal(formatIso6346ContainerField("mscu"), "MSCU");
    assert.equal(formatIso6346ContainerField("mscu1"), "MSCU 1");
    assert.equal(formatIso6346ContainerField("mscu12345"), "MSCU 12345");
  });

  it("auto-appends check digit after 6 serial digits", () => {
    const formatted = formatIso6346ContainerField("MSCU123456");
    assert.match(formatted, /^MSCU 123456-\d$/);
    assert.equal(isCompleteIso6346Display(formatted), true);
  });
});

describe("compactIso6346FromDisplay", () => {
  it("accepts valid ISO display and rejects invalid check digit", () => {
    const display = formatIso6346ContainerField("ABCU123456");
    const compact = compactIso6346FromDisplay(display);
    assert.ok(compact);
    assert.equal(compact!.length, 11);
    assert.equal(displayIso6346FromCompact(compact!), display);
    assert.equal(compactIso6346FromDisplay("ABCU 123456-9"), null);
  });

  it("computes check digit consistently with formatter", () => {
    const display = formatIso6346ContainerField("ABCU123456");
    const compact = compactIso6346FromDisplay(display);
    assert.ok(compact);
    assert.equal(
      computeIso6346CheckDigit(compact!.slice(0, 10)),
      parseInt(compact!.slice(10), 10),
    );
  });
});
