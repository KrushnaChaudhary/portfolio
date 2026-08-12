import * as THREE from "three";
import { SPAWN_WORLD, TILE_SIZE, BUILDINGS } from "@/data/hubMapData";
import { HubEngineOptions, Vec2 } from "./types";
import { resolveCollision, nearestBuilding } from "./tilemap";
import {
  buildScene,
  makePoster,
  disposeOwned,
  SceneRefs,
  ScenePalette,
  WORLD_W,
  WORLD_H,
} from "./scene3d";
import { InputController } from "./input";
import { createCat, CatRig } from "./cat";

const PLAYER_SPEED = 6.2; // world units/sec
const PLAYER_HALF = 10; // px, matches the tested tilemap collision box
// Apex ~0.85 units, airtime ~0.65s — high enough to read clearly under the
// pitched camera without feeling floaty.
const JUMP_VELOCITY = 5.2;
const GRAVITY = 16.0;
const FIXED_STEP = 1 / 60;
const MAX_CATCHUP_STEPS = 5;
const CAMERA_OFFSET = new THREE.Vector3(0, 12.5, 8.5);
// How far ahead of the camera the look-at point sits. Tuned with the height
// above so the frustum's top edge lands on nearby ground — a shallower pitch
// puts the horizon on screen and wastes the top third of the frame on sky.
const LOOK_AHEAD = 7.5;
const SLOW_FRAME_MS = 24;
const SLOW_FRAME_LIMIT = 30;

function readPalette(): ScenePalette {
  const style = getComputedStyle(document.documentElement);
  // Tailwind stores tokens space-separated ("222 24% 7%"); THREE.Color only
  // parses the comma form, and silently falls back to white without it.
  const hsl = (name: string) => {
    const parts = style.getPropertyValue(name).trim().split(/\s+/);
    return `hsl(${parts[0]}, ${parts[1]}, ${parts[2]})`;
  };
  return {
    background: hsl("--background"),
    surface1: hsl("--surface-1"),
    surface2: hsl("--surface-2"),
    surface3: hsl("--surface-3"),
    primary: hsl("--primary"),
    foreground: hsl("--foreground"),
    success: hsl("--success"),
    warning: hsl("--warning"),
  };
}

export class HubEngine3D {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private refs: SceneRefs;
  private options: HubEngineOptions;
  private input = new InputController();
  private palette: ScenePalette;

  // Player position is tracked in world units; collision runs in the tilemap's
  // pixel space so the already-tested resolveCollision/nearestBuilding apply.
  private pos = { x: SPAWN_WORLD.x, z: SPAWN_WORLD.y };
  private facing = 0;
  private cat!: CatRig;
  private y = 0;
  private vy = 0;
  private grounded = true;

  private nearestSlug: string | null = null;
  private loadedPosters = new Set<string>();
  private rafId = 0;
  private lastTime = 0;
  private accumulator = 0;
  private running = false;
  private slowFrames = 0;
  private degraded = false;
  private destroyed = false;

  private resizeObserver: ResizeObserver;
  private canvas: HTMLCanvasElement;

  private visibilityHandler = () => {
    if (document.hidden) this.pause();
    else this.resume();
  };

  constructor(canvas: HTMLCanvasElement, options: HubEngineOptions) {
    this.canvas = canvas;
    this.options = options;
    this.palette = readPalette();

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);

    this.refs = buildScene(this.palette);
    this.cat = createCat(this.palette);
    this.cat.root.position.set(this.pos.x, 0, this.pos.z);
    this.refs.scene.add(this.cat.root);

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
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  setJoystickVector(vec: Vec2 | null) {
    this.input.setJoystickVector(vec);
  }

  triggerInteract() {
    this.input.queueInteract();
  }

  triggerJump() {
    this.input.queueJump();
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
    const frameMs = now - this.lastTime;
    let delta = frameMs / 1000;
    this.lastTime = now;

    // One-way quality downgrade on sustained slow frames.
    if (!this.degraded) {
      if (frameMs > SLOW_FRAME_MS) {
        this.slowFrames++;
        if (this.slowFrames >= SLOW_FRAME_LIMIT) this.degrade();
      } else {
        this.slowFrames = 0;
      }
    }

    delta = Math.min(delta, FIXED_STEP * MAX_CATCHUP_STEPS);
    this.accumulator += delta;

    let steps = 0;
    while (this.accumulator >= FIXED_STEP && steps < MAX_CATCHUP_STEPS) {
      this.update(FIXED_STEP);
      this.accumulator -= FIXED_STEP;
      steps++;
    }

    this.renderer.render(this.refs.scene, this.camera);
    this.rafId = requestAnimationFrame(this.tick);
  };

  private degrade() {
    this.degraded = true;
    this.renderer.setPixelRatio(1);
    // Turning off sun.castShadow is what actually skips the shadow pass.
    // Setting renderer.shadowMap.enabled = false after materials have compiled
    // is a no-op without flagging needsUpdate on every material, so it is not
    // worth doing; autoUpdate = false stops re-rendering the shadow map.
    this.refs.sun.castShadow = false;
    this.renderer.shadowMap.autoUpdate = false;
  }

