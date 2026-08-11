import { LucideIcon, Gamepad2, Puzzle } from "lucide-react";

export interface AgenticSkill {
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  color: "neon-cyan" | "neon-purple" | "neon-gold" | "neon-pink";
  githubUrl: string;
  npmUrl: string;
  siteUrl: string;
  installCommand: string;
}

export const agenticSkills: AgenticSkill[] = [
  {
    icon: Gamepad2,
    title: "H5 Game Builder",
    tagline: "Prompt in, playable game out",
    description:
      "Turns a one-line prompt into a mobile-first HTML5 game: a single .html file with 2D Phaser or 3D Three.js gameplay, art, audio, and levels. Every build is gated by a lint pass and a browser QA harness before it ships.",
    tags: ["Claude Code", "Cursor", "Copilot CLI", "Phaser", "Three.js"],
    color: "neon-cyan",
    githubUrl: "https://github.com/KrushnaChaudhary/h5-game-builder-skill",
    npmUrl: "https://www.npmjs.com/package/@krackzzz/h5-game-builder",
    siteUrl: "https://krushnachaudhary.github.io/h5-game-builder-skill/",
    installCommand: "npx @krackzzz/h5-game-builder@latest",
  },
  {
    icon: Puzzle,
    title: "Level Lab",
    tagline: "Any H5 game, real levels",
    description:
      "Adds a level generator and an in-browser level editor to any single-file HTML5 game: a difficulty-ramped level set, per-level hand editing with live validity checks, and JSON/ZIP import-export.",
    tags: ["Claude Code", "Cursor", "Copilot CLI", "Level Design"],
    color: "neon-purple",
    githubUrl: "https://github.com/KrushnaChaudhary/level-lab-skill",
    npmUrl: "https://www.npmjs.com/package/@krackzzz/level-lab",
    siteUrl: "https://krushnachaudhary.github.io/level-lab-skill/",
    installCommand: "npx @krackzzz/level-lab@latest",
  },
];
