/**
 * @file DepotPrefetchLink.tsx
 * @description Depot link with prefetch and pending feedback
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type DepotPrefetchLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function DepotPrefetchLink({ href, children, className }: DepotPrefetchLinkProps) {
  const pathname = usePathname();
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const pending = navTarget === href && pathname !== href;

  return (
    <Link
      href={href}
      prefetch
      onClick={() => setNavTarget(href)}
      aria-busy={pending}
      className={cn(
        "inline-flex items-center gap-2 transition-opacity",
        pending && "opacity-70",
        className,
      )}
    >
      {pending ? <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" /> : null}
      {children}
    </Link>
  );
}
