import { LucideIcon, Gamepad2, Network, Wrench, Cpu, Palette, Zap } from "lucide-react";
import { Accent } from "@/lib/accents";

export type SkillBranch = "engine" | "systems" | "tools";

export interface SkillNode {
  id: string;
  label: string;
  branch: SkillBranch;
  tier: number;
  level: number; // proficiency, 1-5
  items: string[];
  icon: LucideIcon;
  accent: Accent;
  requires?: string[];
  blurb: string;
  relatedSlugs?: string[];
}

const BRANCH_ACCENT: Record<SkillBranch, Accent> = {
  engine: "primary",
  systems: "warm",
  tools: "neutral",
};

export const skillTreeData: SkillNode[] = [
  {
    id: "game-engines",
    label: "Game Engines",
    branch: "engine",
    tier: 1,
    level: 5,
    items: ["Unity 3D/2D", "Unreal Engine", "Roblox Studio"],
    icon: Gamepad2,
    accent: BRANCH_ACCENT.engine,
    blurb: "Primary engine on every Unity mobile title, plus solo Roblox Studio development.",
    relatedSlugs: ["rann-bhumi", "grid-filler", "mini-golf"],
  },
  {
    id: "networking",
    label: "Networking",
    branch: "systems",
    tier: 1,
    level: 4,
    items: ["Photon Fusion", "Photon PUN 2", "Unity Relay/Lobby"],
    icon: Network,
    accent: BRANCH_ACCENT.systems,
    requires: ["game-engines"],
    blurb: "Authoritative server logic and state sync for real-time multiplayer combat and card games.",
    relatedSlugs: ["rann-bhumi", "monster-mayhem", "rummy-3d"],
  },
  {
    id: "core-systems",
    label: "Core Systems",
    branch: "systems",
    tier: 2,
    level: 5,
    items: ["Gameplay AI", "Combat", "Meta-Economy", "Physics"],
    icon: Cpu,
    accent: BRANCH_ACCENT.systems,
    requires: ["game-engines"],
    blurb: "Enemy AI and wave systems, class-based combat, and custom physics for ball-roll gameplay.",
    relatedSlugs: ["monster-mayhem", "rann-bhumi", "mini-golf"],
  },
  {
    id: "development",
    label: "Development",
    branch: "tools",
    tier: 1,
    level: 4,
    items: ["C#", "Visual Studio", "JetBrains Rider", "Git"],
    icon: Wrench,
    accent: BRANCH_ACCENT.tools,
    blurb: "Day-to-day C# gameplay and tooling work across every shipped and prototyped title.",
  },
  {
    id: "productivity",
    label: "Productivity",
    branch: "tools",
    tier: 2,
    level: 3,
    items: ["n8n Automation", "CI/CD", "Jenkins", "JIRA"],
    icon: Zap,
    accent: BRANCH_ACCENT.tools,
    requires: ["development"],
    blurb: "Built an n8n build-distribution pipeline at Kwalee that cut release overhead by 30%.",
  },
  {
    id: "creative-tools",
    label: "Creative Tools",
    branch: "tools",
    tier: 3,
    level: 3,
    items: ["Blender", "Maya", "Photoshop", "After Effects"],
    icon: Palette,
    accent: BRANCH_ACCENT.tools,
    requires: ["development"],
    blurb: "Prop and environment art, UI mockups, and trailer edits to support solo prototyping.",
  },
];
