import { SPAWN_TILE, TILE_SIZE } from "@/data/hubMapData";
import { HubEngineOptions, EnginePalette, Vec2 } from "./types";
import { resolveCollision, nearestBuilding, WORLD_WIDTH, WORLD_HEIGHT } from "./tilemap";
import { createStaticLayer, drawFrame } from "./renderer";
import { InputController } from "./input";

const PLAYER_HALF_W = 10;
const PLAYER_HALF_H = 10;
const PLAYER_SPEED = 170; // px/sec
const FIXED_STEP = 1 / 60;
const MAX_CATCHUP_STEPS = 5;
const POSTER_LOAD_RADIUS = 1.5; // screens

function readPalette(): EnginePalette {
  const style = getComputedStyle(document.documentElement);
  const hsl = (name: string) => `hsl(${style.getPropertyValue(name).trim()})`;
  return {
    background: hsl("--background"),
    surface1: hsl("--surface-1"),
    surface2: hsl("--surface-2"),
    border: hsl("--border"),
    primary: hsl("--primary"),
    foreground: hsl("--foreground"),
    mutedForeground: hsl("--muted-foreground"),
  };
}

export class HubEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private options: HubEngineOptions;
  private input = new InputController();
  private staticLayer: OffscreenCanvas | HTMLCanvasElement;
  private posters = new Map<string, HTMLImageElement>();

  private player = { x: 0, y: 0, animTime: 0, facing: "down" as const };
  private camera = { x: 0, y: 0, viewW: 0, viewH: 0 };
  private dpr = 1;

  private nearestSlug: string | null = null;
  private rafId = 0;
  private lastTime = 0;
  private accumulator = 0;
  private running = false;
  private resizeObserver: ResizeObserver;
  private visibilityHandler = () => {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  };

  constructor(canvas: HTMLCanvasElement, options: HubEngineOptions) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.options = options;

    this.player.x = SPAWN_TILE.x * TILE_SIZE;
    this.player.y = SPAWN_TILE.y * TILE_SIZE;

    this.staticLayer = createStaticLayer(readPalette());

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();

    this.input.attach();
    document.addEventListener("visibilitychange", this.visibilityHandler);

    this.running = true;
    this.rafId = requestAnimationFrame(this.tick);
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.round(rect.width * this.dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * this.dpr));
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.camera.viewW = rect.width;
    this.camera.viewH = rect.height;
  }

  setJoystickVector(vec: Vec2 | null) {
    this.input.setJoystickVector(vec);
  }

  triggerInteract() {
    this.input.queueInteract();
  }

  private pause() {
    this.running = false;
  }

  private resume() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    if (!this.running) return;
    if (!this.lastTime) this.lastTime = now;
    let delta = (now - this.lastTime) / 1000;
    this.lastTime = now;
    delta = Math.min(delta, FIXED_STEP * MAX_CATCHUP_STEPS);
    this.accumulator += delta;

    let steps = 0;
    while (this.accumulator >= FIXED_STEP && steps < MAX_CATCHUP_STEPS) {
      this.update(FIXED_STEP);
      this.accumulator -= FIXED_STEP;
      steps++;
    }

    this.render();
    this.rafId = requestAnimationFrame(this.tick);
  };

  private update(dt: number) {
    this.input.update();
    const { x: ix, y: iy } = this.input;

    if (ix !== 0 || iy !== 0) {
      this.player.animTime += dt;
      if (Math.abs(ix) > Math.abs(iy)) {
        this.player.facing = ix > 0 ? "right" : "left";
      } else {
        this.player.facing = iy > 0 ? "down" : "up";
      }
    }

    const next = resolveCollision(
      { x: this.player.x, y: this.player.y },
      ix * PLAYER_SPEED * dt,
      iy * PLAYER_SPEED * dt,
      PLAYER_HALF_W,
      PLAYER_HALF_H
    );
    this.player.x = Math.max(0, Math.min(WORLD_WIDTH, next.x));
    this.player.y = Math.max(0, Math.min(WORLD_HEIGHT, next.y));

    // Camera: lerp toward player, clamped to world bounds
    const targetX = Math.max(
      0,
      Math.min(WORLD_WIDTH - this.camera.viewW, this.player.x - this.camera.viewW / 2)
    );
    const targetY = Math.max(
      0,
      Math.min(WORLD_HEIGHT - this.camera.viewH, this.player.y - this.camera.viewH / 2)
    );
    const lerpFactor = 1 - Math.pow(0.001, dt);
    this.camera.x += (targetX - this.camera.x) * lerpFactor;
    this.camera.y += (targetY - this.camera.y) * lerpFactor;

    const building = nearestBuilding(this.player.x, this.player.y);
    const slug = building?.slug ?? null;
    if (slug !== this.nearestSlug) {
      this.nearestSlug = slug;
      this.options.onProximityChange(slug);
    }
    if (building) {
      this.loadPosterIfNeeded(building.slug);
    }

    if (this.input.consumeInteract() && building) {
      this.options.onNavigate(building.target);
    }
    if (this.input.consumeEscape()) {
      this.options.onNavigate("/");
    }
  }

  private loadPosterIfNeeded(slug: string) {
    if (this.posters.has(slug)) return;
    const src = this.options.posterSources[slug];
    if (!src) return;
    const img = new Image();
    img.src = src;
    this.posters.set(slug, img);
  }

  private render() {
    drawFrame(
      this.ctx,
      this.staticLayer,
      this.camera,
      this.player,
      this.nearestSlug,
      readPalette(),
      this.posters
    );
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.resizeObserver.disconnect();
    this.input.detach();
    document.removeEventListener("visibilitychange", this.visibilityHandler);
  }
}
