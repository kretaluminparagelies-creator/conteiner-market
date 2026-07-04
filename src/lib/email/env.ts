/**
 * @file env.ts
 * @description Resend email environment helpers
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { site } from "@/lib/constants/site";

function trim(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export function getResendApiKey(): string | undefined {
  return trim(process.env.RESEND_API_KEY);
}

export function getLeadNotifyEmail(): string {
  return trim(process.env.LEAD_NOTIFY_EMAIL) ?? site.contactEmail;
}

export function getEmailFrom(): string {
  return trim(process.env.EMAIL_FROM) ?? `Container Market <${site.contactEmail}>`;
}

export function isLeadEmailNotifyConfigured(): boolean {
  return Boolean(getResendApiKey());
}
