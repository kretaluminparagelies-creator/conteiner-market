/**
 * @file send-lead-notification.ts
 * @description Notify team via Resend when a new CRM lead arrives
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { site } from "@/lib/constants/site";
import { leadSourceLabels } from "@/lib/crm/lead-labels";
import type { LeadSource } from "@/lib/crm/types";
import {
  getEmailFrom,
  getLeadNotifyEmail,
  getResendApiKey,
  isLeadEmailNotifyConfigured,
} from "@/lib/email/env";

export type LeadNotificationInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: LeadSource;
  listingSlug?: string;
  interest?: string;
};

const interestLabels: Record<string, string> = {
  buy: "Αγορά",
  rent: "Ενοικίαση",
  both: "Αγορά & ενοικίαση",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getEmailSubject(source: LeadSource, name: string): string {
  const prefix = leadSourceLabels[source];
  return `[Container Market] ${prefix} — ${name}`;
}

export async function sendLeadNotification(input: LeadNotificationInput): Promise<void> {
  if (!isLeadEmailNotifyConfigured()) return;

  const apiKey = getResendApiKey()!;
  const to = getLeadNotifyEmail();
  const from = getEmailFrom();
  const adminUrl = `${site.url.replace(/\/$/, "")}/admin/leads`;
  const sourceLabel = leadSourceLabels[input.source];

  const lines = [
    `<p><strong>Τύπος αιτήματος:</strong> ${escapeHtml(sourceLabel)}</p>`,
    `<p><strong>Όνομα:</strong> ${escapeHtml(input.name)}</p>`,
    `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></p>`,
  ];

  if (input.phone) {
    lines.push(`<p><strong>Τηλέφωνο:</strong> ${escapeHtml(input.phone)}</p>`);
  }

  if (input.interest && interestLabels[input.interest]) {
    lines.push(
      `<p><strong>Ενδιαφέρον:</strong> ${escapeHtml(interestLabels[input.interest])}</p>`,
    );
  }

  lines.push(
    input.listingSlug
      ? `<p><strong>Καταχώριση:</strong> <a href="${escapeHtml(`${site.url}/listings/${input.listingSlug}`)}">${escapeHtml(input.listingSlug)}</a></p>`
      : "",
    `<p><strong>Μήνυμα:</strong></p><p>${escapeHtml(input.message).replace(/\n/g, "<br />")}</p>`,
    `<p><a href="${escapeHtml(adminUrl)}">Άνοιγμα CRM → Αιτήματα</a></p>`,
  );

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: getEmailSubject(input.source, input.name),
      html: lines.filter(Boolean).join("\n"),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend failed (${response.status}): ${body}`);
  }
}
