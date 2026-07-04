/**
 * @file layout.tsx
 * @description CRM admin area root layout
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmSessionProvider } from "@/components/crm/CrmSessionProvider";
import { getCrmSessionUser } from "@/lib/supabase/server-auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM | Container Market",
  robots: { index: false, follow: false },
};

/** CRM reads env at request time — avoid build-time prerender with invalid/missing vars */
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCrmSessionUser();

  return <CrmSessionProvider adminEmail={user?.email ?? null}>{children}</CrmSessionProvider>;
}
