-- =============================================================================
-- Container Market GR — Migration: rental location (depot vs customer site)
-- Date: 2026-07-05
-- =============================================================================

-- Safe to re-run (type may already exist from a previous attempt)

do $$ begin
  create type rental_location as enum ('depot', 'customer');
exception
  when duplicate_object then null;
end $$;

alter table listings
  add column if not exists rental_location rental_location;

create index if not exists listings_rental_location_idx on listings (rental_location);
