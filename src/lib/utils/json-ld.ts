/**
 * @file json-ld.ts
 * @description Safe JSON-LD serialization (prevents script breakout)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
