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

const MAIN_STREET_ROW = 9;
const SIDE_LANE_ROW = 27;
const SPINE_COL = 24;

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

  // Decorative pond, tucked away from every path and building footprint.
  for (let y = 3; y <= 6; y++) {
    for (let x = 3; x <= 8; x++) {
      rows[y][x] = "~";
    }
  }

  return rows.map((row) => row.join(""));
}

export const HUB_MAP = buildMap();

export const SPAWN_TILE = { x: SPINE_COL, y: MAIN_STREET_ROW };

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
//   row 10     exit portal, right behind spawn
//   rows 15-16 kiosks (skills / career / contact)
//   rows 23-25 side-lane buildings (prototypes)        | gap row 26 | path row 27
export const BUILDINGS: HubBuilding[] = [
  { slug: "grid-filler", x: 6, y: 5, w: 4, h: 3, sign: "GRID FILLER", kind: "arcade", target: "/project/grid-filler" },
  { slug: "puzzles-and-cats", x: 11, y: 5, w: 4, h: 3, sign: "PUZZLES & CATS", kind: "arcade", target: "/project/puzzles-and-cats" },
  { slug: "boarding-rush", x: 16, y: 5, w: 4, h: 3, sign: "BOARDING RUSH", kind: "arcade", target: "/project/boarding-rush" },
  { slug: "dominoes-logic", x: 21, y: 5, w: 4, h: 3, sign: "DOMINOES LOGIC", kind: "arcade", target: "/project/dominoes-logic" },
  { slug: "animal-park", x: 26, y: 5, w: 4, h: 3, sign: "ANIMAL PARK", kind: "arcade", target: "/project/animal-park" },
  { slug: "monster-mayhem", x: 31, y: 5, w: 4, h: 3, sign: "MONSTER MAYHEM", kind: "arcade", target: "/project/monster-mayhem" },
  { slug: "mini-golf", x: 36, y: 5, w: 4, h: 3, sign: "MINI GOLF", kind: "arcade", target: "/project/mini-golf" },

  { slug: "exit-portal", x: 23, y: 11, w: 2, h: 1, sign: "EXIT TO MENU", kind: "portal", target: "/" },

  { slug: "skills-kiosk", x: 12, y: 15, w: 3, h: 2, sign: "SKILL TREE", kind: "kiosk", target: "/#skills" },
  { slug: "contact-kiosk", x: 21, y: 15, w: 4, h: 2, sign: "CONTACT", kind: "kiosk", target: "/#contact" },
  { slug: "career-kiosk", x: 32, y: 15, w: 3, h: 2, sign: "QUEST LOG", kind: "kiosk", target: "/#career" },

  { slug: "color-water-trip", x: 8, y: 23, w: 4, h: 3, sign: "COLOR WATER TRIP", kind: "arcade", target: "/project/color-water-trip" },
  { slug: "planetation", x: 14, y: 23, w: 4, h: 3, sign: "PLANETATION", kind: "arcade", target: "/project/planetation" },
  { slug: "looper", x: 20, y: 23, w: 4, h: 3, sign: "LOOPER", kind: "arcade", target: "/project/looper" },
  { slug: "rann-bhumi", x: 26, y: 23, w: 4, h: 3, sign: "RANN BHUMI", kind: "arcade", target: "/project/rann-bhumi" },
  { slug: "rummy-3d", x: 32, y: 23, w: 4, h: 3, sign: "RUMMY 3D", kind: "arcade", target: "/project/rummy-3d" },
];
