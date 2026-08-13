import * as THREE from "three";
import { BUILDINGS, HUB_MAP, MAP_COLS, MAP_ROWS, HubBuilding } from "@/data/hubMapData";
import { projectsData } from "@/data/projectsData";

// World units: 1 tile = 1 unit. The 2D map data is reused verbatim so the
// layout, collision and proximity rules stay identical to the tested tilemap.
export const WORLD_W = MAP_COLS;
export const WORLD_H = MAP_ROWS;

export interface ScenePalette {
  background: string;
  surface1: string;
  surface2: string;
  surface3: string;
  primary: string;
  foreground: string;
  success: string;
  warning: string;
}

/**
 * Everything buildScene allocated, so teardown can dispose exactly what it
 * owns. Previously destroy() walked the whole scene graph and disposed every
 * geometry and material it found, which also destroyed shared resources (a
 * single BoxGeometry backs all 15 buildings) and anything a future module
 * might cache across mounts.
 */
export interface OwnedResources {
  geometries: Set<THREE.BufferGeometry>;
  materials: Set<THREE.Material>;
  textures: Set<THREE.Texture>;
}

export interface SceneRefs {
  scene: THREE.Scene;
  // The player character (cat.ts) and the holograms (hologram.ts) are built
  // and owned outside buildScene, so each disposes its own resources
  // independently of the world's.
  buildingMeshes: Map<string, THREE.Mesh>;
  sun: THREE.DirectionalLight;
  baseEmissive: Map<string, number>;
  owned: OwnedResources;
}

/**
 * Register every geometry/material/texture reachable from `root`.
 *
 * Called once at the end of buildScene, before any other module adds to the
 * scene, so it captures exactly what buildScene allocated and nothing else.
 * Modules added later (the player rig, holograms) own and dispose their own
 * resources — that separation is the point, since disposing a shared or cached
 * resource on unmount leaves a later mount rendering a destroyed object.
 */
export function collectOwned(root: THREE.Object3D, owned: OwnedResources) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh & { material?: THREE.Material | THREE.Material[] };
    if (mesh.geometry) owned.geometries.add(mesh.geometry);
    const mat = mesh.material;
    const mats = Array.isArray(mat) ? mat : mat ? [mat] : [];
    for (const m of mats) {
      owned.materials.add(m);
      for (const value of Object.values(m)) {
        if (value instanceof THREE.Texture) owned.textures.add(value);
      }
    }
  });
}

export function disposeOwned(owned: OwnedResources) {
  owned.geometries.forEach((g) => g.dispose());
  owned.materials.forEach((m) => m.dispose());
  owned.textures.forEach((t) => t.dispose());
  owned.geometries.clear();
  owned.materials.clear();
  owned.textures.clear();
}

