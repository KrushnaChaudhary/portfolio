import * as THREE from "three";
import { SPAWN_WORLD, TILE_SIZE } from "@/data/hubMapData";
import { HubEngineOptions, Vec2 } from "./types";
import { resolveCollision, nearestBuilding } from "./tilemap";
import { buildScene, disposeOwned, SceneRefs, ScenePalette, WORLD_W, WORLD_H } from "./scene3d";
import { InputController } from "./input";
import { createCat, CatRig } from "./cat";
import { createHolograms, HologramField } from "./hologram";
import { CoverLoader } from "./holoTextures";

// All hologram art loads up front rather than being distance-gated: with
// arcade buildings capped at 3 images apiece and each one downscaled to a
// 256x256 canvas by CoverLoader, the full set is only a few MB of GPU memory
// — cheap enough that every project should be visible from across the map,
// not just the one the player has walked up to.
const COVER_POLL_INTERVAL = 0.25; // seconds, not per-frame — see holoTextures.ts

const PLAYER_SPEED = 6.2; // world units/sec
const PLAYER_HALF = 10; // px, matches the tested tilemap collision box
// Apex ~0.85 units, airtime ~0.65s — high enough to read clearly under the
// pitched camera without feeling floaty.
const JUMP_VELOCITY = 5.2;
const GRAVITY = 16.0;
const FIXED_STEP = 1 / 60;
const MAX_CATCHUP_STEPS = 5;
// Pulled back and raised from the original (12.5, 8.5) so more of the street
// — several buildings, not just the nearest one or two — is in frame at once.
// Walking between buildings previously meant losing sight of where you'd come
// from; this keeps the whole block visible.
const CAMERA_OFFSET = new THREE.Vector3(0, 19, 13);
// How far ahead of the camera the look-at point sits. Tuned with the height
// above so the frustum's top edge lands on nearby ground — a shallower pitch
// puts the horizon on screen and wastes the top third of the frame on sky.
const LOOK_AHEAD = 11.5;
const CAMERA_FOV = 58; // wider than the default 50 to fit more street width

