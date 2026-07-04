/**
 * One-off: test Resend lead notification
 * Usage: node scripts/test-lead-email.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function loadEnvLocal() {
  const path = join(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvLocal();

const apiKey = process.env.RESEND_API_KEY?.trim();
const to = process.env.LEAD_NOTIFY_EMAIL?.trim() || "support@logiworkpass.com";
const from = process.env.EMAIL_FROM?.trim() || "Container Market <support@logiworkpass.com>";

if (!apiKey) {
  console.error("FAIL: RESEND_API_KEY missing in .env.local");
  process.exit(1);
}

const response = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from,
    to: [to],
    subject: "[Container Market] Test — email setup OK",
    html: "<p>Δοκιμαστικό email από conteiner-market. Αν το βλέπεις, το Resend δουλεύει.</p>",
  }),
});

const body = await response.text();

if (!response.ok) {
  console.error("FAIL: Resend", response.status, body);
  process.exit(1);
}

console.log("OK: Test email sent to", to);
console.log("Resend response:", body);
