-- =============================================================================
-- Container Market GR — Representative billing fields (τιμολόγηση)
-- Author: Katsoulakis
-- Date: 2026-07-12
-- =============================================================================

alter table depot_representatives
  add column if not exists company_name text,
  add column if not exists email text,
  add column if not exists afm text,
  add column if not exists doy text,
  add column if not exists address text,
  add column if not exists city text,
  add column if not exists postal_code text;

-- Backfill: existing rows use name as company display until edited in CRM
update depot_representatives
set company_name = name
where company_name is null or trim(company_name) = '';

alter table depot_representatives
  alter column company_name set not null;