// Opening shot: camera starts close, in front of the cat's face, then eases
// out to the standard gameplay framing. The cat's neck/head sit toward local
// +Z, so a camera further along +Z than the cat and looking back at it is a
// face-on shot.
const INTRO_CAMERA_OFFSET = new THREE.Vector3(0, 1.15, 2.3);
const INTRO_LOOK_HEIGHT = 0.95;
const INTRO_DURATION = 1.6; // seconds
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
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
  private introActive = true;
  private introElapsed = 0;

  private nearestSlug: string | null = null;
  private holograms!: HologramField;
  private coverLoader = new CoverLoader();
  private coverApplied = new Set<string>();
  private coverPollAccum = 0;
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
    // Filmic tone mapping is what actually sells the emissive holograms/beams
    // as glowing light sources instead of flat bright-colored shapes — without
    // it every emissive material just clips to a solid color past a low
    // threshold, which is a large part of why the world read as "basic".
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 200);

    this.refs = buildScene(this.palette);
    this.cat = createCat(this.palette);
    this.cat.root.position.set(this.pos.x, 0, this.pos.z);
    this.refs.scene.add(this.cat.root);

    this.holograms = createHolograms(options.hologramSpecs, this.palette);
    this.refs.scene.add(this.holograms.group);

    // Request every hologram's images immediately — see the COVER_POLL_INTERVAL
    // comment above for why this doesn't need to be distance-gated. Requests
    // are keyed by spawn distance so the buildings nearest the player's start
    // point (and therefore first on screen) finish decoding first.
    for (const spec of options.hologramSpecs) {
      const dx = SPAWN_WORLD.x - (spec.building.x + spec.building.w / 2);
      const dz = SPAWN_WORLD.y - (spec.building.y + spec.building.h / 2);
      const priority = Math.hypot(dx, dz);
      spec.images.forEach((url, index) => {
        this.coverLoader.request(`${spec.slug}#${index}`, url, priority + index * 0.01);
      });
    }

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
    this.holograms.setQuality("low");
  }

  private update(dt: number) {
    this.input.update();
    const { x: ix, y: iy } = this.input;

    if (this.introActive) {
      this.updateIntro(dt, ix, iy);
      return;
    }

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

    this.holograms.update(dt, this.camera);
    this.pollCovers(dt);

    const building = nearestBuilding(this.pos.x * TILE_SIZE, this.pos.z * TILE_SIZE);
    const slug = building?.slug ?? null;
    if (slug !== this.nearestSlug) {
      this.applyHighlight(this.nearestSlug, false);
      this.applyHighlight(slug, true);
      this.nearestSlug = slug;
      this.options.onProximityChange(slug);
    }

    if (this.input.consumeInteract() && building) {
      this.options.onNavigate(building.target);
    }
    if (this.input.consumeEscape()) {
      this.options.onNavigate("/");
    }
  }

  /**
   * Opening shot: camera starts face-on and close, then eases out to the
   * standard gameplay framing while the cat idles. Movement/interact/jump
   * input is read only to let the player skip the shot early — pressing
   * anything jumps straight to the end of the transition rather than being
   * queued up and firing the moment control is handed back, which would feel
   * like an accidental building-enter or jump right as the cutscene ends.
   */
  private updateIntro(dt: number, ix: number, iy: number) {
    const skipRequested = Math.hypot(ix, iy) > 0.05 || this.input.consumeInteract() || this.input.consumeJump();
    this.introElapsed = skipRequested ? INTRO_DURATION : this.introElapsed + dt;

    const t = Math.min(1, this.introElapsed / INTRO_DURATION);
    const eased = easeInOutCubic(t);

    this.cat.root.position.set(this.pos.x, 0, this.pos.z);
    this.cat.update(dt, { speed01: 0, facing: this.facing, grounded: true, verticalVel: 0 });

    const fromPos = new THREE.Vector3(this.pos.x, 0, this.pos.z).add(INTRO_CAMERA_OFFSET);
    const toPos = new THREE.Vector3(this.pos.x + CAMERA_OFFSET.x, CAMERA_OFFSET.y, this.pos.z + CAMERA_OFFSET.z);
    this.camera.position.lerpVectors(fromPos, toPos, eased);

    const fromLook = new THREE.Vector3(this.pos.x, INTRO_LOOK_HEIGHT, this.pos.z);
    const toLook = new THREE.Vector3(this.pos.x, 0.6, this.pos.z + CAMERA_OFFSET.z - LOOK_AHEAD);
    this.camera.lookAt(fromLook.lerp(toLook, eased));

    // The holograms are "always on", the cutscene shouldn't be an exception.
    this.holograms.update(dt, this.camera);
    this.pollCovers(dt);

    if (t >= 1) this.introActive = false;

    // Don't trap the player in the cutscene if they came here by mistake.
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

  /**
   * Applies any hologram images that finished decoding since the last poll.
   * All images were already requested up front in the constructor; this just
   * pumps the loader's queue and hands finished textures to the holograms.
   * Runs on a timer rather than every frame — texture loading has no
   * per-frame granularity to gain from checking 60 times a second.
   */
  private pollCovers(dt: number) {
    this.coverPollAccum += dt;
    if (this.coverPollAccum < COVER_POLL_INTERVAL) return;
    this.coverPollAccum = 0;

    this.coverLoader.pump();

    for (const spec of this.options.hologramSpecs) {
      spec.images.forEach((_url, index) => {
        const key = `${spec.slug}#${index}`;
        if (this.coverApplied.has(key)) return;
        const texture = this.coverLoader.get(key);
        if (!texture) return;
        this.holograms.setImage(spec.slug, index, texture);
        this.coverApplied.add(key);
      });
    }
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

    this.cat.dispose();
    this.holograms.dispose();
    this.coverLoader.dispose();
    disposeOwned(this.refs.owned);
    this.refs.scene.clear();

    this.renderer.dispose();
    // Without this the WebGL context stays alive; browsers cap concurrent
    // contexts (~8-16), so repeated visits to /arcade would eventually fail
    // to acquire one.
    this.renderer.forceContextLoss();
  }
}
