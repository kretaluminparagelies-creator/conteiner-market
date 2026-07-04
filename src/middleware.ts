/**
 * @file middleware.ts
 * @description CRM admin auth gate + Supabase session refresh
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { updateSupabaseSession } from "@/lib/supabase/middleware-auth";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
