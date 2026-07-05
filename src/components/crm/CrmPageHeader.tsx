/**
 * @file CrmPageHeader.tsx
 * @description CRM page title with optional back link on sub-pages
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCrmBackLink } from "@/lib/crm/crm-back-link";
import { appVersionLabel } from "@/lib/constants/version";

type CrmPageHeaderProps = {
  title: string;
  description?: string;
};

export function CrmPageHeader({ title, description }: CrmPageHeaderProps) {
  const pathname = usePathname();
  const back = getCrmBackLink(pathname);

  return (
    <>
      {back ? (
        <Link
          href={back.href}
          className="mb-3 inline-flex items-center gap-1.5 font-mono text-xs text-cm-accent transition-colors hover:text-cm-text"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {back.label}
        </Link>
      ) : null}
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      {description ? <p className="mt-1 text-sm text-cm-sub">{description}</p> : null}
      <p className="mt-2 font-mono text-[10px] text-cm-muted lg:hidden">{appVersionLabel}</p>
    </>
  );
}
