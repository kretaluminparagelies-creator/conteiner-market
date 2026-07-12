-- =============================================================================
-- Container Market GR — Depot inventory (field app)
-- Author: Katsoulakis
-- Date: 2026-07-12
-- Description: depot_containers, depot_representatives, depot_dispatches
-- =============================================================================

create type depot_grade as enum ('A', 'B', 'C');

create type depot_container_status as enum (
  'available',
  'sent_offer',
  'with_rep_storage',
  'reserved',
  'sold',
  'rented',
  'withdrawn'
);

create type depot_dispatch_type as enum ('offer', 'free_storage');

create table if not exists depot_representatives (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists depot_containers (
  id uuid primary key default gen_random_uuid(),
  container_number text unique not null,
  container_type text not null,
  grade depot_grade not null,
  status depot_container_status not null default 'available',
  sale_price numeric,
  rent_price numeric,
  notes text,
  images jsonb not null default '[]'::jsonb,
  recorded_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists depot_dispatches (
  id uuid primary key default gen_random_uuid(),
  container_id uuid not null references depot_containers (id) on delete cascade,
  representative_id uuid not null references depot_representatives (id) on delete restrict,
  dispatch_type depot_dispatch_type not null,
  sent_by_email text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists depot_containers_status_idx on depot_containers (status);
create index if not exists depot_containers_type_idx on depot_containers (container_type);
create index if not exists depot_containers_created_at_idx on depot_containers (created_at desc);
create index if not exists depot_dispatches_container_idx on depot_dispatches (container_id);
create index if not exists depot_dispatches_representative_idx on depot_dispatches (representative_id);
create index if not exists depot_dispatches_created_at_idx on depot_dispatches (created_at desc);