// Vertical gradient so the space above the horizon reads as a deliberate sky
// rather than dead flat background.
function makeSkyTexture(palette: ScenePalette): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, palette.background);
  gradient.addColorStop(0.55, palette.surface1);
  gradient.addColorStop(1, palette.surface2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Arcade buildings no longer render a box (hologram.ts owns their visual
// presence) and portals use their own arch geometry, so this now only sizes
// kiosk boxes.
const KIOSK_HEIGHT = 1.5;

// Colour-code buildings by project status so the world reads as information,
// not just decoration — same semantics as the library grid's status badges.
function buildingColor(b: HubBuilding, palette: ScenePalette): string {
  if (b.kind === "kiosk") return palette.surface3;
  const status = projectsData[b.slug]?.meta?.status;
  if (status === "Shipped") return palette.success;
  if (status === "In Development") return palette.warning;
  return palette.primary;
}

// A small always-billboarded text sign for kiosk/portal buildings — cheaper
// and simpler than the full project-hologram rig (no image slot, no beam,
// no per-frame quaternion copy needed since sprites billboard for free).
function makeSignTexture(text: string, palette: ScenePalette): THREE.CanvasTexture {
  const W = 512;
  const H = 128;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = `${palette.background}cc`;
  const r = 18;
  ctx.beginPath();
  ctx.moveTo(r, 4);
  ctx.arcTo(W - 4, 4, W - 4, H - 4, r);
  ctx.arcTo(W - 4, H - 4, 4, H - 4, r);
  ctx.arcTo(4, H - 4, 4, 4, r);
  ctx.arcTo(4, 4, W - 4, 4, r);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = palette.primary;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = palette.foreground;
  ctx.font = "700 46px Sora, Inter, sans-serif";
  ctx.fillText(text.toUpperCase(), W / 2, H / 2 + 2, W - 40);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function buildScene(palette: ScenePalette): SceneRefs {
  const scene = new THREE.Scene();
  scene.background = makeSkyTexture(palette);
  scene.fog = new THREE.Fog(palette.background, 26, 52);

  // Ground extends well past the playable area so the camera never frames the
  // void beyond its edge; fog fades the overspill out. The perimeter wall
  // still marks where the player can actually walk.
  const outerGround = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD_W * 4, WORLD_H * 6),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.background),
      roughness: 1,
      metalness: 0,
    })
  );
  outerGround.rotation.x = -Math.PI / 2;
  outerGround.position.set(WORLD_W / 2, -0.02, WORLD_H / 2);
  scene.add(outerGround);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD_W, WORLD_H),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.surface1),
      roughness: 1,
      metalness: 0,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(WORLD_W / 2, 0, WORLD_H / 2);
  ground.receiveShadow = true;
  scene.add(ground);

  // Paths and water, drawn as thin raised slabs so they read in 3D.
  const pathTiles: THREE.Matrix4[] = [];
  const waterTiles: THREE.Matrix4[] = [];
  for (let ty = 0; ty < MAP_ROWS; ty++) {
    for (let tx = 0; tx < MAP_COLS; tx++) {
      const ch = HUB_MAP[ty][tx];
      const m = new THREE.Matrix4().setPosition(tx + 0.5, 0.02, ty + 0.5);
      if (ch === "=") pathTiles.push(m);
      else if (ch === "~") waterTiles.push(m);
    }
  }

  const tileGeo = new THREE.BoxGeometry(1, 0.04, 1);
  if (pathTiles.length) {
    const pathMesh = new THREE.InstancedMesh(
      tileGeo,
      new THREE.MeshStandardMaterial({ color: new THREE.Color(palette.surface3), roughness: 0.9 }),
      pathTiles.length
    );
    pathTiles.forEach((m, i) => pathMesh.setMatrixAt(i, m));
    pathMesh.receiveShadow = true;
    scene.add(pathMesh);
  }
  if (waterTiles.length) {
    const waterMesh = new THREE.InstancedMesh(
      tileGeo,
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.primary),
        roughness: 0.15,
        metalness: 0.6,
        emissive: new THREE.Color(palette.primary),
        emissiveIntensity: 0.25,
      }),
      waterTiles.length
    );
    waterTiles.forEach((m, i) => waterMesh.setMatrixAt(i, m));
    scene.add(waterMesh);
  }

  // Perimeter wall so the world has a visible edge
  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(palette.surface2),
    roughness: 0.9,
  });
  const wallGeo = new THREE.BoxGeometry(1, 1.2, 1);
  const perimeter: THREE.Matrix4[] = [];
  for (let tx = 0; tx < MAP_COLS; tx++) {
    perimeter.push(new THREE.Matrix4().setPosition(tx + 0.5, 0.6, 0.5));
    perimeter.push(new THREE.Matrix4().setPosition(tx + 0.5, 0.6, MAP_ROWS - 0.5));
  }
  for (let ty = 1; ty < MAP_ROWS - 1; ty++) {
    perimeter.push(new THREE.Matrix4().setPosition(0.5, 0.6, ty + 0.5));
    perimeter.push(new THREE.Matrix4().setPosition(MAP_COLS - 0.5, 0.6, ty + 0.5));
  }
  const wallMesh = new THREE.InstancedMesh(wallGeo, wallMat, perimeter.length);
  perimeter.forEach((m, i) => wallMesh.setMatrixAt(i, m));
  wallMesh.castShadow = true;
  wallMesh.receiveShadow = true;
  scene.add(wallMesh);

  // Lighting
  scene.add(new THREE.HemisphereLight(0xffffff, new THREE.Color(palette.surface2), 0.85));
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const sun = new THREE.DirectionalLight(0xffffff, 2.4);
  sun.position.set(12, 22, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 80;
  const shadowExtent = 24;
  sun.shadow.camera.left = -shadowExtent;
  sun.shadow.camera.right = shadowExtent;
  sun.shadow.camera.top = shadowExtent;
  sun.shadow.camera.bottom = -shadowExtent;
  sun.shadow.bias = -0.0008;
  scene.add(sun);
  scene.add(sun.target);

  // Buildings
  const buildingMeshes = new Map<string, THREE.Mesh>();
  const baseEmissive = new Map<string, number>();
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);

  for (const b of BUILDINGS) {
    // Arcade (project) buildings render nothing here — hologram.ts builds
    // their entire visual presence (ground pad, corner emitters, projector
    // beam, floating panel) in the same footprint, so the "building" is now
    // an open-air projection stage rather than a solid box.
    if (b.kind === "arcade") continue;

    const cx = b.x + b.w / 2;
    const cz = b.y + b.h / 2;

    if (b.kind === "portal") {
      // A flat emissive box here used to read as a stray "blue square" sitting
      // on the ground with nothing explaining it. A ring-and-pillar portal —
      // glowing floor ring, two uprights, an arch bar — reads unambiguously
      // as a gateway instead of decoration or a mistake.
      const portalColor = new THREE.Color(palette.primary);
      const ringMesh = new THREE.Mesh(
        new THREE.TorusGeometry(Math.min(b.w, b.h) * 0.42, 0.05, 12, 32),
        new THREE.MeshStandardMaterial({
          color: portalColor,
          emissive: portalColor,
          emissiveIntensity: 1.1,
          roughness: 0.3,
          metalness: 0.4,
        })
      );
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.set(cx, 0.04, cz);
      scene.add(ringMesh);
      buildingMeshes.set(b.slug, ringMesh);
      baseEmissive.set(b.slug, 1.1);

      const pillarMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.surface3),
        emissive: portalColor,
        emissiveIntensity: 0.5,
        roughness: 0.4,
        metalness: 0.3,
      });
      const archHeight = 1.9;
      const archHalfW = Math.min(b.w, b.h) * 0.36;
      for (const side of [-1, 1]) {
        const pillar = new THREE.Mesh(boxGeo, pillarMat);
        pillar.scale.set(0.12, archHeight, 0.12);
        pillar.position.set(cx + side * archHalfW, archHeight / 2, cz);
        pillar.castShadow = true;
        scene.add(pillar);
      }
      const archBar = new THREE.Mesh(boxGeo, pillarMat);
      archBar.scale.set(archHalfW * 2 + 0.12, 0.12, 0.12);
      archBar.position.set(cx, archHeight, cz);
      archBar.castShadow = true;
      scene.add(archBar);

      const portalLight = new THREE.PointLight(portalColor, 2.4, 8, 2);
      portalLight.position.set(cx, 1.4, cz);
      scene.add(portalLight);

      const sign = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: makeSignTexture(b.sign, palette), transparent: true, depthWrite: false })
      );
      sign.scale.set(1.7, 0.42, 1);
      sign.position.set(cx, archHeight + 0.4, cz);
      scene.add(sign);
      continue;
    }

    const height = KIOSK_HEIGHT;
    const color = buildingColor(b, palette);
    const glow = 0.12;

    const mesh = new THREE.Mesh(
      boxGeo,
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.55,
        metalness: 0.15,
        emissive: new THREE.Color(color),
        emissiveIntensity: glow,
      })
    );
    mesh.scale.set(b.w, height, b.h);
    mesh.position.set(cx, height / 2, cz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    buildingMeshes.set(b.slug, mesh);
    baseEmissive.set(b.slug, glow);

    // Roof cap in a neutral tone keeps the coloured volumes from reading flat
    const cap = new THREE.Mesh(
      boxGeo,
      new THREE.MeshStandardMaterial({ color: new THREE.Color(palette.surface2), roughness: 0.85 })
    );
    cap.scale.set(b.w + 0.16, 0.16, b.h + 0.16);
    cap.position.set(cx, height + 0.08, cz);
    cap.castShadow = true;
    scene.add(cap);

    // Kiosks are plain boxes with no hologram of their own now, so they need
    // their own always-billboarded sign to stay legible from a distance.
    const sign = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: makeSignTexture(b.sign, palette), transparent: true, depthWrite: false })
    );
    sign.scale.set(1.7, 0.42, 1);
    sign.position.set(cx, height + 0.5, cz);
    scene.add(sign);
  }

  // Lamp posts along the two streets for depth cues
  const lampGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 6);
  const lampMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(palette.surface3),
    roughness: 0.8,
  });
  const bulbGeo = new THREE.SphereGeometry(0.16, 10, 10);
  const bulbMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(palette.foreground),
    emissive: new THREE.Color(palette.primary),
    emissiveIntensity: 1.4,
  });
  for (const row of [9, 27]) {
    for (let tx = 4; tx < MAP_COLS - 4; tx += 6) {
      const post = new THREE.Mesh(lampGeo, lampMat);
      post.position.set(tx + 0.5, 1.1, row + 1.6);
      post.castShadow = true;
      scene.add(post);
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(tx + 0.5, 2.3, row + 1.6);
      scene.add(bulb);
    }
  }

  const owned: OwnedResources = {
    geometries: new Set(),
    materials: new Set(),
    textures: new Set(),
  };
  collectOwned(scene, owned);

  return { scene, buildingMeshes, sun, baseEmissive, owned };
}
