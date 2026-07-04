/**
 * @file CrmLogoutButton.tsx
 * @description CRM sign out
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function CrmLogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const supabase = createSupabaseBrowserClient();
          await supabase.auth.signOut();
          router.refresh();
          router.push("/admin/login");
        })
      }
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 font-mono text-[11px] text-cm-muted transition-colors hover:bg-cm-surf/80 hover:text-red-300 disabled:opacity-50"
    >
      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
      {pending ? "Αποσύνδεση…" : "Αποσύνδεση"}
    </button>
  );
}
