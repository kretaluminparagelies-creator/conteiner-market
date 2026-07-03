/**
 * @file FooterLink.tsx
 * @description Single footer navigation link
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import Link from "next/link";

type FooterLinkProps = {
  href: string;
  label: string;
};

export function FooterLink({ href, label }: FooterLinkProps) {
  return (
    <Link href={href} className="text-[13px] text-cm-muted transition-colors hover:text-cm-sub">
      {label}
    </Link>
  );
}
