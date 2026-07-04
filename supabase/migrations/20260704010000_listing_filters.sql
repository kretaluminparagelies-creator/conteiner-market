-- =============================================================================
-- Container Market GR — Migration 002: Listing filters
-- Author: Katsoulakis
-- Date: 2026-07-04
-- Project: conteiner-market
-- File: 20260704010000_listing_filters.sql
-- Description: stock_condition + is_offer columns on listings
-- =============================================================================

create type stock_condition as enum ('new', 'used');

alter table listings
  add column if not exists stock_condition stock_condition not null default 'used',
  add column if not exists is_offer boolean not null default false;

create index if not exists listings_is_offer_idx on listings (is_offer) where is_offer = true;
create index if not exists listings_stock_condition_idx on listings (stock_condition);
