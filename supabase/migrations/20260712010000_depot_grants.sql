-- =============================================================================
-- Container Market GR — Depot table grants for service_role
-- Author: Katsoulakis
-- Date: 2026-07-12
-- =============================================================================

grant select, insert, update, delete on public.depot_representatives to service_role;
grant select, insert, update, delete on public.depot_containers to service_role;
grant select, insert, update, delete on public.depot_dispatches to service_role;
