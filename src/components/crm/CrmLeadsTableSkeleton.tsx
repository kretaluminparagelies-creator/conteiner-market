/**
 * @file CrmLeadsTableSkeleton.tsx
 * @description Loading placeholder for CRM leads table
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export function CrmLeadsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-cm-border">
      <div className="space-y-0 divide-y divide-cm-border/70 bg-cm-card/30">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex gap-4 px-4 py-4">
            <div className="h-4 w-24 animate-pulse rounded bg-cm-border/50" />
            <div className="h-4 w-32 animate-pulse rounded bg-cm-border/40" />
            <div className="h-4 flex-1 animate-pulse rounded bg-cm-border/30" />
          </div>
        ))}
      </div>
    </div>
  );
}
