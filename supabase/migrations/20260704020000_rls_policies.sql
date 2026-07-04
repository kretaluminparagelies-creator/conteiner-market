-- =============================================================================
-- Container Market GR — Migration 003: RLS policies
-- Author: Katsoulakis
-- Date: 2026-07-04
-- Project: conteiner-market
-- File: 20260704020000_rls_policies.sql
-- Description: Public read active listings; service role bypasses via key
-- =============================================================================

alter table listings enable row level security;
alter table leads enable row level security;

-- Public site: anon/authenticated may read active listings only
create policy "Public read active listings"
  on listings
  for select
  to anon, authenticated
  using (active = true);

-- No public writes on listings (CRM uses service role key server-side)
-- No public access to leads (CRM uses service role)
