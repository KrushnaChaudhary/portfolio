export interface Vec2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Import type only, to keep this file dependency-light and avoid a cycle
// (hologram.ts imports scene3d.ts's ScenePalette, not this file).
import type { HologramSpec } from "./hologram";

export interface HubEngineOptions {
  onProximityChange: (buildingSlug: string | null) => void;
  onNavigate: (target: string) => void;
  // Built in React from projectsData, so the engine itself never imports the
  // data layer. images are resolved (hashed) URLs; the engine only requests
  // them over the network once the player is within load range of that
  // building, and cycles through them as a slideshow once loaded.
  hologramSpecs: HologramSpec[];
}
