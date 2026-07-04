/**
 * @file NavContactButton.tsx
 * @description Nav contact CTA — shadcn button trial
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

type NavContactButtonProps = {
  isHome: boolean;
  className?: string;
};

export function NavContactButton({ isHome, className }: NavContactButtonProps) {
  const { t } = useLocale();

  return (
    <Button
      variant="brand"
      size="sm"
      nativeButton={false}
      render={
        <Link
          href="/epikoinonia?intent=inquiry"
          className={cn("tracking-[0.06em]", isHome ? "text-white" : undefined)}
        />
      }
      className={cn(
        "h-9 gap-1.5 px-3 text-[13px] sm:px-4",
        !isHome && "shadow-[0_0_18px_rgba(224,112,48,0.25)]",
        className,
      )}
    >
      <Mail className="size-3.5" aria-hidden="true" />
      {t.nav.contact}
    </Button>
  );
}
