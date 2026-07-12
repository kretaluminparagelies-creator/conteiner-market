/**
 * @file share-text.test.ts
 * @description Tests for depot share message builder
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildDepotMobileShareText, buildDepotShareText } from "./share-text.ts";
import type { DepotContainer, DepotRepresentative } from "./types.ts";

describe("buildDepotShareText", () => {
  it("includes container details and representative", () => {
    const container: DepotContainer = {
      id: "1",
      containerNumber: "MSCU1234567",
      containerType: "20dc",
      grade: "A",
      status: "available",
      salePrice: 1000,
      images: ["https://example.com/photo.webp"],
      createdAt: "2026-07-12T10:00:00.000Z",
      updatedAt: "2026-07-12T10:00:00.000Z",
    };

    const representative: DepotRepresentative = {
      id: "r1",
      companyName: "Gamma Trading",
      name: "Γιώργος",
      active: true,
      createdAt: "2026-07-12T10:00:00.000Z",
    };

    const text = buildDepotShareText(container, representative, "free_storage");

    assert.match(text, /MSCU1234567/);
    assert.match(text, /Γιώργος/);
    assert.match(text, /δωρεάν αποθήκη/i);
    assert.match(text, /https:\/\/example.com\/photo.webp/);
  });
});

describe("buildDepotMobileShareText", () => {
  it("builds short photo-first share text", () => {
    const container: DepotContainer = {
      id: "1",
      containerNumber: "MSCU 123456-7",
      containerType: "20dc",
      grade: "A",
      status: "available",
      images: ["https://example.com/photo.webp"],
      createdAt: "2026-07-12T10:00:00.000Z",
      updatedAt: "2026-07-12T10:00:00.000Z",
    };

    const text = buildDepotMobileShareText(container);
    assert.match(text, /MSCU 123456-7/);
    assert.match(text, /20dc/);
    assert.doesNotMatch(text, /https:\/\//);
    assert.doesNotMatch(text, /Αντιπρόσωπος/);
  });
});
