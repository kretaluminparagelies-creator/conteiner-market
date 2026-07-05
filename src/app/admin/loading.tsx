/**
 * @file loading.tsx
 * @description CRM admin route loading skeleton
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export default function AdminLoading() {
  return (
    <div className="crm-light flex min-h-screen bg-cm-bg text-cm-text">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-cm-border bg-cm-card/95 lg:block" />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-60">
        <header className="border-b border-cm-border px-6 py-5 lg:px-8">
          <div className="h-8 w-48 animate-pulse rounded bg-cm-border/60" />
          <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-cm-border/40" />
        </header>

        <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-xl border border-cm-border bg-cm-card/60"
              />
            ))}
          </div>
          <div className="mt-10 h-64 animate-pulse rounded-xl border border-cm-border bg-cm-card/40" />
        </main>
      </div>
    </div>
  );
}
