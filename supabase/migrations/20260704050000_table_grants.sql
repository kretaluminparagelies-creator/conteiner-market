-- =============================================================================
-- Container Market GR — Migration 005: Data API table grants
-- Author: Katsoulakis
-- Date: 2026-07-04
-- Project: conteiner-market
-- File: 20260704050000_table_grants.sql
-- Description: Grant anon/authenticated/service_role access (required on new projects)
-- =============================================================================

grant usage on schema public to anon, authenticated, service_role;

grant select on public.listings to anon;
grant select, insert, update, delete on public.listings to authenticated;
grant select, insert, update, delete on public.listings to service_role;

grant select, insert, update, delete on public.leads to service_role;
