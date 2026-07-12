/**
 * @file page.tsx
 * @description Depot home — big action buttons
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Link from "next/link";
import { Plus, Send } from "lucide-react";
import { DepotHomeStats } from "@/components/depot/DepotHomeStats";
import { loadDepotHomeData } from "@/lib/depot/actions/depot-actions";

const actions = [
  {
    href: "/depot/intake",
    label: "Νέο κοντέινερ",
    description: "Φωτογραφία + καταχώρηση",
    icon: Plus,
    accent: true,
  },
  {
    href: "/depot/dispatch",
    label: "Στείλε προσφορά",
    description: "Διαθέσιμα + φωτό + Viber / WhatsApp",
    icon: Send,
    accent: false,
  },
] as const;

export default async function DepotHomePage() {
  const { containers, dispatches } = await loadDepotHomeData();

  return (
    <div className="space-y-6">
      <DepotHomeStats containers={containers} dispatches={dispatches} />

      <div className="grid gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={
                action.accent
                  ? "flex items-center gap-4 rounded-2xl bg-cm-accent px-4 py-5 text-white shadow-cm-accent transition-transform active:scale-[0.99]"
                  : "flex items-center gap-4 rounded-2xl border border-cm-light-border-strong bg-white px-4 py-5 shadow-cm-light-sm transition-transform active:scale-[0.99]"
              }
            >
              <Icon className={action.accent ? "size-7" : "size-6 text-cm-accent"} />
              <div>
                <p className="font-display text-base font-bold">{action.label}</p>
                <p
                  className={
                    action.accent ? "text-sm text-white/85" : "text-sm text-cm-ink-sub"
                  }
                >
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
