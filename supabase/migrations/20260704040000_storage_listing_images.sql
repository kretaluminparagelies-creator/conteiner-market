-- =============================================================================
-- Container Market GR — Migration 005: Listing images storage bucket
-- Author: Katsoulakis
-- Date: 2026-07-04
-- Project: conteiner-market
-- File: 20260704040000_storage_listing_images.sql
-- Description: Public bucket for CRM listing photo uploads
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public read listing images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'listing-images');
