import { HUB_MAP, MAP_COLS, MAP_ROWS, TILE_SIZE, BUILDINGS, HubBuilding } from "@/data/hubMapData";
import { Vec2 } from "./types";

const SOLID_TILES = new Set(["#", "~"]);

export function isSolidTile(tileX: number, tileY: number): boolean {
  if (tileX < 0 || tileX >= MAP_COLS || tileY < 0 || tileY >= MAP_ROWS) return true;
  return SOLID_TILES.has(HUB_MAP[tileY][tileX]);
}

function isInsideBuilding(worldX: number, worldY: number): boolean {
  const tileX = worldX / TILE_SIZE;
  const tileY = worldY / TILE_SIZE;
  for (const b of BUILDINGS) {
    if (tileX >= b.x && tileX < b.x + b.w && tileY >= b.y && tileY < b.y + b.h) {
      return true;
    }
  }
  return false;
}

export function isSolidWorld(worldX: number, worldY: number): boolean {
  const tileX = Math.floor(worldX / TILE_SIZE);
  const tileY = Math.floor(worldY / TILE_SIZE);
  return isSolidTile(tileX, tileY) || isInsideBuilding(worldX, worldY);
}

function collidesAt(cx: number, cy: number, halfW: number, halfH: number): boolean {
  const left = cx - halfW;
  const right = cx + halfW - 1;
  const top = cy - halfH;
  const bottom = cy + halfH - 1;
  return (
    isSolidWorld(left, top) ||
    isSolidWorld(right, top) ||
    isSolidWorld(left, bottom) ||
    isSolidWorld(right, bottom)
  );
}

// Axis-separated movement: resolving X and Y independently gives wall-sliding
// for free — a diagonal move into a corner keeps whichever axis is still clear.
export function resolveCollision(pos: Vec2, dx: number, dy: number, halfW: number, halfH: number): Vec2 {
  let { x, y } = pos;

  const nextX = x + dx;
  if (!collidesAt(nextX, y, halfW, halfH)) {
    x = nextX;
  }

  const nextY = y + dy;
  if (!collidesAt(x, nextY, halfW, halfH)) {
    y = nextY;
  }

  return { x, y };
}

// The player's collision box half-extent, in pixels. Lives here (rather than
// only in the engine) so tests can assert what a *body* can do rather than
// what a dimensionless point can do — a point fits down a 1-tile gap that the
// player's actual box does not.
export const PLAYER_HALF_PX = 10;

/**
 * Can the player's whole collision box occupy this position?
 *
 * Checks all four corners, matching resolveCollision. Prefer this over
 * isSolidWorld in tests: isSolidWorld is a point test, and a tile centre can
 * be "walkable" while the player standing there clips the building next door.
 */
export function canPlayerStandAt(px: number, py: number, half = PLAYER_HALF_PX): boolean {
  return (
    !isSolidWorld(px - half, py - half) &&
    !isSolidWorld(px + half - 1, py - half) &&
    !isSolidWorld(px - half, py + half - 1) &&
    !isSolidWorld(px + half - 1, py + half - 1)
  );
}

// How far from a building's edge the player can stand and still interact.
//
// 2.0 is the minimum value that works, not a taste call: collision confines a
// player walking the main street to ty in [9.31, 10.0), which is an edge
// distance of [1.31, 2.0) from the building band ending at y=8. The previous
// value of 1 meant *neither street fired any trigger at all* — you had to step
// off the road onto the grass, even though the lamp posts guide you down the
// road. Lowering this silently reintroduces that bug; hub-trigger.test.ts
// walks both streets to catch it.
export const TRIGGER_PAD_TILES = 2.0;

/**
 * Distance in tiles from a point to a building's footprint rectangle.
 * Zero when the point is inside the footprint.
 */
export function distanceToFootprint(b: HubBuilding, tx: number, ty: number): number {
  const dx = Math.max(b.x - tx, 0, tx - (b.x + b.w));
  const dy = Math.max(b.y - ty, 0, ty - (b.y + b.h));
  return Math.hypot(dx, dy);
}

/**
 * The building the player can currently interact with, or null.
 *
 * Gate on edge distance, then pick the nearest edge (ties broken by centre
 * distance, then array order). Edge distance rather than centre distance is
 * what makes the 2-tile exit portal and the 4-tile arcades feel the same to
 * walk up to. This replaces a first-match-in-rect scan whose padded rects
 * overlapped between neighbours, so the earlier array entry always won.
 */
export function nearestBuilding(px: number, py: number): HubBuilding | null {
  const tx = px / TILE_SIZE;
  const ty = py / TILE_SIZE;

  let best: HubBuilding | null = null;
  let bestEdge = Infinity;
  let bestCentre = Infinity;

  for (const b of BUILDINGS) {
    const edge = distanceToFootprint(b, tx, ty);
    if (edge > TRIGGER_PAD_TILES) continue;

    const centre = Math.hypot(tx - (b.x + b.w / 2), ty - (b.y + b.h / 2));
    const clearlyNearer = edge < bestEdge - 1e-6;
    const tiedButMoreCentred = Math.abs(edge - bestEdge) <= 1e-6 && centre < bestCentre;

    if (clearlyNearer || tiedButMoreCentred) {
      best = b;
      bestEdge = edge;
      bestCentre = centre;
    }
  }

  return best;
}

export const WORLD_WIDTH = MAP_COLS * TILE_SIZE;
export const WORLD_HEIGHT = MAP_ROWS * TILE_SIZE;
