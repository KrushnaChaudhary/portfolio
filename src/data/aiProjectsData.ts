import { LucideIcon, Waves, Gamepad2, Sprout, Swords, Fish, Map as MapIcon, Clapperboard, Car, Puzzle } from "lucide-react";
import breakMyGameImg from "@/assets/ai/break-my-game.png";
import driftbriefImg from "@/assets/ai/driftbrief-map.png";

const LINKEDIN_ACTIVITY = "https://www.linkedin.com/in/krushna-chaudhary/recent-activity/all/";

export interface AiProject {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  tags: string[];
  status: "Open Source" | "Playable Demo" | "Prototype" | "Write-up";
  stat?: { label: string; value: string };
  /** Real artwork when available; otherwise a generated poster is drawn from `poster`. */
  image?: string;
  poster: { from: string; to: string; icon: LucideIcon };
  links: { label: string; url: string }[];
}

// Ordered by impact and visuals (order matters)
export const aiProjects: AiProject[] = [
  {
    slug: "pressureglass-taskkeel",
    title: "Pressureglass × Taskkeel",
    kicker: "Multi-agent game dev toolkit",
    description:
      "A deep-sea Unity action prototype (connected routes, six enemies, three-hit combos, perfect-dodge counters) built from a single prompt, with Taskkeel keeping parallel AI agents on gameplay, art and UI in sync through shared briefs, task ownership and stale-evidence checks.",
    tags: ["Unity", "Multi-Agent", "Codex", "Claude"],
    status: "Prototype",
    stat: { label: "Agents in parallel", value: "3 tracks" },
    poster: { from: "#0b3a5c", to: "#04121f", icon: Waves },
    links: [{ label: "LinkedIn", url: LINKEDIN_ACTIVITY }],
  },
  {
    slug: "h5-game-builder",
    title: "H5 Game Builder",
    kicker: "Prompt in, playable game out",
    description:
      "Seven specialist agents (orchestrator, art director, level designer, asset prep, smoke test, browser QA, bug fixer) that turn a one-line prompt into a mobile-first HTML5 game. Nothing ships until it clears the verify gate.",
    tags: ["Claude Code", "Cursor", "Copilot CLI", "Phaser", "Three.js"],
    status: "Open Source",
    stat: { label: "Specialist agents", value: "7" },
    poster: { from: "#2563eb", to: "#0b1530", icon: Gamepad2 },
    links: [
      { label: "Site", url: "https://krushnachaudhary.github.io/h5-game-builder-skill/" },
      { label: "GitHub", url: "https://github.com/KrushnaChaudhary/h5-game-builder-skill" },
      { label: "npm", url: "https://www.npmjs.com/package/@krackzzz/h5-game-builder" },
    ],
  },
  {
    slug: "mosslight",
    title: "Mosslight",
    kicker: "Design doc → playable world",
    description:
      "A 3D action prototype where every model and animation was made from scratch. Taskkeel carried design rules (like one chakram shared between both hands) across fresh AI sessions straight into gameplay.",
    tags: ["Unity", "Unity CLI", "Codex", "Taskkeel"],
    status: "Prototype",
    poster: { from: "#3f6b2a", to: "#0d1a0a", icon: Sprout },
    links: [{ label: "LinkedIn", url: LINKEDIN_ACTIVITY }],
  },
  {
    slug: "break-my-game",
    title: "Break My Game",
    kicker: "AI playtesting experiment",
    description:
      "A Rajasthan-inspired workshop with a deliberately planted economy loophole. Play it, then watch a recorded AI agent find the exploit with deterministic replays against the fixed version.",
    tags: ["Three.js", "AI Agents", "Deterministic Replay"],
    status: "Playable Demo",
    image: breakMyGameImg,
    poster: { from: "#7c3a12", to: "#1c0d05", icon: Swords },
    links: [{ label: "LinkedIn", url: LINKEDIN_ACTIVITY }],
  },
  {
    slug: "sushi-stampede",
    title: "Sushi Stampede",
    kicker: "2-hour game with Codex + Unity CLI",
    description:
      "A lunch-rush panda chaos game built in about two hours, with Codex driving the Unity Editor through Unity CLI, plus design skills for the UI and a video-editor skill for the trailer.",
    tags: ["Unity", "Unity CLI", "Codex", "Agent Skills"],
    status: "Prototype",
    stat: { label: "Impressions", value: "6.2K" },
    poster: { from: "#e11d48", to: "#2a0710", icon: Fish },
    links: [{ label: "LinkedIn", url: LINKEDIN_ACTIVITY }],
  },
  {
    slug: "driftbrief",
    title: "DriftBrief",
    kicker: "A map of your game for AI agents",
    description:
      "One install, one MCP tool: a compact, auto-updating map of scripts, scenes, prefabs and assets across Unity, Unreal, HTML5 and Cocos, so coding agents know how the game fits together before they build.",
    tags: ["MCP", "Unity", "Unreal", "Node.js"],
    status: "Open Source",
    stat: { label: "Default map", value: "4 KB" },
    image: driftbriefImg,
    poster: { from: "#0f766e", to: "#04201d", icon: MapIcon },
    links: [
      { label: "Demo", url: "https://krushnachaudhary.github.io/driftbrief/" },
      { label: "GitHub", url: "https://github.com/KrushnaChaudhary/driftbrief" },
    ],
  },
  {
    slug: "ue-metahuman-crowd",
    title: "UE 5.8 Crowd Cinematic",
    kicker: "Claude Code driving Unreal over MCP",
    description:
      "A rain-lit MetaHuman crowd cinematic set up through prompts, not keyframes. Documented three undocumented MCP traps, from hidden toolsets to a decoy navmesh.",
    tags: ["Unreal 5.8", "MCP", "MetaHuman", "Claude Code"],
    status: "Write-up",
    poster: { from: "#4c1d95", to: "#120724", icon: Clapperboard },
    links: [{ label: "GitHub", url: "https://github.com/KrushnaChaudhary/unreal-mcp-crowd-gotchas" }],
  },
  {
    slug: "sunset-circuit",
    title: "Sunset Circuit",
    kicker: "One-prompt racing prototype",
    description:
      "A racing prototype built with Codex as a test bed for a reusable game-dev framework, so every new game starts from stronger foundations.",
    tags: ["Unity", "Codex", "Framework"],
    status: "Prototype",
    poster: { from: "#f97316", to: "#2b0f05", icon: Car },
    links: [{ label: "LinkedIn", url: LINKEDIN_ACTIVITY }],
  },
  {
    slug: "level-lab",
    title: "Level Lab",
    kicker: "Any H5 game, real levels",
    description:
      "Adds a level generator and in-browser level editor to any single-file HTML5 game: difficulty-ramped level sets, live validity checks, JSON/ZIP import-export.",
    tags: ["Claude Code", "Cursor", "Copilot CLI", "Level Design"],
    status: "Open Source",
    poster: { from: "#d97706", to: "#231303", icon: Puzzle },
    links: [
      { label: "Site", url: "https://krushnachaudhary.github.io/level-lab-skill/" },
      { label: "GitHub", url: "https://github.com/KrushnaChaudhary/level-lab-skill" },
      { label: "npm", url: "https://www.npmjs.com/package/@krackzzz/level-lab" },
    ],
  },
];
