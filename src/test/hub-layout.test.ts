import { describe, it, expect } from "vitest";
import {
  BUILDINGS,
  HUB_MAP,
  MAP_COLS,
  MAP_ROWS,
  MAIN_STREET_ROW,
  SIDE_LANE_ROW,
  SPINE_COL,
  SPAWN_TILE,
  SPAWN_WORLD,
  TILE_SIZE,
} from "@/data/hubMapData";
import {
  isSolidWorld,
  canPlayerStandAt,
  distanceToFootprint,
  TRIGGER_PAD_TILES,
} from "@/arcade/engine/tilemap";

const tileCentre = (tx: number, ty: number) => ({
  px: (tx + 0.5) * TILE_SIZE,
  py: (ty + 0.5) * TILE_SIZE,
});

function insideAnyFootprint(tx: number, ty: number) {
  return BUILDINGS.find(
    (b) => tx >= b.x && tx < b.x + b.w && ty >= b.y && ty < b.y + b.h
  );
}

describe("hub layout: drawn terrain never contradicts building footprints", () => {
  // Regression for the spine being painted straight through three solid
  // buildings — the game drew a street the player could not walk down.
  it("no path tile lies inside a building footprint", () => {
    for (let ty = 0; ty < MAP_ROWS; ty++) {
      for (let tx = 0; tx < MAP_COLS; tx++) {
        if (HUB_MAP[ty][tx] !== "=") continue;
        const clash = insideAnyFootprint(tx, ty);
        expect(clash, `path tile (${tx},${ty}) is inside ${clash?.slug}`).toBeUndefined();
      }
    }
  });

  // Regression for the pond being drawn underneath grid-filler.
  it("no water tile lies inside a building footprint", () => {
    for (let ty = 0; ty < MAP_ROWS; ty++) {
      for (let tx = 0; tx < MAP_COLS; tx++) {
        if (HUB_MAP[ty][tx] !== "~") continue;
        const clash = insideAnyFootprint(tx, ty);
        expect(clash, `water tile (${tx},${ty}) is inside ${clash?.slug}`).toBeUndefined();
      }
    }
  });
});

describe("hub layout: the drawn streets are actually walkable", () => {
  // canPlayerStandAt, not isSolidWorld: the player is a box, not a point. The
  // spine was once "clear" by a point test while the player's collision box
  // clipped the kiosk flush against it, blocking the corridor completely.
  it("the spine column is traversable by the player's collision box", () => {
    for (let ty = 3; ty < MAP_ROWS - 3; ty++) {
      const { px, py } = tileCentre(SPINE_COL, ty);
      expect(canPlayerStandAt(px, py), `spine blocked at row ${ty}`).toBe(true);
    }
  });

  it.each([
    ["main street", MAIN_STREET_ROW],
    ["side lane", SIDE_LANE_ROW],
  ])("%s is traversable by the player's collision box", (_label, row) => {
    for (let tx = 3; tx < MAP_COLS - 3; tx++) {
      const { px, py } = tileCentre(tx, row);
      expect(canPlayerStandAt(px, py), `blocked at col ${tx}`).toBe(true);
    }
  });

  // Asserts the exact world position the engine spawns at, not a tile centre
  // computed independently — otherwise the test can pass while the engine
  // spawns somewhere else entirely, which is how the wedged-spawn bug hid.
  it("the player's collision box fits at the engine's actual spawn position", () => {
    expect(canPlayerStandAt(SPAWN_WORLD.x * TILE_SIZE, SPAWN_WORLD.y * TILE_SIZE)).toBe(true);
  });
});

describe("hub layout: every building is reachable from spawn", () => {
  // The strongest invariant in the suite. A flood fill over walkable tiles
  // subsumes both "the streets are walkable" and "the trigger zones can
  // actually be stood in", so any future layout edit that strands a building
  // fails here rather than in a play session.
  it("a walkable path exists from spawn to every building's trigger zone", () => {
    const seen = new Set<string>();
    const queue: [number, number][] = [[SPAWN_TILE.x, SPAWN_TILE.y]];
    seen.add(`${SPAWN_TILE.x},${SPAWN_TILE.y}`);

    while (queue.length) {
      const [tx, ty] = queue.shift()!;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = tx + dx;
        const ny = ty + dy;
        const key = `${nx},${ny}`;
        if (seen.has(key)) continue;
        if (nx < 0 || ny < 0 || nx >= MAP_COLS || ny >= MAP_ROWS) continue;
        const { px, py } = tileCentre(nx, ny);
        if (!canPlayerStandAt(px, py)) continue;
        seen.add(key);
        queue.push([nx, ny]);
      }
    }

    const spawn = tileCentre(SPAWN_TILE.x, SPAWN_TILE.y);
    expect(canPlayerStandAt(spawn.px, spawn.py), "player cannot fit at spawn").toBe(true);

    for (const b of BUILDINGS) {
      const reachable = [...seen].some((key) => {
        const [tx, ty] = key.split(",").map(Number);
        return distanceToFootprint(b, tx + 0.5, ty + 0.5) <= TRIGGER_PAD_TILES;
      });
      expect(reachable, `${b.slug} has no reachable tile within its trigger zone`).toBe(true);
    }
  });
});
