import { Vec2 } from "./types";

const MOVE_KEYS = new Set(["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"]);
// Space moved from interact to jump; E and Enter remain interact.
const INTERACT_KEYS = new Set(["e", "enter"]);
const JUMP_KEYS = new Set([" ", "spacebar"]);

export class InputController {
  x = 0;
  y = 0;

  private keys = new Set<string>();
  private joystickVec: Vec2 | null = null;
  private interactQueued = false;
  private jumpQueued = false;
  private escapeQueued = false;

  private handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

    const key = e.key.toLowerCase();
    if (MOVE_KEYS.has(key)) {
      e.preventDefault();
      this.keys.add(key);
    } else if (INTERACT_KEYS.has(key)) {
      e.preventDefault();
      this.interactQueued = true;
    } else if (JUMP_KEYS.has(key)) {
      // preventDefault stops Space scrolling the page behind the canvas.
      e.preventDefault();
      this.jumpQueued = true;
    } else if (key === "escape") {
      this.escapeQueued = true;
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.key.toLowerCase());
  };

  attach() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  detach() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    this.keys.clear();
  }

  // Touch joystick writes here each frame; pass null when released so keyboard resumes.
  setJoystickVector(vec: Vec2 | null) {
    this.joystickVec = vec;
  }

  // Touch "A" button — one-shot, mirrors the E/Enter keyboard path.
  queueInteract() {
    this.interactQueued = true;
  }

  // Touch "JUMP" button — one-shot, mirrors the Space keyboard path.
  queueJump() {
    this.jumpQueued = true;
  }

  consumeJump(): boolean {
    const value = this.jumpQueued;
    this.jumpQueued = false;
    return value;
  }

  consumeInteract(): boolean {
    const value = this.interactQueued;
    this.interactQueued = false;
    return value;
  }

  consumeEscape(): boolean {
    const value = this.escapeQueued;
    this.escapeQueued = false;
    return value;
  }

  update() {
    if (this.joystickVec) {
      this.x = this.joystickVec.x;
      this.y = this.joystickVec.y;
      return;
    }

    let x = 0;
    let y = 0;
    if (this.keys.has("arrowleft") || this.keys.has("a")) x -= 1;
    if (this.keys.has("arrowright") || this.keys.has("d")) x += 1;
    if (this.keys.has("arrowup") || this.keys.has("w")) y -= 1;
    if (this.keys.has("arrowdown") || this.keys.has("s")) y += 1;

    const len = Math.hypot(x, y) || 1;
    this.x = x / len;
    this.y = y / len;
  }
}
