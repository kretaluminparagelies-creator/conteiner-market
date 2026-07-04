import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function esc(value) {
  return value.replace(/'/g, "''");
}

function sqlString(value) {
  if (value == null || value === "") return "null";
  return `'${esc(value)}'`;
}

const listingsPath = join(process.cwd(), "src/data/listings.json");
const listings = JSON.parse(readFileSync(listingsPath, "utf8"));

const rows = listings.map((listing) => {
  const images = listing.images?.length
    ? `'${esc(JSON.stringify(listing.images))}'::jsonb`
    : "null";

  return [
    "  (",
    [
      sqlString(listing.slug),
      sqlString(listing.type),
      sqlString(listing.condition),
      sqlString(listing.conditionEn),
      String(listing.price),
      sqlString(listing.priceFormatted),
      sqlString(listing.unit ?? ""),
      sqlString(listing.unitEn ?? ""),
      sqlString(listing.location),
      sqlString(listing.locationEn),
      `'${listing.listingType}'::listing_type`,
      `'${listing.stockCondition ?? "used"}'::stock_condition`,
      listing.isOffer ? "true" : "false",
      sqlString(listing.image),
      images,
      sqlString(listing.description),
      sqlString(listing.descriptionEn),
      listing.active ? "true" : "false",
    ].join(", "),
    ")",
  ].join("");
});

const sql = `-- =============================================================================
-- Container Market GR — Migration 004: Seed listings from listings.json
-- Author: Katsoulakis
-- Date: 2026-07-04
-- Project: conteiner-market
-- File: 20260704030000_seed_listings.sql
-- Description: Initial catalog data (idempotent on slug)
-- =============================================================================

insert into listings (
  slug, type, condition, condition_en, price, price_formatted,
  unit, unit_en, location, location_en, listing_type,
  stock_condition, is_offer, image, images, description, description_en, active
) values
${rows.join(",\n")}
on conflict (slug) do update set
  type = excluded.type,
  condition = excluded.condition,
  condition_en = excluded.condition_en,
  price = excluded.price,
  price_formatted = excluded.price_formatted,
  unit = excluded.unit,
  unit_en = excluded.unit_en,
  location = excluded.location,
  location_en = excluded.location_en,
  listing_type = excluded.listing_type,
  stock_condition = excluded.stock_condition,
  is_offer = excluded.is_offer,
  image = excluded.image,
  images = excluded.images,
  description = excluded.description,
  description_en = excluded.description_en,
  active = excluded.active,
  updated_at = now();
`;

const outPath = join(process.cwd(), "supabase/migrations/20260704030000_seed_listings.sql");
writeFileSync(outPath, sql);
console.log(`Wrote ${outPath} (${listings.length} listings)`);
