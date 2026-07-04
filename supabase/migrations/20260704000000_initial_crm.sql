-- =============================================================================
-- Container Market GR — Migration 001: Initial CRM schema
-- Author: Katsoulakis
-- Date: 2026-07-04
-- Project: conteiner-market
-- File: 20260704000000_initial_crm.sql
-- Description: Listings + leads tables, enums, indexes
-- =============================================================================

create extension if not exists "pgcrypto";

create type listing_type as enum ('sale', 'rent');
create type lead_status as enum ('new', 'contacted', 'quoted', 'won', 'lost');
create type lead_source as enum ('contact', 'buyback', 'rent', 'space', 'listing');

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  type text not null,
  condition text not null,
  condition_en text,
  price numeric not null,
  price_formatted text not null,
  unit text default '',
  unit_en text,
  location text not null,
  location_en text,
  listing_type listing_type not null,
  image text not null,
  images jsonb,
  description text not null,
  description_en text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  source lead_source not null default 'contact',
  status lead_status not null default 'new',
  listing_slug text references listings (slug) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_active_idx on listings (active);
create index if not exists listings_listing_type_idx on listings (listing_type);
create index if not exists leads_status_idx on leads (status);
create index if not exists leads_created_at_idx on leads (created_at desc);
