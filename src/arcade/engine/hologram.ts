import * as THREE from "three";
import { HubBuilding } from "@/data/hubMapData";
import { ScenePalette } from "./scene3d";

export interface HologramSpec {
  slug: string;
  title: string;
  statLine: string;
  building: HubBuilding;
  /** Cover + gallery shots, in slideshow order. May be empty. */
  images: string[];
}

export interface HologramField {
  group: THREE.Group;
  update(dt: number, camera: THREE.PerspectiveCamera): void;
  setQuality(quality: "high" | "low"): void;
  setImage(slug: string, index: number, texture: THREE.Texture): void;
  dispose(): void;
}

// Panel floats this high above the projector pad — well above head height so
// it reads while walking past, not tied to any building's roof since there
// is no building anymore.
const FLOAT_HEIGHT = 2.35;
const PANEL_W = 3.2;
const PANEL_H = 1.9;
const FLOAT_AMP = 0.05;
const SLIDE_INTERVAL = 4.0; // seconds between slideshow advances
const FLICKER_DURATION = 0.22;
const FADE_RATE = 1 / 0.3;

const THRESHOLDS = {
  high: { cull: 46 * 46, near: 22 * 22 },
  low: { cull: 30 * 30, near: 16 * 16 },
};

function makeLabelTexture(title: string, statLine: string, palette: ScenePalette): THREE.CanvasTexture {
  const W = 640;
  const H = 160;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  const inset = 8;
  const tick = 22;
  ctx.strokeStyle = palette.primary;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(inset + tick, inset);
  ctx.lineTo(W - inset - tick, inset);
  ctx.lineTo(W - inset, inset + tick);
  ctx.lineTo(W - inset, H - inset - tick);
  ctx.lineTo(W - inset - tick, H - inset);
  ctx.lineTo(inset + tick, H - inset);
  ctx.lineTo(inset, H - inset - tick);
  ctx.lineTo(inset, inset + tick);
  ctx.closePath();
  ctx.stroke();

  let fontSize = 58;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = palette.foreground;
  const maxWidth = W - inset * 2 - tick * 2;
  do {
    ctx.font = `700 ${fontSize}px Sora, Inter, sans-serif`;
    fontSize -= 2;
  } while (ctx.measureText(title).width > maxWidth && fontSize > 28);
  ctx.fillText(title, W / 2, 78, maxWidth);

  ctx.font = "600 30px Inter, sans-serif";
  ctx.fillStyle = `${palette.primary}`;
  ctx.fillText(statLine, W / 2, 126, maxWidth);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function makeNoSignalTexture(palette: ScenePalette): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = palette.surface2;
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = `${palette.primary}33`;
  ctx.lineWidth = 2;
  for (let i = -size; i < size * 2; i += 14) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i - size, size);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeScanlineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 2, 64);
  ctx.fillStyle = "#ffffff";
  for (let y = 0; y < 64; y += 4) ctx.fillRect(0, y, 2, 1);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 10);
  return texture;
}

interface HoloInstance {
  slug: string;
  assembly: THREE.Group; // pad + beam + corner lights (static, ground-anchored)
  panel: THREE.Group; // floats + fully billboards
  panelBaseY: number;
  worldX: number;
  worldZ: number;
  floatIndex: number;
  imageMesh: THREE.Mesh;
  imageMat: THREE.MeshBasicMaterial;
  scanlineMesh: THREE.Mesh;
  light: THREE.PointLight;
  opacity: number;
  opacityTarget: number;
  slides: (THREE.Texture | null)[];
  slideIndex: number;
  slideTimer: number;
  flickerT: number;
}