  private update(dt: number) {
    this.input.update();
    const { x: ix, y: iy } = this.input;

    // Collision in pixel space, reusing the tested tilemap helpers.
    const startPx = { x: this.pos.x * TILE_SIZE, y: this.pos.z * TILE_SIZE };
    const dxPx = ix * PLAYER_SPEED * dt * TILE_SIZE;
    const dzPx = iy * PLAYER_SPEED * dt * TILE_SIZE;
    const nextPx = resolveCollision(startPx, dxPx, dzPx, PLAYER_HALF, PLAYER_HALF);

    this.pos.x = Math.max(0.5, Math.min(WORLD_W - 0.5, nextPx.x / TILE_SIZE));
    this.pos.z = Math.max(0.5, Math.min(WORLD_H - 0.5, nextPx.y / TILE_SIZE));

    const speed01 = Math.min(1, Math.hypot(ix, iy));
    if (speed01 > 0) this.facing = Math.atan2(ix, iy);

    // Vertical motion is independent of collision: x/z resolution above always
    // runs, so jumping can never carry the player over a wall or into a
    // building. There is no roof geometry to land on, so allowing that would
    // drop them inside a solid box.
    if (this.input.consumeJump() && this.grounded) {
      this.vy = JUMP_VELOCITY;
      this.grounded = false;
    }
    if (!this.grounded) {
      this.vy -= GRAVITY * dt;
      this.y += this.vy * dt;
      if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
        this.grounded = true;
      }
    }

    this.cat.root.position.set(this.pos.x, this.y, this.pos.z);
    this.cat.update(dt, {
      speed01,
      facing: this.facing,
      grounded: this.grounded,
      verticalVel: this.vy,
    });

    // Camera always follows the player (no bounds clamp): the ground plane
    // extends well past the playable area, so there is no void to frame, and
    // clamping near the edges would push the player out of shot entirely.
    const desired = new THREE.Vector3(
      this.pos.x + CAMERA_OFFSET.x,
      CAMERA_OFFSET.y,
      this.pos.z + CAMERA_OFFSET.z
    );
    this.camera.position.lerp(desired, 1 - Math.pow(0.0015, dt));
    this.camera.lookAt(desired.x, 0.6, desired.z - LOOK_AHEAD);

    // Keep the shadow frustum centred on the player so shadows stay crisp.
    this.refs.sun.position.set(this.pos.x + 12, 22, this.pos.z + 8);
    this.refs.sun.target.position.set(this.pos.x, 0, this.pos.z);
    this.refs.sun.target.updateMatrixWorld();

    const building = nearestBuilding(this.pos.x * TILE_SIZE, this.pos.z * TILE_SIZE);
    const slug = building?.slug ?? null;
    if (slug !== this.nearestSlug) {
      this.applyHighlight(this.nearestSlug, false);
      this.applyHighlight(slug, true);
      this.nearestSlug = slug;
      this.options.onProximityChange(slug);
    }
    if (building) this.loadPosterIfNeeded(building.slug);

    if (this.input.consumeInteract() && building) {
      this.options.onNavigate(building.target);
    }
    if (this.input.consumeEscape()) {
      this.options.onNavigate("/");
    }
  }

  private applyHighlight(slug: string | null, on: boolean) {
    if (!slug) return;
    const mesh = this.refs.buildingMeshes.get(slug);
    if (!mesh) return;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = on ? 0.85 : this.refs.baseEmissive.get(slug) ?? 0.12;
  }

  private loadPosterIfNeeded(slug: string) {
    if (this.loadedPosters.has(slug)) return;
    const src = this.options.posterSources[slug];
    const building = BUILDINGS.find((b) => b.slug === slug);
    if (!src || !building) return;
    this.loadedPosters.add(slug);
    const poster = makePoster(src, building);
    this.refs.scene.add(poster);
    this.refs.posterMeshes.set(slug, poster);
  }

  destroy() {
    // React StrictMode mounts, unmounts and remounts in development, so this
    // runs twice; disposing twice would throw on an already-released context.
    if (this.destroyed) return;
    this.destroyed = true;

    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.resizeObserver.disconnect();
    this.input.detach();
    document.removeEventListener("visibilitychange", this.visibilityHandler);

    // Lazily-created poster resources are not part of buildScene's registry.
    for (const poster of this.refs.posterMeshes.values()) {
      poster.geometry.dispose();
      const mat = poster.material as THREE.MeshBasicMaterial;
      mat.map?.dispose();
      mat.dispose();
    }
    this.refs.posterMeshes.clear();

    this.cat.dispose();
    disposeOwned(this.refs.owned);
    this.refs.scene.clear();

    this.renderer.dispose();
    // Without this the WebGL context stays alive; browsers cap concurrent
    // contexts (~8-16), so repeated visits to /arcade would eventually fail
    // to acquire one.
    this.renderer.forceContextLoss();
  }
}
