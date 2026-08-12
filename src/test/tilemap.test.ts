import { describe, it, expect } from "vitest";
import { isSolidTile, isSolidWorld, resolveCollision, nearestBuilding } from "@/arcade/engine/tilemap";
import { MAP_COLS, MAP_ROWS, SPAWN_TILE, TILE_SIZE, BUILDINGS } from "@/data/hubMapData";

describe("tilemap", () => {
  it("treats the map border as solid", () => {
    expect(isSolidTile(0, 0)).toBe(true);
    expect(isSolidTile(MAP_COLS - 1, MAP_ROWS - 1)).toBe(true);
  });

  it("treats out-of-bounds tiles as solid", () => {
    expect(isSolidTile(-1, 5)).toBe(true);
    expect(isSolidTile(5, MAP_ROWS + 5)).toBe(true);
  });

  it("spawn tile is walkable", () => {
    expect(isSolidTile(SPAWN_TILE.x, SPAWN_TILE.y)).toBe(false);
  });

  it("treats points inside a building footprint as solid", () => {
    const b = BUILDINGS.find((building) => building.slug === "grid-filler")!;
    const centerX = (b.x + b.w / 2) * TILE_SIZE;
    const centerY = (b.y + b.h / 2) * TILE_SIZE;
    expect(isSolidWorld(centerX, centerY)).toBe(true);
  });

  it("does not treat open plaza points as solid", () => {
    expect(isSolidWorld(SPAWN_TILE.x * TILE_SIZE, SPAWN_TILE.y * TILE_SIZE)).toBe(false);
  });
});

describe("resolveCollision", () => {
  it("moves freely through open space", () => {
    const start = { x: SPAWN_TILE.x * TILE_SIZE, y: SPAWN_TILE.y * TILE_SIZE };
    const result = resolveCollision(start, 10, 0, 10, 10);
    expect(result.x).toBe(start.x + 10);
  });

  it("stops at the world border instead of passing through it", () => {
    const start = { x: TILE_SIZE * 1.5, y: TILE_SIZE * 5 };
    const result = resolveCollision(start, -100, 0, 10, 10);
    // Border wall at tile x=0 blocks further leftward motion.
    expect(result.x).toBeGreaterThan(0);
    expect(result.x).toBeLessThanOrEqual(start.x);
  });

  it("wall-slides: a blocked axis does not prevent movement on the open axis", () => {
    // Approach the top border wall diagonally; horizontal motion should still land.
    const start = { x: TILE_SIZE * 5, y: TILE_SIZE * 1.5 };
    const result = resolveCollision(start, 10, -100, 10, 10);
    expect(result.x).toBe(start.x + 10);
    expect(result.y).toBeGreaterThan(0);
  });
});

describe("nearestBuilding", () => {
  it("finds the building whose padded trigger contains the point", () => {
    const b = BUILDINGS.find((building) => building.slug === "grid-filler")!;
    const centerX = (b.x + b.w / 2) * TILE_SIZE;
    const centerY = (b.y + b.h / 2) * TILE_SIZE;
    expect(nearestBuilding(centerX, centerY)?.slug).toBe("grid-filler");
  });

  it("returns null far from every building", () => {
    expect(nearestBuilding(TILE_SIZE * 1, TILE_SIZE * 1)).toBeNull();
  });
});
