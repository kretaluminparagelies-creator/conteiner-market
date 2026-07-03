/**
 * @file Providers.tsx
 * @description Client providers wrapper for the app shell
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { LocaleProvider } from "@/lib/i18n/locale-context";
import { LocaleHead } from "@/components/layout/LocaleHead";
import type { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <LocaleProvider>
      <LocaleHead />
      {children}
    </LocaleProvider>
  );
}
