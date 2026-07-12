-- =============================================================================
-- Container Market GR — External depot offer recipients
-- Author: Katsoulakis
-- Date: 2026-07-12
-- Description: Allow depot_dispatches without CRM representative
-- =============================================================================

alter table depot_dispatches
  alter column representative_id drop not null;

alter table depot_dispatches
  add column if not exists recipient_label text;

alter table depot_dispatches
  add constraint depot_dispatches_recipient_check
  check (
    representative_id is not null
    or nullif(trim(recipient_label), '') is not null
  );
