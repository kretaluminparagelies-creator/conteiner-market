/**
 * @file security-headers.ts
 * @description Shared HTTP security headers for Next.js
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

function supabaseOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return null;

  const withProtocol =
    raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

function buildProductionContentSecurityPolicy(): string {
  const supabase = supabaseOrigin();
  const turnstile = "https://challenges.cloudflare.com";
  const connectSrc = ["'self'", supabase, turnstile].filter(Boolean).join(" ");
  const imgSrc =
    "'self' data: blob: https://images.pexels.com https://images.unsplash.com" +
    (supabase ? ` ${supabase}` : "");

  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' 'unsafe-eval' ${turnstile}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSrc}`,
    "font-src 'self' https://fonts.gstatic.com",
    `connect-src ${connectSrc}`,
    `frame-src ${turnstile}`,
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];

  return directives.join("; ");
}

const baseHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

/** Called from next.config headers() — must be lazy (NODE_ENV is set at runtime). */
export function getSecurityHeaders(): { key: string; value: string }[] {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    return baseHeaders;
  }

  return [
    { key: "Content-Security-Policy", value: buildProductionContentSecurityPolicy() },
    ...baseHeaders,
  ];
}
