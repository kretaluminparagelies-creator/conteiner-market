/**
 * @file Nav.tsx
 * @description Main site navigation header
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import Link from "next/link";
import { NavLink } from "@/components/layout/NavLink";
import { Button } from "@/components/ui/Button";
import { mainNav } from "@/lib/constants/navigation";

export function Nav() {
  return (
    <nav
      aria-label="Κύρια πλοήγηση"
      className="fixed inset-x-0 top-0 z-[200] flex h-[60px] items-center justify-between border-b border-cm-border bg-cm-bg/92 px-[6%] backdrop-blur-[14px]"
    >
      <Link href="/" className="font-display text-[17px] font-bold tracking-[0.08em]">
        <span className="text-cm-accent">CONTAINER</span>
        <span className="font-light text-cm-sub">MARKET</span>
        <span className="ml-2 font-mono text-[10px] tracking-[0.2em] text-cm-muted">
          GR
        </span>
      </Link>

      <div className="hidden items-center gap-7 md:flex">
        {mainNav.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
      </div>

      <Button href="/epikoinonia" className="px-5 py-2 text-[13px]">
        Επικοινωνία
      </Button>
    </nav>
  );
}
