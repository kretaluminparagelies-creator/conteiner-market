/**
 * @file loading.tsx
 * @description Depot route loading skeleton (main content only — shell stays mounted)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export default function DepotLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 gap-3">
        <div className="h-20 rounded-2xl bg-cm-light-border/50" />
        <div className="h-20 rounded-2xl bg-cm-light-border/50" />
      </div>
      <div className="h-24 rounded-2xl bg-cm-light-border/40" />
      <div className="h-24 rounded-2xl bg-cm-light-border/35" />
      <div className="h-32 rounded-2xl bg-cm-light-border/30" />
    </div>
  );
}
