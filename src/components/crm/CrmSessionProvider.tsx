/**
 * @file CrmSessionProvider.tsx
 * @description Admin session context (email for nav)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { createContext, useContext, type ReactNode } from "react";

type CrmSessionContextValue = {
  adminEmail: string | null;
};

const CrmSessionContext = createContext<CrmSessionContextValue>({ adminEmail: null });

export function CrmSessionProvider({
  adminEmail,
  children,
}: {
  adminEmail: string | null;
  children: ReactNode;
}) {
  return <CrmSessionContext.Provider value={{ adminEmail }}>{children}</CrmSessionContext.Provider>;
}

export function useCrmSession() {
  return useContext(CrmSessionContext);
}
