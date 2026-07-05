/**
 * @file CrmShellPage.tsx
 * @description Server wrapper — passes admin email to CRM shell (avoids hydration mismatch)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmShell } from "@/components/crm/CrmShell";
import { getCrmSessionEmail } from "@/lib/supabase/server-auth";
import type { ReactNode } from "react";

type CrmShellPageProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export async function CrmShellPage({ title, description, children }: CrmShellPageProps) {
  const adminEmail = await getCrmSessionEmail();

  return (
    <CrmShell title={title} description={description} adminEmail={adminEmail}>
      {children}
    </CrmShell>
  );
}
