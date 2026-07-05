-- =============================================================================
-- Container Market GR — Migration: listing history + container number
-- Date: 2026-07-05
-- Description: container_number for CRM tracking; archived_at / archive_reason for history
-- =============================================================================

-- Safe to re-run (type may already exist from a previous attempt)

do $$ begin
  create type archive_reason as enum ('sold', 'rented', 'withdrawn');
exception
  when duplicate_object then null;
end $$;

alter table listings
  add column if not exists container_number text,
  add column if not exists archived_at timestamptz,
  add column if not exists archive_reason archive_reason;

create index if not exists listings_archived_at_idx on listings (archived_at desc nulls last);
create index if not exists listings_container_number_idx on listings (container_number);

-- Backfill: inactive listings without archive metadata → withdrawn at updated_at
update listings
set
  archived_at = coalesce(archived_at, updated_at),
  archive_reason = coalesce(archive_reason, 'withdrawn'::archive_reason)
where active = false and archived_at is null;
