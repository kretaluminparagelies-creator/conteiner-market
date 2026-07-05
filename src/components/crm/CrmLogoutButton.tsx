/**
 * @file CrmLogoutButton.tsx
 * @description CRM sign out via server action
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { logoutAction } from "@/lib/crm/actions/auth-actions";

export function CrmLogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => logoutAction())}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 font-mono text-[11px] text-cm-muted transition-colors hover:bg-cm-light-bg hover:text-red-700 disabled:opacity-50"
    >
      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
      {pending ? "Αποσύνδεση…" : "Αποσύνδεση"}
    </button>
  );
}
