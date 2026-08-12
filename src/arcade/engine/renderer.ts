import { HUB_MAP, MAP_COLS, MAP_ROWS, TILE_SIZE, BUILDINGS } from "@/data/hubMapData";
import { EnginePalette } from "./types";
import { WORLD_WIDTH, WORLD_HEIGHT } from "./tilemap";

type DrawableCanvas = OffscreenCanvas | HTMLCanvasElement;

function roundRectPath(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Prerendered once. Per-frame rendering is a single drawImage of the camera's
// crop of this canvas — that's the entire perf trick, no per-tile loop at runtime.
export function createStaticLayer(palette: EnginePalette): DrawableCanvas {
  const canvas: DrawableCanvas =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(WORLD_WIDTH, WORLD_HEIGHT)
      : Object.assign(document.createElement("canvas"), { width: WORLD_WIDTH, height: WORLD_HEIGHT });

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  for (let ty = 0; ty < MAP_ROWS; ty++) {
    for (let tx = 0; tx < MAP_COLS; tx++) {
      const ch = HUB_MAP[ty][tx];
      if (ch === ".") continue; // matches background fill already
      const px = tx * TILE_SIZE;
      const py = ty * TILE_SIZE;
      if (ch === "#") {
        ctx.fillStyle = palette.surface2;
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      } else if (ch === "=") {
        ctx.fillStyle = palette.surface1;
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      } else if (ch === "~") {
        ctx.fillStyle = palette.primary;
        ctx.globalAlpha = 0.25;
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        ctx.globalAlpha = 1;
      }
    }
  }

  for (const b of BUILDINGS) {
    const bx = b.x * TILE_SIZE;
    const by = b.y * TILE_SIZE;
    const bw = b.w * TILE_SIZE;
    const bh = b.h * TILE_SIZE;
    ctx.fillStyle = palette.surface1;
    roundRectPath(ctx, bx, by, bw, bh, 8);
    ctx.fill();
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  return canvas;
}

interface Camera {
  x: number;
  y: number;
  viewW: number;
  viewH: number;
}

interface Player {
  x: number;
  y: number;
  animTime: number;
  facing: "up" | "down" | "left" | "right";
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  staticLayer: DrawableCanvas,
  camera: Camera,
  player: Player,
  nearestSlug: string | null,
  palette: EnginePalette,
  posters: Map<string, HTMLImageElement>
) {
  ctx.clearRect(0, 0, camera.viewW, camera.viewH);
  ctx.drawImage(
    staticLayer as CanvasImageSource,
    camera.x,
    camera.y,
    camera.viewW,
    camera.viewH,
    0,
    0,
    camera.viewW,
    camera.viewH
  );

  // Building signs + facade posters within view
  for (const b of BUILDINGS) {
    const bx = b.x * TILE_SIZE - camera.x;
    const by = b.y * TILE_SIZE - camera.y;
    const bw = b.w * TILE_SIZE;
    const bh = b.h * TILE_SIZE;
    if (bx + bw < -64 || bx > camera.viewW + 64 || by + bh < -64 || by > camera.viewH + 64) continue;

    const isNear = nearestSlug === b.slug;
    const poster = posters.get(b.slug);
    if (poster && poster.complete) {
      const pw = Math.min(bw - 8, 64);
      const ph = pw * (36 / 64);
      ctx.drawImage(poster, bx + (bw - pw) / 2, by + 6, pw, ph);
    }

    ctx.fillStyle = isNear ? palette.primary : palette.mutedForeground;
    ctx.font = "600 10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(b.sign, bx + bw / 2, by + bh - 6, bw + 16);

    if (isNear) {
      roundRectPath(ctx, bx - 2, by - 2, bw + 4, bh + 4, 10);
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // Player: procedural 2-frame bob, no sprite sheet
  const px = player.x - camera.x;
  const py = player.y - camera.y;
  const bob = Math.sin(player.animTime * 6) * 2;

  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(px, py + 12, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.primary;
  ctx.beginPath();
  ctx.arc(px, py + bob, 11, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.foreground;
  const dir = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[player.facing];
  ctx.beginPath();
  ctx.arc(px + dir[0] * 6, py + bob + dir[1] * 6, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Soft vignette
  const gradient = ctx.createRadialGradient(
    camera.viewW / 2,
    camera.viewH / 2,
    Math.min(camera.viewW, camera.viewH) * 0.35,
    camera.viewW / 2,
    camera.viewH / 2,
    Math.max(camera.viewW, camera.viewH) * 0.7
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, camera.viewW, camera.viewH);
}
