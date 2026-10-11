import breakMyGameImg from "@/assets/ai/break-my-game.webp";
import driftbriefCover from "@/assets/ai/driftbrief-cover.webp";
import driftbriefMap from "@/assets/ai/driftbrief-map.webp";
import h5Agents from "@/assets/ai/h5-builder-agents.webp";
import h5Pipeline from "@/assets/ai/h5-builder-pipeline.webp";
import levelLabImg from "@/assets/ai/level-lab-1.webp";
import mosslightImg from "@/assets/ai/mosslight-1.webp";
import pressureglassImg from "@/assets/ai/pressureglass-1.webp";
import sunsetCircuitImg from "@/assets/ai/sunset-circuit-1.webp";
import sushiImg from "@/assets/ai/sushi-stampede-1.webp";
import taskkeel1 from "@/assets/ai/taskkeel-1.webp";
import taskkeel2 from "@/assets/ai/taskkeel-2.webp";
import ueCrowdImg from "@/assets/ai/ue-crowd-1.webp";

export interface AiProject {
  slug: string;
  title: string;
  kicker: string;
  /** One-line card summary. */
  description: string;
  /** Detail-page body, paragraphs separated by blank lines. */
  overview: string;
  /** Ordered steps / mechanism, shown as a numbered flow. */
  howItWorks: { title: string; body: string }[];
  highlights: string[];
  stack: string[];
  tags: string[];
  status: "Open Source" | "Playable Demo" | "Prototype" | "Write-up";
  year: string;
  stat?: { label: string; value: string };
  image: string;
  gallery: string[];
  /** Videos served from public/videos (lazy-loaded on the detail page). */
  videos?: { src: string; title: string }[];
  links: { label: string; url: string }[];
}

