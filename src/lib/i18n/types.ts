/**
 * @file types.ts
 * @description Locale types for bilingual UI (el / en)
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

export type Locale = "el" | "en";

export const locales: Locale[] = ["el", "en"];

export const defaultLocale: Locale = "el";

export const LOCALE_STORAGE_KEY = "cm-locale";
