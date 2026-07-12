/**
 * @file messaging-links.test.ts
 * @description Tests for Viber and WhatsApp deep links
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildViberChatUrl,
  buildViberDispatchUrl,
  buildViberForwardUrl,
  buildWhatsAppDispatchUrl,
  normalizePhoneForMessaging,
} from "@/lib/depot/messaging-links";

describe("normalizePhoneForMessaging", () => {
  it("normalizes Greek mobile numbers", () => {
    assert.equal(normalizePhoneForMessaging("69 1234 5678"), "306912345678");
    assert.equal(normalizePhoneForMessaging("+30 691 234 5678"), "306912345678");
    assert.equal(normalizePhoneForMessaging("306912345678"), "306912345678");
  });

  it("rejects invalid numbers", () => {
    assert.equal(normalizePhoneForMessaging("123"), null);
    assert.equal(normalizePhoneForMessaging(""), null);
  });
});

describe("buildViberChatUrl", () => {
  it("builds chat deep link with encoded draft", () => {
    const url = buildViberChatUrl("6912345678", "ABCD 1234567");
    assert.equal(url, "viber://chat?number=%2B306912345678&draft=ABCD%201234567");
  });
});

describe("buildViberForwardUrl", () => {
  it("builds forward deep link", () => {
    const url = buildViberForwardUrl("Hello Viber");
    assert.equal(url, "viber://forward?text=Hello%20Viber");
  });
});

describe("buildViberDispatchUrl", () => {
  it("prefers direct chat when phone is valid", () => {
    const url = buildViberDispatchUrl("Offer", "6912345678");
    assert.match(url, /^viber:\/\/chat\?number=%2B306912345678&draft=/);
  });

  it("falls back to forward without phone", () => {
    const url = buildViberDispatchUrl("Offer");
    assert.equal(url, "viber://forward?text=Offer");
  });
});

describe("buildWhatsAppDispatchUrl", () => {
  it("builds direct chat link with phone", () => {
    const url = buildWhatsAppDispatchUrl("Hello", "6912345678");
    assert.equal(url, "https://wa.me/306912345678?text=Hello");
  });

  it("builds generic share link without phone", () => {
    const url = buildWhatsAppDispatchUrl("Hello");
    assert.equal(url, "https://wa.me/?text=Hello");
  });
});
