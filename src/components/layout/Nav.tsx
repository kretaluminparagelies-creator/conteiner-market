/**
 * @file Nav.tsx
 * @description Main site navigation header
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { NavBrand } from "@/components/layout/NavBrand";
import { NavContactButton } from "@/components/layout/NavContactButton";
import { NavLink } from "@/components/layout/NavLink";
import { NavListingTabs } from "@/components/layout/NavListingTabs";
import { NavMobileMenu } from "@/components/layout/NavMobileMenu";
import { useLocale } from "@/lib/i18n/locale-context";
import { useLightNavSurface } from "@/lib/nav/use-light-nav-surface";

export function Nav() {
  const { t } = useLocale();
  const isLightNav = useLightNavSurface();
  const showHomeNavTabs = isLightNav;

  const mainNav = [
    { href: "/agora", label: t.nav.buy },
    { href: "/polisi", label: t.nav.sell },
    { href: "/enoikiasi", label: t.nav.rent },
    { href: "/listings", label: t.nav.listings },
    { href: "/epikoinonia?intent=inquiry", label: t.nav.contact },
  ];

  return (
    <nav
      aria-label={t.nav.ariaLabel}
      className={[
        "fixed inset-x-0 top-0 z-[200] flex h-[60px] items-center justify-between gap-3 px-[4%] backdrop-blur-xl sm:px-[6%]",
        "md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:justify-normal md:gap-3",
        isLightNav
          ? "border-b border-cm-light-border-strong bg-white/92 shadow-cm-light-sm"
          : "border-b border-cm-border bg-cm-bg/92 backdrop-blur-[14px]",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3 md:justify-self-start">
        <NavMobileMenu isHome={isLightNav} />
        <NavBrand surface={isLightNav ? "light" : "dark"} className="relative z-10 inline-flex" />
      </div>

      {showHomeNavTabs ? (
        <div className="hidden max-w-full justify-self-center overflow-x-auto px-1 [scrollbar-width:none] md:block [&::-webkit-scrollbar]:hidden">
          <NavListingTabs />
        </div>
      ) : (
        <div className="hidden items-center justify-center gap-7 justify-self-center lg:flex">
          {mainNav.slice(0, 4).map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </div>
      )}

      <div className="flex shrink-0 items-center justify-self-end gap-2 sm:gap-3">
        <div className="hidden sm:block">
          <LanguageToggle />
        </div>
        <div className="hidden sm:block">
          <NavContactButton isHome={isLightNav} />
        </div>
      </div>
    </nav>
  );
}