// Ordered by impact and visuals (order matters)
export const aiProjects: AiProject[] = [
  {
    slug: "pressureglass-taskkeel",
    title: "Pressureglass × Taskkeel",
    kicker: "Multi-agent game development",
    description:
      "A deep-sea Unity action game built from one prompt, with Taskkeel keeping parallel AI agents on gameplay, art and UI in sync.",
    overview:
      "Pressureglass is a deep-sea Unity action prototype: connected routes, six enemies across two types, three-hit combos and a perfect-dodge counter. It started from a single prompt, and every system after that (gameplay, environments, characters, enemies, combat, UI and art) was built out around it.\n\nThe real experiment was Taskkeel, the toolkit I built to keep that work coherent. Gameplay, art and UI were developed in parallel by separate AI sessions. Taskkeel gives them shared briefs, explicit task ownership, dependencies and handoff packets, so a fresh agent can pick up work without the brief being rebuilt.\n\nIts sharpest feature is evidence freshness. In a handoff test, a new agent added a checkpoint notification to the HUD. Taskkeel flagged the earlier PASS as STALE and named the changed file: the old result stayed in the record as history, but no longer counted as proof. Taskkeel is file-and-CLI based with no dependency on any model provider.",
    howItWorks: [
      { title: "Brief", body: "Goals, decisions and owners captured once in project files." },
      { title: "Parallel work", body: "Gameplay, art and UI agents each own their tasks and dependencies." },
      { title: "Handoff", body: "Completed work plus next steps packaged for the next session." },
      { title: "Check", body: "Source fingerprints flag stale evidence when code changes under it." },
    ],
    highlights: [
      "Built from a single prompt",
      "6 enemies, 2 enemy types",
      "3-hit combos + perfect-dodge counter",
      "STALE detection on changed source",
      "Model-independent workflow",
    ],
    stack: ["Unity", "C#", "Codex", "Claude", "Taskkeel CLI"],
    tags: ["Unity", "Multi-Agent", "Codex", "Claude"],
    status: "Prototype",
    year: "2026",
    stat: { label: "Parallel agent tracks", value: "3" },
    image: pressureglassImg,
    gallery: [pressureglassImg, taskkeel1, taskkeel2],
    videos: [
      { src: "videos/taskkeel-v2.mp4", title: "Taskkeel showcase (v2)" },
      { src: "videos/taskkeel-v1.mp4", title: "Taskkeel showcase (v1)" },
    ],
    links: [],
  },
  {
    slug: "break-my-game",
    title: "Break My Game",
    kicker: "AI playtesting experiment",
    description:
      "A Rajasthan-inspired armory with a planted economy loophole. Play it, then watch an AI agent find the exploit with deterministic replays.",
    overview:
      "You start with 100 coins. Can you leave the shop with more? Break My Game is a playable experiment that combines gameplay programming with AI playtesting.\n\nYou step inside a Rajasthan-inspired workshop, inspect equipment, buy it, equip it and test the shop's rules. A loophole has been deliberately planted in the economy. After trying it yourself, you can watch a recorded AI agent's playtest and compare the same moves against the fixed version.\n\nThe engineering question behind it: can an agent explore a game's rules and leave a reproducible sequence a developer can investigate? It is the first step toward agents that help developers test interactive systems.",
    howItWorks: [
      { title: "Instrumented economy", body: "Every buy, sell and equip is logged as a game event." },
      { title: "Agent explores", body: "An AI agent probes the shop's rules for value it shouldn't get." },
      { title: "Deterministic replay", body: "The exact move sequence replays identically, step by step." },
      { title: "Compare against the fix", body: "The same moves run on the patched build to prove the hole is closed." },
    ],
    highlights: ["Playable in the browser", "Planted economy loophole", "Recorded AI agent playtest", "Deterministic replays", "Before/after comparison"],
    stack: ["Three.js", "JavaScript", "AI Agents", "Claude", "Codex"],
    tags: ["Three.js", "AI Playtesting", "Replay"],
    status: "Playable Demo",
    year: "2026",
    stat: { label: "Starting coins", value: "100" },
    image: breakMyGameImg,
    gallery: [breakMyGameImg],
    links: [{ label: "Play the demo", url: "https://bhangarh-armory.kvc7171.chatgpt.site/" }],
  },
  {
    slug: "h5-game-builder",
    title: "H5 Game Builder",
    kicker: "Prompt in, playable game out",
    description:
      "Seven specialist agents turn a one-line prompt into a mobile-first HTML5 game. Nothing ships until it clears the verify gate.",
    overview:
      "H5 Game Builder is an installable agent skill for Claude Code, Cursor and GitHub Copilot CLI. Give it \"make me a runner where you dodge cars\" and it produces a working, mobile-first game in a single self-contained .html file, with 2D Phaser or 3D Three.js gameplay, art, audio and levels inlined.\n\nIt is not one big chatbot. A main agent plans the build, then dispatches specialists for the parts that need their own judgment, and gates the result before calling it done. It uses your own art if you have it, or sources it otherwise, and lets you pick a palette and font pairing or picks one for you.\n\nIt pairs with Level Lab for difficulty-tuned levels. I've used it to prototype real games solo, including Animal Park, which went on to ship on Google Play.",
    howItWorks: [
      { title: "Build (4 agents, parallel)", body: "Orchestrator, art director, level designer and asset prep." },
      { title: "Verify (2 agents)", body: "A fast smoke check, then a QA tester that actually plays the build in a browser." },
      { title: "Fix", body: "A bug fixer patches against a 45-bug catalog and loops back to verify." },
      { title: "Ship", body: "Only a build that passes the lint gate and QA verdict is called done." },
    ],
    highlights: ["7 specialist agents", "Single .html output", "Lint gate + browser QA", "45-bug fix catalog", "Phaser 2D or Three.js 3D", "Published on npm"],
    stack: ["Claude Code", "Cursor", "Copilot CLI", "Phaser", "Three.js", "Node.js"],
    tags: ["Agent Skill", "Phaser", "Three.js"],
    status: "Open Source",
    year: "2026",
    stat: { label: "Specialist agents", value: "7" },
    image: h5Agents,
    gallery: [h5Agents, h5Pipeline],
    links: [
      { label: "Website", url: "https://krushnachaudhary.github.io/h5-game-builder-skill/" },
      { label: "GitHub", url: "https://github.com/KrushnaChaudhary/h5-game-builder-skill" },
      { label: "npm", url: "https://www.npmjs.com/package/@krackzzz/h5-game-builder" },
    ],
  },
  {
    slug: "sushi-stampede",
    title: "Sushi Stampede",
    kicker: "A 2-hour game with Codex + Unity CLI",
    description:
      "A lunch-rush panda chaos game built in about two hours, with Codex driving the Unity Editor through Unity CLI.",
    overview:
      "Sushi Stampede turns lunch-rush chaos into a playable game: a panda waiter balancing a tray of sushi down a cherry-blossom aisle, racing a timer to serve every table without dropping lunch.\n\nCodex and Unity CLI did the heavy lifting: building the gameplay, working inside the Unity Editor and iterating on the running game. With the right skills the workflow went beyond gameplay too. Design skills drove the UI redesign from the home screen to the HUD and results, and a video-editor skill shaped the hook, pacing and final reveal of the trailer, all in the same session.\n\nThe point: AI gives you a lovely head start. Then comes taste, the small details and the game juice that make it yours.",
    howItWorks: [
      { title: "Prompt the idea", body: "Codex plans the loop: carry, balance, serve before the timer runs out." },
      { title: "Drive the Editor", body: "Unity CLI lets the agent build scenes and iterate on the running game." },
      { title: "Design pass", body: "Design skills restyle the home screen, HUD and results." },
      { title: "Cut the trailer", body: "A video-editor skill assembles the hook, pacing and reveal." },
    ],
    highlights: ["Built in ~2 hours", "Agent-driven Unity Editor", "Full UI redesign", "Trailer cut in-session", "6.2K post impressions"],
    stack: ["Unity", "Unity CLI", "Codex", "Agent Skills"],
    tags: ["Unity CLI", "Codex", "Rapid Prototyping"],
    status: "Prototype",
    year: "2026",
    stat: { label: "Build time", value: "~2h" },
    image: sushiImg,
    gallery: [sushiImg],
    links: [],
  },
  {
    slug: "mosslight",
    title: "Mosslight",
    kicker: "Design doc → playable world",
    description:
      "A 3D action prototype with every model and animation made from scratch, where design rules carried across AI sessions into gameplay.",
    overview:
      "Mosslight is my first prototype where a design document became a playable world. Every 3D model and animation was created from scratch.\n\nThe quiet superpower behind it is Taskkeel. It keeps decisions, evidence and next steps in project files, so a fresh AI session can continue without the brief being rebuilt. One concrete example: the rule \"one chakram, shared between both hands\" carried across sessions straight into gameplay.\n\nI'm growing Mosslight into a complete, polished game while expanding Taskkeel into more workflows.",
    howItWorks: [
      { title: "Design doc", body: "Core rules and fantasy written once as project decisions." },
      { title: "Taskkeel memory", body: "Decisions and evidence persist across fresh AI sessions." },
      { title: "Build", body: "Unity CLI + Codex turn the rules into combat and level layout." },
      { title: "Polish", body: "Custom models and animations, then iteration toward a full game." },
    ],
    highlights: ["All models & animations from scratch", "Single shared-chakram weapon", "Design rules persisted across sessions", "First playable"],
    stack: ["Unity", "Unity CLI", "Codex", "Taskkeel"],
    tags: ["Unity", "Unity CLI", "Taskkeel"],
    status: "Prototype",
    year: "2026",
    image: mosslightImg,
    gallery: [mosslightImg],
    videos: [{ src: "videos/mosslight.mp4", title: "Mosslight first playable" }],
    links: [],
  },
  {
    slug: "ue-metahuman-crowd",
    title: "UE 5.8 Crowd Cinematic",
    kicker: "Claude Code driving Unreal over MCP",
    description:
      "A rain-lit MetaHuman crowd cinematic set up through prompts, not keyframes, plus a write-up of three undocumented MCP traps.",
    overview:
      "A MetaHuman crowd walking down a rain-lit neon street with a full cinematic camera move, set up by an AI agent (Claude Code) driving the Unreal Editor through Unreal's MCP plugin rather than by hand-placing assets and keyframes. The first pass took four or five prompts.\n\nThree gotchas nearly stopped the workflow, and none were documented anywhere obvious, so I wrote them up as a free reference repo with the fixes.",
    howItWorks: [
      { title: "Trap 1: hidden toolsets", body: "MCP connects but exposes 1 toolset. Enabling the Experimental \"All Toolsets\" plugin took it to 52." },
      { title: "Trap 2: silent crowd spawn", body: "Zero agents, zero errors, and a decoy actor that mimics a valid navmesh." },
      { title: "Trap 3: hard-coded wander", body: "The wander radius is compiled into a behaviour-tree asset with no API to change it." },
      { title: "Result", body: "A documented, repeatable agent-driven cinematic workflow." },
    ],
    highlights: ["MetaHuman Crowd", "Sequencer camera move via prompts", "1 → 52 MCP toolsets", "Open write-up with fixes"],
    stack: ["Unreal Engine 5.8", "MCP", "MetaHuman", "Claude Code", "Sequencer"],
    tags: ["Unreal 5.8", "MCP", "MetaHuman"],
    status: "Write-up",
    year: "2026",
    stat: { label: "MCP toolsets unlocked", value: "52" },
    image: ueCrowdImg,
    gallery: [ueCrowdImg],
    links: [{ label: "Read the write-up", url: "https://github.com/KrushnaChaudhary/unreal-mcp-crowd-gotchas" }],
  },
  {
    slug: "driftbrief",
    title: "DriftBrief",
    kicker: "A map of your game for AI agents",
    description:
      "One install, one MCP tool: a compact, auto-updating map of scripts, scenes, prefabs and assets across Unity, Unreal and HTML5.",
    overview:
      "Before AI builds the next system, give it a map of the game you already have. Which scene uses this prefab? Which script drives it? Where should the new system connect?\n\nDriftBrief gives coding agents a compact, automatically updated map of an existing game. One installation command adds integrations for Codex, Claude Code and Cursor. Agents get a single map() tool that returns a project overview, or the connected scripts, prefabs, scenes and assets around a query like \"PlayerMovement\".\n\nIt runs locally, reads game files read-only, reuses parsed data when source hashes match, and keeps the default response to 4 KB including metadata. Godot support is planned next.",
    howItWorks: [
      { title: "Install once", body: "One Node script builds the first index and wires up Codex, Claude Code and Cursor." },
      { title: "Index", body: "Engine adapters read GUIDs, modules, imports and asset paths." },
      { title: "map()", body: "One MCP tool: overview, or two relationship hops around a query." },
      { title: "Stay fresh", body: "Every request reconciles changed files; a worker refreshes in the background." },
    ],
    highlights: ["Unity, Unreal, HTML5, Cocos", "One MCP tool", "4 KB default map", "Local & read-only", "Open source (MIT)"],
    stack: ["Node.js", "MCP", "Unity", "Unreal", "Phaser", "Cocos"],
    tags: ["MCP", "Unity", "Unreal"],
    status: "Open Source",
    year: "2026",
    stat: { label: "Default map", value: "4 KB" },
    image: driftbriefCover,
    gallery: [driftbriefCover, driftbriefMap],
    links: [
      { label: "Interactive demo", url: "https://krushnachaudhary.github.io/driftbrief/" },
      { label: "GitHub", url: "https://github.com/KrushnaChaudhary/driftbrief" },
    ],
  },
  {
    slug: "sunset-circuit",
    title: "Sunset Circuit",
    kicker: "One-prompt racing prototype",
    description:
      "A coastal arcade racer started from one prompt with Codex, and a test bed for a reusable game-dev framework.",
    overview:
      "Sunset Circuit is a racing prototype built with Codex: coastal runs at golden hour and arcade drifts along a cliffside road. One prompt gave the starting point.\n\nIt is one of the test projects for the game-development framework I'm building. The useful parts of each prototype get turned into reusable foundations, so every new game starts stronger instead of repeating the same setup, leaving more time for game feel, polish, juice and thoughtful architecture.",
    howItWorks: [
      { title: "One prompt", body: "Codex produces a drivable starting point." },
      { title: "Iterate", body: "Coastal track, drift handling and camera tuned in Unity." },
      { title: "Extract", body: "Reusable systems pulled out into the framework." },
      { title: "Next build", body: "The framework is tested again on the next game." },
    ],
    highlights: ["Coastal run track", "Arcade drift handling", "Framework test bed"],
    stack: ["Unity", "Codex"],
    tags: ["Unity", "Codex", "Racing"],
    status: "Prototype",
    year: "2026",
    image: sunsetCircuitImg,
    gallery: [sunsetCircuitImg],
    links: [],
  },
  {
    slug: "level-lab",
    title: "Level Lab",
    kicker: "Any H5 game, real levels",
    description:
      "Adds a level generator and in-browser level editor to any single-file HTML5 game, with live validity checks.",
    overview:
      "Level Lab is the companion skill to H5 Game Builder. It adds a level generator and an in-browser level editor to a single-file HTML5 game. It writes an ordered, difficulty-ramped level set, lets you edit and re-export any level by hand, and inlines all of it into the same .html file, with no server and no extra assets.",
    howItWorks: [
      { title: "Level generator", body: "30 levels by default on an Easy/Easy/Medium/Easy/Hard curve, each checked for validity." },
      { title: "Level editor", body: "Open any level, edit the board by hand, get a live validity check, save or revert." },
      { title: "Blocker introduction", body: "Choose which levels introduce each obstacle so difficulty ramps instead of spiking." },
      { title: "Import / export", body: "JSON and ZIP round-trips for every level." },
    ],
    highlights: ["30-level default set", "Live validity checks", "JSON/ZIP import-export", "Published on npm"],
    stack: ["Claude Code", "Cursor", "Copilot CLI", "HTML5"],
    tags: ["Agent Skill", "Level Design"],
    status: "Open Source",
    year: "2026",
    image: levelLabImg,
    gallery: [levelLabImg],
    links: [
      { label: "Website", url: "https://krushnachaudhary.github.io/level-lab-skill/" },
      { label: "GitHub", url: "https://github.com/KrushnaChaudhary/level-lab-skill" },
      { label: "npm", url: "https://www.npmjs.com/package/@krackzzz/level-lab" },
    ],
  },
];

export const aiProjectsBySlug: Record<string, AiProject> = Object.fromEntries(aiProjects.map((p) => [p.slug, p]));
