-- =============================================================================
-- Container Market GR — Lead admin notes (CRM internal)
-- =============================================================================

alter table leads
  add column if not exists admin_notes text not null default '';
