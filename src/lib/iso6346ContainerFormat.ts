/**
 * @file iso6346ContainerFormat.ts
 * @description ISO 6346 container number formatting (from crystal-okapi-swim control depo)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 *
 * Display: 4 capital letters + space + 6 digits + hyphen + check digit (auto).
 * Example: "MSCU 123456-7" — type MSCU and 123456; digit after "-" is computed.
 */

const LETTER_VALUE: Record<string, number> = {
  A: 10,
  B: 12,
  C: 13,
  D: 14,
  E: 15,
  F: 16,
  G: 17,
  H: 18,
  I: 19,
  J: 20,
  K: 21,
  L: 23,
  M: 24,
  N: 25,
  O: 26,
  P: 27,
  Q: 28,
  R: 29,
  S: 30,
  T: 31,
  U: 32,
  V: 34,
  W: 35,
  X: 36,
  Y: 37,
  Z: 38,
};

function charValueAtIndex(ch: string): number {
  if (/[0-9]/.test(ch)) return ch.charCodeAt(0) - 48;
  const v = LETTER_VALUE[ch];
  if (v === undefined) throw new Error("invalid_iso6346_char");
  return v;
}

/** ISO 6346 check digit from first 10 chars (4 letters + 6 digits). */
export function computeIso6346CheckDigit(first10: string): number {
  if (first10.length !== 10) throw new Error("need_10_chars");
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const v = charValueAtIndex(first10[i]!);
    sum += v * (1 << i);
  }
  const r = sum % 11;
  return r === 10 ? 0 : r;
}

/** True if the 11th digit matches ISO 6346 for the first 10 characters. */
export function iso6346CheckDigitMatches(display: string): boolean {
  const m = display.replace(/[\s-]+/g, "").toUpperCase();
  if (!/^[A-Z]{4}[0-9]{7}$/.test(m)) return false;
  try {
    return computeIso6346CheckDigit(m.slice(0, 10)) === parseInt(m[10]!, 10);
  } catch {
    return false;
  }
}

/**
 * User types letters + up to 6 digits; 7th digit is always the ISO check.
 * If the value ends with "-" (check deleted), we do not re-append the check so backspace can continue.
 */
export function formatIso6346ContainerField(raw: string): string {
  const u = raw.toUpperCase();
  let i = 0;
  let letters = "";
  while (i < u.length && letters.length < 4) {
    const ch = u[i]!;
    if (/[A-Z]/.test(ch)) {
      letters += ch;
      i += 1;
    } else {
      break;
    }
  }
  while (i < u.length && u[i] === " ") i += 1;
  let serial = "";
  while (i < u.length && serial.length < 6) {
    const ch = u[i]!;
    if (/[0-9]/.test(ch)) {
      serial += ch;
      i += 1;
    } else {
      break;
    }
  }
  let hyphenOpen = false;
  let typedCheck = "";
  if (i < u.length && u[i] === "-") {
    hyphenOpen = true;
    i += 1;
    if (i < u.length && /[0-9]/.test(u[i]!)) {
      typedCheck = u[i]!;
      i += 1;
    }
  }

  if (letters.length < 4) {
    return letters;
  }

  if (serial.length === 0) {
    return letters;
  }
  if (serial.length < 6) {
    return `${letters} ${serial}`;
  }

  if (hyphenOpen && typedCheck.length === 0) {
    return `${letters} ${serial}`;
  }

  try {
    const check = String(computeIso6346CheckDigit(letters + serial));
    if (hyphenOpen && typedCheck.length === 1 && typedCheck !== check) {
      return `${letters} ${serial}-${check}`;
    }
    return `${letters} ${serial}-${check}`;
  } catch {
    return `${letters} ${serial}`;
  }
}

/** 11 chars AAAA + 7 digits; validates ISO check digit. */
export function compactIso6346FromDisplay(display: string): string | null {
  const m = display.replace(/[\s-]+/g, "").toUpperCase();
  if (!/^[A-Z]{4}[0-9]{7}$/.test(m)) return null;
  try {
    if (computeIso6346CheckDigit(m.slice(0, 10)) !== parseInt(m[10]!, 10)) return null;
  } catch {
    return null;
  }
  return m;
}

export function isCompleteIso6346Display(display: string): boolean {
  return compactIso6346FromDisplay(display) !== null;
}

/** Canonical display form for storage: `MSCU 123456-7` */
export function displayIso6346FromCompact(compact: string): string {
  const c = compact.toUpperCase();
  return `${c.slice(0, 4)} ${c.slice(4, 10)}-${c.slice(10)}`;
}

export const iso6346ContainerErrorMessage =
  "Μορφή AAAA 123456-7 (ISO 6346) — 4 γράμματα, κενό, 6 ψηφία, παύλα, τελευταίο αυτόματα.";