export function createHolograms(specs: HologramSpec[], palette: ScenePalette): HologramField {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const track = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(x: T): T => {
    if (x instanceof THREE.BufferGeometry) geometries.add(x);
    else if (x instanceof THREE.Material) materials.add(x);
    else textures.add(x);
    return x;
  };

  const group = new THREE.Group();
  const noSignal = track(makeNoSignalTexture(palette));
  const scanlineTexture = track(makeScanlineTexture());

  const padGeo = track(new THREE.BoxGeometry(1, 0.06, 1));
  // Wide at the top (where it meets the panel), narrow at the bottom (the
  // emitter on the pad) — a projector beam widens as it climbs, it doesn't
  // funnel down to a point. CylinderGeometry(radiusTop, radiusBottom, ...).
  const beamGeo = track(new THREE.CylinderGeometry(0.85, 0.12, 1, 20, 1, true));
  const emitterGeo = track(new THREE.SphereGeometry(0.05, 8, 6));

  const instances: HoloInstance[] = specs.map((spec, index) => {
    const { building } = spec;
    const cx = building.x + building.w / 2;
    const cz = building.y + building.h / 2;

    const assembly = new THREE.Group();
    assembly.position.set(cx, 0, cz);
    group.add(assembly);

    // Ground pad: fills the same footprint the old building box occupied
    // (collision is unchanged — this is purely the visual swap from "solid
    // building" to "open projection stage").
    const padMat = track(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.surface2),
        emissive: new THREE.Color(palette.primary),
        emissiveIntensity: 0.35,
        roughness: 0.5,
        metalness: 0.2,
      })
    );
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.scale.set(building.w * 0.86, 1, building.h * 0.86);
    pad.position.y = 0.03;
    pad.receiveShadow = true;
    assembly.add(pad);

    // Four corner emitters — the "projector array" the beam appears to come from.
    const emitterMat = track(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.foreground),
        emissive: new THREE.Color(palette.primary),
        emissiveIntensity: 1.6,
      })
    );
    const cw = building.w * 0.8;
    const ch = building.h * 0.8;
    for (const [ex, ez] of [
      [-cw / 2, -ch / 2],
      [cw / 2, -ch / 2],
      [-cw / 2, ch / 2],
      [cw / 2, ch / 2],
    ]) {
      const emitter = new THREE.Mesh(emitterGeo, emitterMat);
      emitter.position.set(ex, 0.1, ez);
      assembly.add(emitter);
    }

    // Beam: a translucent upward cone, static — it never billboards or
    // floats, so it always reads as a fixed light source under the panel
    // rather than something that could visibly detach from the pad.
    const beamHeight = FLOAT_HEIGHT - 0.2;
    const beam = new THREE.Mesh(
      beamGeo,
      track(
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(palette.primary),
          transparent: true,
          opacity: 0.15,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      )
    );
    beam.scale.y = beamHeight;
    beam.position.y = beamHeight / 2 + 0.1;
    beam.renderOrder = 9;
    assembly.add(beam);

    // The hologram is meant to read as an actual light source in the scene,
    // not just a glowing decal — a real point light casts primary-coloured
    // light onto the ground and nearby geometry. Toggled off beyond the
    // "near" LOD tier in update() to bound the number of simultaneously lit
    // lights (WebGL light cost scales with active count, not just visible).
    const light = new THREE.PointLight(new THREE.Color(palette.primary), 2.2, 7, 2);
    light.position.y = 1.1;
    assembly.add(light);

    // Panel: fully billboards (matches the camera's own orientation each
    // frame) so it is always maximally readable regardless of the camera's
    // pitch, rather than only correcting for yaw.
    const panel = new THREE.Group();
    const panelBaseY = FLOAT_HEIGHT;
    panel.position.y = panelBaseY;
    assembly.add(panel);

    const backdrop = new THREE.Mesh(
      track(new THREE.PlaneGeometry(PANEL_W + 0.12, PANEL_H + 0.12)),
      track(
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(palette.primary),
          transparent: true,
          opacity: 0.12,
          side: THREE.DoubleSide,
          depthWrite: false,
          fog: true,
        })
      )
    );
    backdrop.renderOrder = 10;
    panel.add(backdrop);

    const imageH = PANEL_H * 0.68;
    const imageMat = track(
      new THREE.MeshBasicMaterial({
        map: noSignal,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        toneMapped: false,
        fog: true,
      })
    ) as THREE.MeshBasicMaterial;
    const imageMesh = new THREE.Mesh(track(new THREE.PlaneGeometry(PANEL_W * 0.92, imageH)), imageMat);
    imageMesh.position.set(0, PANEL_H / 2 - imageH / 2 - 0.06, 0.001);
    imageMesh.renderOrder = 11;
    panel.add(imageMesh);

    const labelH = PANEL_H - imageH - 0.12;
    const labelMat = track(
      new THREE.MeshBasicMaterial({
        map: track(makeLabelTexture(spec.title, spec.statLine, palette)),
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        fog: true,
      })
    );
    const labelMesh = new THREE.Mesh(track(new THREE.PlaneGeometry(PANEL_W, labelH)), labelMat);
    labelMesh.position.set(0, -PANEL_H / 2 + labelH / 2, 0.002);
    labelMesh.renderOrder = 12;
    panel.add(labelMesh);

    const scanlineMesh = new THREE.Mesh(
      track(new THREE.PlaneGeometry(PANEL_W * 0.92, imageH)),
      track(
        new THREE.MeshBasicMaterial({
          map: scanlineTexture,
          transparent: true,
          opacity: 0.14,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          fog: false,
        })
      )
    );
    scanlineMesh.position.copy(imageMesh.position);
    scanlineMesh.position.z += 0.001;
    scanlineMesh.renderOrder = 13;
    panel.add(scanlineMesh);

    return {
      slug: spec.slug,
      assembly,
      panel,
      panelBaseY,
      worldX: cx,
      worldZ: cz,
      floatIndex: index,
      imageMesh,
      imageMat,
      scanlineMesh,
      light,
      opacity: 0.95,
      opacityTarget: 0.95,
      slides: new Array(Math.max(1, spec.images.length)).fill(null),
      slideIndex: 0,
      slideTimer: index * 0.6, // stagger so 12 panels don't flicker in unison
      flickerT: 0,
    };
  });

  let quality: "high" | "low" = "high";
  let t = 0;

  const advanceSlide = (holo: HoloInstance) => {
    // Pick the next loaded slide after the current one, wrapping — cycles a
    // 3-image set in order rather than bouncing between whichever loaded first.
    const ordered = holo.slides.map((tex, i) => ({ tex, i })).filter((e) => e.tex);
    if (ordered.length < 2) return;
    const currentPos = ordered.findIndex((e) => e.i === holo.slideIndex);
    const next = ordered[(currentPos + 1) % ordered.length];
    holo.slideIndex = next.i;
    holo.flickerT = FLICKER_DURATION;
  };

  const update = (dt: number, camera: THREE.PerspectiveCamera) => {
    t += dt;
    scanlineTexture.offset.y += dt * 0.2;

    const { cull, near } = THRESHOLDS[quality];

    for (const holo of instances) {
      const dx = camera.position.x - holo.worldX;
      const dz = camera.position.z - holo.worldZ;
      const distSq = dx * dx + dz * dz;

      if (distSq > cull) {
        holo.assembly.visible = false;
        continue;
      }
      holo.assembly.visible = true;

      // Every project should read as a hologram from across the map, not
      // just the one the player is standing next to — so the cover image
      // and title share the same visibility as the rest of the panel. Only
      // the point light (a real per-frame lighting cost) and the scanline
      // flourish stay gated to the near tier.
      holo.imageMesh.visible = true;
      const isNear = distSq <= near;
      holo.scanlineMesh.visible = isNear && quality === "high";
      holo.light.visible = isNear;

      holo.panel.position.y =
        quality === "high"
          ? holo.panelBaseY + Math.sin(t * 0.7 + holo.floatIndex * 0.7) * FLOAT_AMP
          : holo.panelBaseY;

      // Full billboard: match the camera's own orientation exactly, so the
      // panel is always parallel to the view plane regardless of how steep
      // the camera's pitch is. A yaw-only billboard reads as "not facing the
      // camera" the moment the camera looks down at any real angle.
      holo.panel.quaternion.copy(camera.quaternion);

      if (isNear && holo.slides.length > 1) {
        holo.slideTimer += dt;
        if (holo.slideTimer >= SLIDE_INTERVAL) {
          holo.slideTimer = 0;
          advanceSlide(holo);
        }
      }

      if (holo.flickerT > 0) {
        holo.flickerT = Math.max(0, holo.flickerT - dt);
        const swapAt = FLICKER_DURATION * 0.5;
        if (holo.flickerT <= swapAt && holo.imageMat.map !== holo.slides[holo.slideIndex]) {
          holo.imageMat.map = holo.slides[holo.slideIndex] ?? noSignal;
          holo.imageMat.needsUpdate = true;
        }
        // Dip-and-recover glitch rather than a smooth crossfade — reads as a
        // hologram re-syncing, not a photo dissolve.
        const glitch = holo.flickerT / FLICKER_DURATION;
        holo.imageMat.opacity = holo.opacityTarget * (1 - glitch * 0.75);
      } else if (holo.opacity !== holo.opacityTarget) {
        const step = FADE_RATE * dt;
        holo.opacity =
          holo.opacity < holo.opacityTarget
            ? Math.min(holo.opacityTarget, holo.opacity + step)
            : Math.max(holo.opacityTarget, holo.opacity - step);
        holo.imageMat.opacity = holo.opacity;
      }
    }
  };

  const setQuality = (q: "high" | "low") => {
    quality = q;
  };

  const setImage = (slug: string, index: number, texture: THREE.Texture) => {
    const holo = instances.find((i) => i.slug === slug);
    if (!holo || index >= holo.slides.length) return;
    holo.slides[index] = texture;
    // First image to arrive for a panel shows immediately; later ones join
    // the slideshow rotation on their next scheduled advance.
    if (holo.imageMat.map === noSignal) {
      holo.slideIndex = index;
      holo.imageMat.map = texture;
      holo.imageMat.needsUpdate = true;
      holo.opacity = 0;
      holo.imageMat.opacity = 0;
      holo.opacityTarget = 0.95;
    }
  };

  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((tex) => tex.dispose());
    geometries.clear();
    materials.clear();
    textures.clear();
  };

  return { group, update, setQuality, setImage, dispose };
}
