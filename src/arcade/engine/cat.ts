import * as THREE from "three";
import { ScenePalette } from "./scene3d";

const TAU = Math.PI * 2;

export interface CatPoseState {
  /** Planar movement speed, 0..1. */
  speed01: number;
  /** Desired facing in radians, from the engine's atan2(inputX, inputZ). */
  facing: number;
  grounded: boolean;
  verticalVel: number;
}

export interface CatRig {
  /** The engine sets .position on this; it never touches anything inside. */
  root: THREE.Group;
  update(dt: number, state: CatPoseState): void;
  dispose(): void;
}

// Trot: diagonal pairs move together. Front-left with back-right, front-right
// with back-left, half a cycle apart. This is what makes a quadruped read as a
// cat rather than a table sliding along the ground.
const LEG_PHASE = [0, 0.5, 0.5, 0] as const; // FL, FR, BL, BR
const LEG_OFFSET: ReadonlyArray<readonly [number, number]> = [
  [-0.16, 0.28], // FL
  [0.16, 0.28], // FR
  [-0.16, -0.26], // BL
  [0.16, -0.26], // BR
];

const JUMP_REFERENCE_VELOCITY = 5.2;

/** Exponential smoothing that is correct at any frame rate. */
const damp = (current: number, target: number, tau: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-dt / tau));

