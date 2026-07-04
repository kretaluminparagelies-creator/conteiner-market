/**
 * @file NavMobileMenu.tsx
 * @description Mobile nav drawer — shadcn Sheet
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import {
  ChevronRight,
  KeyRound,
  LayoutGrid,
  Mail,
  Menu,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, type ComponentType, type CSSProperties } from "react";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { NavContactButton } from "@/components/layout/NavContactButton";
import { Button } from "@/components/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { getNavLinkTheme } from "@/lib/constants/nav-link-themes";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

type NavMobileMenuProps = {
  isHome: boolean;
};

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export function NavMobileMenu({ isHome }: NavMobileMenuProps) {
  const { t } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const mainNav: NavItem[] = [
    { href: "/agora", label: t.nav.buy, icon: ShoppingBag },
    { href: "/polisi", label: t.nav.sell, icon: Tag },
    { href: "/enoikiasi", label: t.nav.rent, icon: KeyRound },
    { href: "/listings", label: t.nav.listings, icon: LayoutGrid },
    { href: "/epikoinonia?intent=inquiry", label: t.nav.contact, icon: Mail },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant={isHome ? "brandOutline" : "outline"}
            size="icon-sm"
            aria-expanded={open}
            className={cn(
              "lg:hidden transition-transform duration-200",
              open && "border-cm-accent/45 bg-cm-accent/8",
              isHome ? "border-cm-light-border-strong text-cm-ink" : "border-cm-border text-cm-sub",
            )}
          />
        }
      >
        <Menu className={cn("size-4 transition-transform duration-200", open && "scale-95")} />
        <span className="sr-only">{t.nav.ariaLabel}</span>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-[min(100vw-1.5rem,340px)] flex-col border-cm-light-border-strong bg-white p-0 shadow-cm-light-lg"
      >
        <SheetHeader className="border-b border-cm-light-border bg-linear-to-b from-cm-light-bg to-white px-5 py-5 text-left">
          <div className="nav-brand-chip nav-brand-chip--elevated inline-flex w-fit items-center px-2.5 py-1.5">
            <SheetTitle className="font-display text-[15px] font-bold">
              <span className="text-cm-brand-red">CONTAINER</span>
              <span className="font-light text-white/78">MARKET</span>
            </SheetTitle>
          </div>
          <SheetDescription className="mt-2 font-mono text-[10px] tracking-[0.2em] text-cm-ink-muted uppercase">
            {t.nav.ariaLabel}
          </SheetDescription>
        </SheetHeader>

        <nav aria-label={t.nav.ariaLabel} className="flex flex-1 flex-col gap-1 px-3 py-3">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            const theme = getNavLinkTheme(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                style={
                  isActive
                    ? ({
                        borderLeftColor: theme.accent,
                        color: theme.accent,
                      } as CSSProperties)
                    : undefined
                }
                className={cn(
                  "group flex items-center gap-3 rounded-xl border-l-[3px] px-3 py-3.5 transition-all duration-200",
                  isActive
                    ? "border-l-current bg-cm-accent/8 font-semibold shadow-cm-light-xs"
                    : "border-l-transparent text-cm-ink-sub hover:bg-cm-light-bg hover:text-cm-ink",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                    isActive
                      ? "border-current/25 bg-white shadow-cm-light-xs"
                      : "border-cm-light-border bg-white group-hover:border-cm-light-border-strong",
                  )}
                  style={isActive ? { color: theme.accent } : undefined}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="flex-1 font-display text-[15px] tracking-[0.02em]">{item.label}</span>
                <ChevronRight
                  className={cn(
                    "size-4 shrink-0 transition-transform duration-200",
                    isActive ? "opacity-70" : "text-cm-ink-muted/50 group-hover:translate-x-0.5",
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-cm-light-border" />

        <div className="mt-auto flex flex-col gap-3 px-5 py-5">
          <LanguageToggle />
          <NavContactButton isHome={isHome} className="h-10 w-full justify-center text-sm" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
