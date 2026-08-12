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

const TRIGGER_PAD_TILES = 1;

export function nearestBuilding(px: number, py: number): HubBuilding | null {
  for (const b of BUILDINGS) {
    const x0 = (b.x - TRIGGER_PAD_TILES) * TILE_SIZE;
    const y0 = (b.y - TRIGGER_PAD_TILES) * TILE_SIZE;
    const x1 = (b.x + b.w + TRIGGER_PAD_TILES) * TILE_SIZE;
    const y1 = (b.y + b.h + TRIGGER_PAD_TILES) * TILE_SIZE;
    if (px >= x0 && px < x1 && py >= y0 && py < y1) {
      return b;
    }
  }
  return null;
}

export const WORLD_WIDTH = MAP_COLS * TILE_SIZE;
export const WORLD_HEIGHT = MAP_ROWS * TILE_SIZE;
