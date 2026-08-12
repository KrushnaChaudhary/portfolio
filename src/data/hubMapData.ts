// Hand-placed arcade hub world: a 48x32 tile plaza (32px tiles = 1536x1024 world px).
// Tile legend: '.' grass (walkable) · '#' wall/hedge (blocking) · '=' path (walkable) · '~' water (blocking)
//
// Layout rule: every building band sits on its own row range, separated from
// every path and every other band by at least one fully empty tile-row. That
// guarantees no building can overlap another, and that the player's collision
// box (which has real width/height, not a point) never spawns already
// touching a building even when standing right at a path's edge.
export const TILE_SIZE = 32;
export const MAP_COLS = 48;
export const MAP_ROWS = 32;

// Exported so the layout/trigger tests can assert against the real streets
// rather than re-declaring magic numbers that could drift out of sync.
export const MAIN_STREET_ROW = 9;
export const SIDE_LANE_ROW = 27;
// Column 25 is deliberate: it is the only column free of every building in all
// three bands, so the drawn spine is actually walkable end to end. (It was 24,
// which ran straight through dominoes-logic, the exit portal and the contact
// kiosk — a street the player could not use.)
export const SPINE_COL = 25;

function buildMap(): string[] {
  const rows: string[][] = [];
  for (let y = 0; y < MAP_ROWS; y++) {
    const row: string[] = [];
    for (let x = 0; x < MAP_COLS; x++) {
      const isBorder = x === 0 || y === 0 || x === MAP_COLS - 1 || y === MAP_ROWS - 1;
      row.push(isBorder ? "#" : ".");
    }
    rows.push(row);
  }

  for (let x = 3; x < MAP_COLS - 3; x++) {
    rows[MAIN_STREET_ROW][x] = "=";
    rows[SIDE_LANE_ROW][x] = "=";
  }
  for (let y = 3; y < MAP_ROWS - 3; y++) {
    rows[y][SPINE_COL] = "=";
  }

  // Decorative pond in the north-west corner. x stops at 5 so it stays clear of
  // grid-filler (x6-9) — it previously ran to x8 and was drawn underneath it.
  // hub-layout.test.ts asserts no water tile lands inside any footprint.
  for (let y = 3; y <= 6; y++) {
    for (let x = 2; x <= 5; x++) {
      rows[y][x] = "~";
    }
  }

  return rows.map((row) => row.join(""));
}

export const HUB_MAP = buildMap();

// Spawn mid-plaza (not on the main street) so the camera has world in every
// direction rather than looking straight off the map's north edge.
export const SPAWN_TILE = { x: SPINE_COL, y: 20 };

/**
 * Spawn position in world units (1 unit = 1 tile).
 *
 * The +0.5 centres the player in the tile. Integer coordinates are tile
 * *edges*, so spawning on one puts half the player's collision box in the
 * neighbouring tile — which silently wedged them against the kiosk beside the
 * spine. Engine and tests both read this so the convention can't drift.
 */
export const SPAWN_WORLD = { x: SPAWN_TILE.x + 0.5, y: SPAWN_TILE.y + 0.5 };

export type BuildingKind = "arcade" | "kiosk" | "portal";

export interface HubBuilding {
  slug: string;
  x: number; // top-left tile
  y: number;
  w: number; // footprint, tiles
  h: number;
  sign: string;
  kind: BuildingKind;
  target: string; // route to navigate to on interact
}

// Bands (by row), each with >=1 empty tile-row of clearance on every side:
//   rows 5-7   main street buildings (shipped titles)  | gap row 8 | path row 9
//   row 12     exit portal, in the plaza pocket off the spine
//   rows 15-16 kiosks (skills / contact / career)
//   rows 23-25 side-lane buildings (prototypes)        | gap row 26 | path row 27
// These invariants are enforced by hub-layout.test.ts, not just by convention.
export const BUILDINGS: HubBuilding[] = [
  { slug: "grid-filler", x: 6, y: 5, w: 4, h: 3, sign: "GRID FILLER", kind: "arcade", target: "/project/grid-filler" },
  { slug: "puzzles-and-cats", x: 11, y: 5, w: 4, h: 3, sign: "PUZZLES & CATS", kind: "arcade", target: "/project/puzzles-and-cats" },
  { slug: "boarding-rush", x: 16, y: 5, w: 4, h: 3, sign: "BOARDING RUSH", kind: "arcade", target: "/project/boarding-rush" },
  { slug: "dominoes-logic", x: 21, y: 5, w: 4, h: 3, sign: "DOMINOES LOGIC", kind: "arcade", target: "/project/dominoes-logic" },
  { slug: "animal-park", x: 26, y: 5, w: 4, h: 3, sign: "ANIMAL PARK", kind: "arcade", target: "/project/animal-park" },
  { slug: "monster-mayhem", x: 31, y: 5, w: 4, h: 3, sign: "MONSTER MAYHEM", kind: "arcade", target: "/project/monster-mayhem" },
  { slug: "mini-golf", x: 36, y: 5, w: 4, h: 3, sign: "MINI GOLF", kind: "arcade", target: "/project/mini-golf" },

  // Sits off the spine in the plaza pocket. At its old spot (23,11) it was both
  // on the spine and close enough to the main street that its trigger tied with
  // animal-park — a casual E-press while walking would eject you from the world.
  { slug: "exit-portal", x: 27, y: 12, w: 2, h: 1, sign: "EXIT TO MENU", kind: "portal", target: "/" },

  { slug: "skills-kiosk", x: 12, y: 15, w: 3, h: 2, sign: "SKILL TREE", kind: "kiosk", target: "/#skills" },
  { slug: "contact-kiosk", x: 21, y: 15, w: 4, h: 2, sign: "CONTACT", kind: "kiosk", target: "/#contact" },
  { slug: "career-kiosk", x: 32, y: 15, w: 3, h: 2, sign: "QUEST LOG", kind: "kiosk", target: "/#career" },

  { slug: "color-water-trip", x: 8, y: 23, w: 4, h: 3, sign: "COLOR WATER TRIP", kind: "arcade", target: "/project/color-water-trip" },
  { slug: "planetation", x: 14, y: 23, w: 4, h: 3, sign: "PLANETATION", kind: "arcade", target: "/project/planetation" },
  { slug: "looper", x: 20, y: 23, w: 4, h: 3, sign: "LOOPER", kind: "arcade", target: "/project/looper" },
  { slug: "rann-bhumi", x: 26, y: 23, w: 4, h: 3, sign: "RANN BHUMI", kind: "arcade", target: "/project/rann-bhumi" },
  { slug: "rummy-3d", x: 32, y: 23, w: 4, h: 3, sign: "RUMMY 3D", kind: "arcade", target: "/project/rummy-3d" },
];
