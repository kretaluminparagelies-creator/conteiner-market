-- =============================================================================
-- Container Market GR — Migration: rental contract + customer (CRM)
-- Date: 2026-07-05
-- =============================================================================

alter table listings
  add column if not exists rental_customer_name text,
  add column if not exists rental_customer_phone text,
  add column if not exists rental_customer_email text,
  add column if not exists rental_customer_company text,
  add column if not exists rental_customer_address text,
  add column if not exists rental_customer_notes text,
  add column if not exists rental_starts_at date,
  add column if not exists rental_ends_at date;

create index if not exists listings_rental_ends_at_idx on listings (rental_ends_at);
