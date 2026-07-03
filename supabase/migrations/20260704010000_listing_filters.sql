-- Listing filters: stock condition + special offer flag

create type stock_condition as enum ('new', 'used');

alter table listings
  add column if not exists stock_condition stock_condition not null default 'used',
  add column if not exists is_offer boolean not null default false;

create index if not exists listings_is_offer_idx on listings (is_offer) where is_offer = true;
create index if not exists listings_stock_condition_idx on listings (stock_condition);
