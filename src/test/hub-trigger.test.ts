import { describe, it, expect } from "vitest";
import {
  BUILDINGS,
  MAP_COLS,
  MAIN_STREET_ROW,
  SIDE_LANE_ROW,
  TILE_SIZE,
} from "@/data/hubMapData";
import { nearestBuilding, isSolidWorld } from "@/arcade/engine/tilemap";

// Collision keeps the player's centre inside the road tile, so probe from a
// point they can genuinely occupy. The previous tests probed building CENTRES,
// which sit inside the solid footprint and are physically unreachable — which
// is exactly why "no trigger fires on either street" went unnoticed.
const WALK_OFFSET = 0.65;

const streetProbe = (tx: number, row: number) => ({
  px: (tx + 0.5) * TILE_SIZE,
  py: (row + WALK_OFFSET) * TILE_SIZE,
});

const STREETS = [
  ["main street", MAIN_STREET_ROW],
  ["side lane", SIDE_LANE_ROW],
] as const;

describe("hub triggers: probes must be reachable", () => {
  // Meta-test. If this fails, every assertion below is testing a position the
  // player can never stand in, and is therefore worthless.
  it.each(STREETS)("every probe position along the %s is walkable", (_label, row) => {
    for (let tx = 3; tx < MAP_COLS - 3; tx++) {
      const { px, py } = streetProbe(tx, row);
      expect(isSolidWorld(px, py), `probe at col ${tx} is inside solid geometry`).toBe(false);
    }
  });
});

describe("hub triggers: walking the streets actually works", () => {
  // The single assertion that the old TRIGGER_PAD_TILES = 1 failed.
  it.each(STREETS)("at least one building is interactable from the %s", (_label, row) => {
    const hits = [];
    for (let tx = 3; tx < MAP_COLS - 3; tx++) {
      const { px, py } = streetProbe(tx, row);
      const hit = nearestBuilding(px, py);
      if (hit) hits.push(hit.slug);
    }
    expect(hits.length, "no building was interactable anywhere along this street").toBeGreaterThan(0);
  });

  it.each(STREETS)("every building on the %s is reachable from the road", (_label, row) => {
    // Buildings whose footprint sits directly against this street.
    const band = BUILDINGS.filter(
      (b) => b.kind === "arcade" && Math.abs(b.y + b.h - row) <= 2
    );
    expect(band.length, "expected buildings alongside this street").toBeGreaterThan(0);

    const reachable = new Set<string>();
    for (let tx = 3; tx < MAP_COLS - 3; tx++) {
      const { px, py } = streetProbe(tx, row);
      const hit = nearestBuilding(px, py);
      if (hit) reachable.add(hit.slug);
    }

    for (const b of band) {
      expect(reachable.has(b.slug), `${b.slug} is never selectable from the road`).toBe(true);
    }
  });

  it("standing in front of a building selects that building", () => {
    const band = BUILDINGS.filter((b) => b.kind === "arcade" && b.y + b.h <= MAIN_STREET_ROW);
    for (const b of band) {
      const centreCol = b.x + b.w / 2 - 0.5;
      const { px, py } = streetProbe(centreCol, MAIN_STREET_ROW);
      expect(nearestBuilding(px, py)?.slug, `wrong building in front of ${b.slug}`).toBe(b.slug);
    }
  });
});

describe("hub triggers: selection picks the nearest, not the first in the array", () => {
  it("either side of a gap column selects the neighbour on that side", () => {
    const band = BUILDINGS.filter((b) => b.kind === "arcade" && b.y + b.h <= MAIN_STREET_ROW).sort(
      (a, b) => a.x - b.x
    );

    for (let i = 0; i < band.length - 1; i++) {
      const left = band[i];
      const right = band[i + 1];
      const gapCentre = (left.x + left.w + right.x) / 2;

      const leftSide = streetProbe(gapCentre - 1.1, MAIN_STREET_ROW);
      const rightSide = streetProbe(gapCentre + 0.1, MAIN_STREET_ROW);

      expect(nearestBuilding(leftSide.px, leftSide.py)?.slug).toBe(left.slug);
      expect(nearestBuilding(rightSide.px, rightSide.py)?.slug).toBe(right.slug);
    }
  });
});

describe("hub triggers: the exit portal cannot be hit by accident", () => {
  // Pressing E while strolling down a street must never eject the player.
  it.each(STREETS)("the portal is never selected while walking the %s", (_label, row) => {
    for (let tx = 3; tx < MAP_COLS - 3; tx++) {
      const { px, py } = streetProbe(tx, row);
      expect(nearestBuilding(px, py)?.slug, `portal selectable at col ${tx}`).not.toBe(
        "exit-portal"
      );
    }
  });
});

describe("hub triggers: empty ground selects nothing", () => {
  it("returns null in open plaza away from every building", () => {
    // Row 20 is the open plaza band between the kiosks and the side lane.
    const { px, py } = streetProbe(5, 20);
    expect(nearestBuilding(px, py)).toBeNull();
  });
});
