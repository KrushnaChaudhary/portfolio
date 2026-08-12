import { describe, it, expect } from "vitest";
import { BUILDINGS, MAP_COLS, MAP_ROWS, HUB_MAP } from "@/data/hubMapData";
import { projectsData, projectsList } from "@/data/projectsData";

describe("hubMapData integrity", () => {
  it("has MAP_ROWS rows of exactly MAP_COLS characters", () => {
    expect(HUB_MAP.length).toBe(MAP_ROWS);
    for (const row of HUB_MAP) {
      expect(row.length).toBe(MAP_COLS);
    }
  });

  it("every arcade building slug resolves to a real project", () => {
    for (const b of BUILDINGS.filter((building) => building.kind === "arcade")) {
      expect(projectsData[b.slug], `${b.slug} has no matching project`).toBeDefined();
    }
  });

  it("every project in the library has a building in the hub", () => {
    const buildingSlugs = new Set(BUILDINGS.map((b) => b.slug));
    for (const project of projectsList) {
      expect(buildingSlugs.has(project.slug), `${project.slug} has no hub building`).toBe(true);
    }
  });

  it("has no duplicate building slugs", () => {
    const slugs = BUILDINGS.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("no two building footprints overlap", () => {
    for (let i = 0; i < BUILDINGS.length; i++) {
      for (let j = i + 1; j < BUILDINGS.length; j++) {
        const a = BUILDINGS[i];
        const b = BUILDINGS[j];
        const overlap = a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
        expect(overlap, `${a.slug} overlaps ${b.slug}`).toBe(false);
      }
    }
  });

  it("every building fits within the map bounds", () => {
    for (const b of BUILDINGS) {
      expect(b.x).toBeGreaterThanOrEqual(1);
      expect(b.y).toBeGreaterThanOrEqual(1);
      expect(b.x + b.w).toBeLessThan(MAP_COLS);
      expect(b.y + b.h).toBeLessThan(MAP_ROWS);
    }
  });
});
