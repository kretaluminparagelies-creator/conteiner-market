/**
 * @file listing-detail-peers.ts
 * @description Split same-category listings for modal side peers
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { Listing } from "@/lib/types/listing";

export function getPeerListings(categoryListings: Listing[], activeSlug: string): Listing[] {
  return categoryListings.filter((listing) => listing.slug !== activeSlug);
}

/** Alternate peers left / right — no cap; columns scroll when many */
export function splitPeersForSides(peers: Listing[]): { left: Listing[]; right: Listing[] } {
  const left: Listing[] = [];
  const right: Listing[] = [];

  peers.forEach((peer, index) => {
    if (index % 2 === 0) left.push(peer);
    else right.push(peer);
  });

  return { left, right };
}
