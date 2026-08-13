import * as THREE from "three";

const COVER_SIZE = 256; // downscaled backing size, not the source image size
const MAX_CONCURRENT = 2;
const POLL_INTERVAL = 0.25; // seconds

interface CoverEntry {
  texture: THREE.CanvasTexture;
  ready: boolean;
}

interface PendingRequest {
  slug: string;
  url: string;
  priority: number; // lower = sooner
}

/**
 * Lazily loads and downscales project cover art for the holograms.
 *
 * Twelve full-size collage PNGs (several 1-2MB, up to 2048px) would be
 * ~180MB of GPU texture memory if used directly — on a mid-range phone
 * that's an OOM tab crash, not a slow frame. Every cover is decoded once
 * into a 256x256 canvas and the source Image is dropped immediately after,
 * so VRAM cost stays in single-digit MB regardless of source resolution.
 *
 * This caps GPU memory, not network bytes: the source files are still
 * fetched at full size. A real fix needs generated WebP variants, which is
 * out of scope here (it would need a new build-time dependency touching the
 * whole site's asset pipeline, for images that change roughly never).
 */
export class CoverLoader {
  private covers = new Map<string, CoverEntry>();
  private queue: PendingRequest[] = [];
  private inFlight = 0;
  private disposed = false;

  request(slug: string, url: string, priority: number) {
    if (this.covers.has(slug)) return;
    const existing = this.queue.find((r) => r.slug === slug);
    if (existing) {
      existing.priority = Math.min(existing.priority, priority);
      return;
    }
    this.queue.push({ slug, url, priority });
  }

  /** Called on a timer, not per frame — see POLL_INTERVAL. */
  static get pollInterval() {
    return POLL_INTERVAL;
  }

  pump() {
    if (this.disposed) return;
    this.queue.sort((a, b) => a.priority - b.priority);
    while (this.inFlight < MAX_CONCURRENT && this.queue.length > 0) {
      const next = this.queue.shift()!;
      this.load(next);
    }
  }

  private load(req: PendingRequest) {
    this.inFlight++;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      this.inFlight--;
      if (this.disposed) return;
      const canvas = document.createElement("canvas");
      canvas.width = COVER_SIZE;
      canvas.height = COVER_SIZE;
      const ctx = canvas.getContext("2d")!;
      // Cover-fit crop so a non-square source doesn't distort on the panel.
      const scale = Math.max(COVER_SIZE / img.width, COVER_SIZE / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (COVER_SIZE - dw) / 2, (COVER_SIZE - dh) / 2, dw, dh);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.anisotropy = Math.min(4, 4);
      this.covers.set(req.slug, { texture, ready: true });
    };
    img.onerror = () => {
      // Never retry: a broken image URL would otherwise be requested forever
      // as the player walks in and out of range.
      this.inFlight--;
      this.covers.set(req.slug, { texture: new THREE.CanvasTexture(document.createElement("canvas")), ready: false });
    };
    img.src = req.url;
  }

  get(slug: string): THREE.CanvasTexture | null {
    const entry = this.covers.get(slug);
    return entry?.ready ? entry.texture : null;
  }

  dispose() {
    this.disposed = true;
    this.queue = [];
    for (const entry of this.covers.values()) entry.texture.dispose();
    this.covers.clear();
  }
}