export function createCat(palette: ScenePalette): CatRig {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();

  const track = <T extends THREE.BufferGeometry | THREE.Material>(x: T): T => {
    if (x instanceof THREE.BufferGeometry) geometries.add(x);
    else materials.add(x);
    return x;
  };

  // Ginger, deliberately NOT the scene's primary blue. The buildings, portal
  // and lamps are all blue/green, so a blue cat sat dark-on-dark and its
  // silhouette dissolved into the road. Warm orange is the only hue in the
  // palette nothing else uses, so the character reads instantly at any zoom.
  const FUR = "#e8833a";
  const FUR_LIGHT = "#f6c9a0";

  const fur = track(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(FUR),
      roughness: 0.62,
      metalness: 0.02,
    })
  );
  // Cream muzzle, paws and chest — a light tint of the fur rather than pure
  // white, which read as a surgical mask on the face.
  const accent = track(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(FUR_LIGHT),
      roughness: 0.75,
    })
  );
  const eyeMat = track(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.foreground),
      emissive: new THREE.Color(palette.foreground),
      emissiveIntensity: 0.9,
      roughness: 0.2,
    })
  );

  const root = new THREE.Group();
  // Deliberately larger than a real cat relative to the buildings. At true
  // scale the character is a handful of pixels under this camera height and
  // none of the gait reads; the world is stylised, so legibility wins.
  root.scale.setScalar(1.7);
  const yaw = new THREE.Group();
  const body = new THREE.Group();
  body.position.y = 0.42;
  yaw.add(body);
  root.add(yaw);

  // Cat proportions: a long low body and a small head. The two spheres break
  // up the box silhouette for two draw calls, far cheaper than a denser mesh.
  const torsoGeo = track(new THREE.BoxGeometry(0.28, 0.24, 0.72));
  const torso = new THREE.Mesh(torsoGeo, fur);
  torso.castShadow = true;
  body.add(torso);

  const haunchGeo = track(new THREE.SphereGeometry(0.17, 8, 6));
  const haunch = new THREE.Mesh(haunchGeo, fur);
  haunch.position.set(0, 0.02, -0.32);
  haunch.castShadow = true;
  body.add(haunch);

  const chestGeo = track(new THREE.SphereGeometry(0.145, 8, 6));
  const chest = new THREE.Mesh(chestGeo, fur);
  chest.position.set(0, -0.01, 0.32);
  chest.castShadow = true;
  body.add(chest);

  // Neck. The head sits higher than the torso, so without this there is a
  // visible notch between them from the play camera's angle.
  const neckGeo = track(new THREE.BoxGeometry(0.16, 0.16, 0.16));
  const neck = new THREE.Mesh(neckGeo, fur);
  neck.position.set(0, 0.1, 0.36);
  neck.castShadow = true;
  body.add(neck);

  // Head — deliberately small; an oversized head reads as a dog or a toy.
  const head = new THREE.Group();
  head.position.set(0, 0.19, 0.44);
  body.add(head);

  const headGeo = track(new THREE.BoxGeometry(0.2, 0.17, 0.18));
  const headMesh = new THREE.Mesh(headGeo, fur);
  headMesh.castShadow = true;
  head.add(headMesh);

  const muzzleGeo = track(new THREE.BoxGeometry(0.1, 0.06, 0.06));
  const muzzle = new THREE.Mesh(muzzleGeo, accent);
  muzzle.position.set(0, -0.055, 0.11);
  head.add(muzzle);

  const noseMat = track(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.background),
      roughness: 0.6,
    })
  );
  const noseGeo = track(new THREE.BoxGeometry(0.028, 0.02, 0.018));
  const nose = new THREE.Mesh(noseGeo, noseMat);
  nose.position.set(0, -0.042, 0.142);
  head.add(nose);

  // Tall triangular ears set on top of the skull — the strongest single
  // silhouette cue that this is a cat.
  const earGeo = track(new THREE.ConeGeometry(0.05, 0.13, 4));
  const ears: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const ear = new THREE.Group();
    // Slightly forward of the skull's centre so the ears stay in silhouette
    // when the cat is walking toward the camera.
    ear.position.set(side * 0.062, 0.115, 0.03);
    const earMesh = new THREE.Mesh(earGeo, fur);
    ear.add(earMesh);
    head.add(ear);
    ears.push(ear);
  }

  const eyeGeo = track(new THREE.SphereGeometry(0.019, 8, 6));
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(side * 0.052, 0.025, 0.085);
    head.add(eye);
  }

  // Legs: hip -> knee -> paw, so the knee can fold independently of the swing.
  const upperGeo = track(new THREE.BoxGeometry(0.06, 0.24, 0.06));
  const lowerGeo = track(new THREE.BoxGeometry(0.05, 0.22, 0.05));
  const pawGeo = track(new THREE.BoxGeometry(0.07, 0.05, 0.095));

  const hips: THREE.Group[] = [];
  const knees: THREE.Group[] = [];

  for (let i = 0; i < 4; i++) {
    const [ox, oz] = LEG_OFFSET[i];
    const hip = new THREE.Group();
    hip.position.set(ox, -0.06, oz);
    body.add(hip);

    const upper = new THREE.Mesh(upperGeo, fur);
    upper.position.y = -0.12;
    hip.add(upper);

    const knee = new THREE.Group();
    knee.position.y = -0.24;
    hip.add(knee);

    const lower = new THREE.Mesh(lowerGeo, fur);
    lower.position.y = -0.11;
    knee.add(lower);

    const paw = new THREE.Mesh(pawGeo, accent);
    paw.position.set(0, -0.23, 0.02);
    knee.add(paw);

    hips.push(hip);
    knees.push(knee);
  }

  // Tail: nested groups so each rotation compounds and the whip propagates.
  const tailSegments: THREE.Group[] = [];
  let tailParent: THREE.Object3D = body;
  for (let i = 0; i < 4; i++) {
    const seg = new THREE.Group();
    seg.position.set(0, i === 0 ? 0.1 : 0, i === 0 ? -0.34 : -0.1);
    const geo = track(new THREE.BoxGeometry(0.048 - i * 0.007, 0.048 - i * 0.007, 0.11));
    const mesh = new THREE.Mesh(geo, fur);
    mesh.position.z = -0.055;
    seg.add(mesh);
    tailParent.add(seg);
    tailParent = seg;
    tailSegments.push(seg);
  }

  // Animation state
  let gait = 0;
  let air = 0;
  let phase = 0;
  let t = 0;
  let landSquash = 0;
  let wasGrounded = true;
  let nextFlick = 2 + Math.random() * 4;
  let flick = 0;

  const update = (dt: number, state: CatPoseState) => {
    t += dt;
    gait = damp(gait, Math.min(1, Math.max(0, state.speed01)), 0.09, dt);
    air = damp(air, state.grounded ? 0 : 1, 0.05, dt);

    // Landing impulse, detected on the rising edge of grounded.
    if (state.grounded && !wasGrounded) landSquash = 1;
    wasGrounded = state.grounded;
    landSquash = Math.max(0, landSquash - dt * 6);

    // Ear flick on a random timer. Scheduling the next one at fire time keeps
    // this to a single Math.random() per flick rather than one per frame.
    nextFlick -= dt;
    if (nextFlick <= 0) {
      flick = 1;
      nextFlick = 2.5 + Math.random() * 3.5;
    }
    flick = Math.max(0, flick - dt * 4);

    // Shortest-arc yaw. The double modulo is required: JS % keeps the sign of
    // the dividend, so a single one lets the cat spin the long way round.
    const delta = ((state.facing - yaw.rotation.y + Math.PI) % TAU + TAU) % TAU - Math.PI;
    yaw.rotation.y += delta * (1 - Math.exp(-dt * 12));

    const gaitHz = 0.9 + 1.7 * gait;
    phase = (phase + gaitHz * dt) % 1;

    for (let i = 0; i < 4; i++) {
      const theta = TAU * (phase + LEG_PHASE[i]);
      const swing = Math.sin(theta) * 0.55 * gait;
      // max(0, -cos) folds the knee only during the swing half of the cycle
      // and keeps it straight while the paw is bearing weight.
      const fold = Math.max(0, -Math.cos(theta)) * 0.7 * gait;

      hips[i].rotation.x = swing * (1 - air) + -0.5 * air;
      knees[i].rotation.x = fold * (1 - air) + 0.9 * air;

      if (landSquash > 0) {
        const splay = (LEG_OFFSET[i][0] < 0 ? -1 : 1) * 0.25 * landSquash;
        hips[i].rotation.z = splay;
      } else {
        hips[i].rotation.z = 0;
      }
    }

    // Body: bob and roll run at twice the gait frequency because a trot
    // exchanges support twice per cycle.
    body.position.y = 0.42 + Math.abs(Math.sin(TAU * phase * 2)) * 0.035 * gait;
    body.rotation.z = Math.sin(TAU * phase) * 0.05 * gait;
    body.rotation.x = -0.1 * gait + 0.12 * air;

    // Volume-preserving stretch on the way up, squash on landing.
    const rise = Math.max(0, Math.min(1, state.verticalVel / JUMP_REFERENCE_VELOCITY));
    let scaleY = 1 + rise * 0.12;
    scaleY *= 1 - 0.18 * landSquash;
    body.scale.y = scaleY * (1 + Math.sin(t * 1.6) * 0.012 * (1 - gait));
    const lateral = 1 / Math.sqrt(scaleY);
    body.scale.x = lateral;
    body.scale.z = lateral;

    // Head: small counter-bob while moving, idle look-around when still.
    head.rotation.x = 0.06 * Math.sin(TAU * phase * 2) * gait - 0.12 * air;
    head.rotation.y = Math.sin(t * 0.6) * 0.35 * (1 - gait);

    // Ears pin back with speed, plus the occasional flick.
    ears[0].rotation.z = Math.sin(t * 1.7) * 0.08 - 0.15 * gait + flick * 0.5;
    ears[1].rotation.z = -Math.sin(t * 1.7 + 1) * 0.08 + 0.15 * gait - flick * 0.5;

    // Tail: each segment lags the one before it so the motion travels outward.
    for (let i = 0; i < tailSegments.length; i++) {
      const seg = tailSegments[i];
      seg.rotation.y = Math.sin(t * (1.4 + 1.6 * gait) - i * 0.6) * (0.12 + 0.18 * gait);
      // Rotations compound down the chain, so keep the per-segment lift small
      // or the tail curls into a full loop over the cat's back.
      seg.rotation.x = -0.14 - 0.05 * i + 0.08 * gait - 0.3 * air;
    }
  };

  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    geometries.clear();
    materials.clear();
  };

  return { root, update, dispose };
}
