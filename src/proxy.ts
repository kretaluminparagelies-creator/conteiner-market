/**
 * @file proxy.ts
 * @description CRM admin auth gate + Supabase session refresh (Next.js 16 proxy)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { updateSupabaseSession } from "@/lib/supabase/middleware-auth";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/depot", "/depot/:path*"],
};
