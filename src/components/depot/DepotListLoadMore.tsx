/**
 * @file DepotListLoadMore.tsx
 * @description Load-more footer for depot container lists
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

type DepotListLoadMoreProps = {
  shown: number;
  total: number;
  hasMore: boolean;
  nextBatch: number;
  onLoadMore: () => void;
};

export function DepotListLoadMore({
  shown,
  total,
  hasMore,
  nextBatch,
  onLoadMore,
}: DepotListLoadMoreProps) {
  if (total === 0) return null;

  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
        {shown} από {total}
      </p>
      {hasMore ? (
        <button
          type="button"
          onClick={onLoadMore}
          className="w-full rounded-xl border border-cm-light-border-strong bg-white px-3 py-3 font-display text-sm font-semibold text-cm-accent transition-colors hover:border-cm-accent/40 hover:bg-cm-accent/5"
        >
          Επόμενο {nextBatch}
        </button>
      ) : null}
    </div>
  );
}
