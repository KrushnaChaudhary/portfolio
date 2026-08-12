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

export interface EnginePalette {
  background: string;
  surface1: string;
  surface2: string;
  border: string;
  primary: string;
  foreground: string;
  mutedForeground: string;
}

export interface HubEngineOptions {
  onProximityChange: (buildingSlug: string | null) => void;
  onNavigate: (target: string) => void;
  // Resolved (hashed) image URLs, keyed by building slug. The engine only
  // assigns these to an <img> — and so only triggers the network fetch —
  // once the player is within POSTER_LOAD_RADIUS of that building.
  posterSources: Record<string, string>;
}
