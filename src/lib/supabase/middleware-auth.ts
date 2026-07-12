/**
 * @file middleware-auth.ts
 * @description Refresh Supabase session in middleware
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { CRM_USER_EMAIL_HEADER } from "@/lib/supabase/crm-session-header";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseReadConfigured } from "@/lib/supabase/env";

function forwardSessionCookies(from: NextResponse, to: NextResponse) {
  for (const cookie of from.headers.getSetCookie()) {
    to.headers.append("Set-Cookie", cookie);
  }
}

/** Attach verified email to the request so layout/pages skip a second getUser() call */
function withUserEmailHeader(request: NextRequest, response: NextResponse, email: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CRM_USER_EMAIL_HEADER, email);

  const nextResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  forwardSessionCookies(response, nextResponse);
  return nextResponse;
}

export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseReadConfigured()) {
    return response;
  }

  const supabase = createServerClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublicAdmin = pathname === "/admin/login" || pathname === "/admin/reset-password";
  const isAdmin = pathname.startsWith("/admin");
  const isDepot = pathname.startsWith("/depot");

  if ((isAdmin || isDepot) && !isPublicAdmin && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(loginUrl);
    forwardSessionCookies(response, redirect);
    return redirect;
  }

  if (isPublicAdmin && pathname === "/admin/login" && user) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    adminUrl.search = "";
    const redirect = NextResponse.redirect(adminUrl);
    forwardSessionCookies(response, redirect);
    return redirect;
  }

  if (user?.email) {
    return withUserEmailHeader(request, response, user.email);
  }

  return response;
}
