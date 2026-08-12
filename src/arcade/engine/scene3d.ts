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

export interface SceneRefs {
  scene: THREE.Scene;
  player: THREE.Group;
  buildingMeshes: Map<string, THREE.Mesh>;
  posterMeshes: Map<string, THREE.Mesh>;
  sun: THREE.DirectionalLight;
  baseEmissive: Map<string, number>;
}

function makeLabelTexture(text: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 44px Sora, Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width - 24);
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
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

const BUILDING_HEIGHT: Record<string, number> = {
  arcade: 2.6,
  kiosk: 1.5,
  portal: 0.35,
};

// Colour-code buildings by project status so the world reads as information,
// not just decoration — same semantics as the library grid's status badges.
function buildingColor(b: HubBuilding, palette: ScenePalette): string {
  if (b.kind === "portal") return palette.primary;
  if (b.kind === "kiosk") return palette.surface3;
  const status = projectsData[b.slug]?.meta?.status;
  if (status === "Shipped") return palette.success;
  if (status === "In Development") return palette.warning;
  return palette.primary;
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
  const posterMeshes = new Map<string, THREE.Mesh>();
  const baseEmissive = new Map<string, number>();
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);

  for (const b of BUILDINGS) {
    const height = BUILDING_HEIGHT[b.kind] ?? 2;
    const color = buildingColor(b, palette);
    const glow = b.kind === "portal" ? 0.6 : 0.12;

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
    mesh.position.set(b.x + b.w / 2, height / 2, b.y + b.h / 2);
    mesh.castShadow = b.kind !== "portal";
    mesh.receiveShadow = true;
    scene.add(mesh);
    buildingMeshes.set(b.slug, mesh);
    baseEmissive.set(b.slug, glow);

    // Roof cap in a neutral tone keeps the coloured volumes from reading flat
    if (b.kind !== "portal") {
      const cap = new THREE.Mesh(
        boxGeo,
        new THREE.MeshStandardMaterial({ color: new THREE.Color(palette.surface2), roughness: 0.85 })
      );
      cap.scale.set(b.w + 0.16, 0.16, b.h + 0.16);
      cap.position.set(b.x + b.w / 2, height + 0.08, b.y + b.h / 2);
      cap.castShadow = true;
      scene.add(cap);
    }

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeLabelTexture(b.sign, palette.foreground),
        transparent: true,
      })
    );
    sprite.position.set(b.x + b.w / 2, height + 0.85, b.y + b.h / 2);
    sprite.scale.set(3.0, 0.56, 1);
    scene.add(sprite);
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

  // Player
  const player = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.3, 0.5, 6, 12),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.primary),
      roughness: 0.35,
      metalness: 0.2,
      emissive: new THREE.Color(palette.primary),
      emissiveIntensity: 0.25,
    })
  );
  body.position.y = 0.55;
  body.castShadow = true;
  player.add(body);

  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 12, 12),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.foreground),
      emissive: new THREE.Color(palette.foreground),
      emissiveIntensity: 0.5,
      roughness: 0.2,
    })
  );
  visor.position.set(0, 0.8, 0.24);
  player.add(visor);
  scene.add(player);

  return { scene, player, buildingMeshes, posterMeshes, sun, baseEmissive };
}

export function makePoster(url: string, building: HubBuilding): THREE.Mesh {
  const texture = new THREE.TextureLoader().load(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  const height = (BUILDING_HEIGHT[building.kind] ?? 2) * 0.5;
  const width = Math.min(building.w * 0.82, height * (16 / 9));
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
  );
  // Mounted on the south facade: both building bands sit north of their street,
  // so that is the face the player actually walks up to.
  mesh.position.set(
    building.x + building.w / 2,
    (BUILDING_HEIGHT[building.kind] ?? 2) * 0.52,
    building.y + building.h + 0.03
  );
  return mesh;
}
