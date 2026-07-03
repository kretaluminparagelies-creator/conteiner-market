/**
 * @file index.ts
 * @description Message catalog registry
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { Locale } from "@/lib/i18n/types";
import { el, type Messages } from "@/lib/i18n/messages/el";
import { en } from "@/lib/i18n/messages/en";

export type { Messages };

export const messages: Record<Locale, Messages> = {
  el,
  en,
};
