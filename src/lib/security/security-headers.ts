/**
 * @file security-headers.ts
 * @description Shared HTTP security headers for Next.js
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

function buildProductionContentSecurityPolicy(): string {
  // Three.js GLB loader uses WebAssembly — needs wasm-unsafe-eval / unsafe-eval.
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
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
    // No CSP in dev — React/Turbopack need eval(); Three.js needs WebAssembly compile.
    return baseHeaders;
  }

  return [
    { key: "Content-Security-Policy", value: buildProductionContentSecurityPolicy() },
    ...baseHeaders,
  ];
}
