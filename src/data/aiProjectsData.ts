import breakMyGameImg from "@/assets/ai/break-my-game.webp";
import driftbriefCover from "@/assets/ai/driftbrief-cover.webp";
import driftbriefMap from "@/assets/ai/driftbrief-map.webp";
import h5Agents from "@/assets/ai/h5-builder-agents.webp";
import h5Pipeline from "@/assets/ai/h5-builder-pipeline.webp";
import floatOutImg from "@/assets/ai/float-out.webp";
import pourArtImg from "@/assets/ai/pour-art.webp";
import mixJamImg from "@/assets/ai/mix-jam.webp";
import liftOffImg from "@/assets/ai/lift-off.webp";
import glassLightImg from "@/assets/ai/glass-and-light.webp";
import packItShutImg from "@/assets/ai/pack-it-shut.webp";
import paintPawsImg from "@/assets/ai/paint-paws.webp";
import animalParkCover from "@/assets/animal-park-cover.jpg";
import animalPark1 from "@/assets/animal-park-1.jpg";
import animalPark2 from "@/assets/animal-park-2.jpg";
import animalPark3 from "@/assets/animal-park-3.jpg";
import aquaJamImg from "@/assets/ai/aqua-jam.webp";
import paintByLogicImg from "@/assets/ai/paint-by-logic.webp";
import numberPuzzleImg from "@/assets/ai/number-puzzle-blocks.webp";
import planetation1 from "@/assets/planetation-1.jpg";
import planetation2 from "@/assets/planetation-2.jpg";
import planetation3 from "@/assets/planetation-3.jpg";
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
  /** Groups the AI column filter: games built with AI, dev tools, or one-off experiments. */
  category: "Game" | "Tool" | "Experiment";
  status: "Shipped" | "Open Source" | "Playable Demo" | "Prototype" | "Write-up";
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
    category: "Game",
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
    category: "Experiment",
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
    category: "Tool",
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
    slug: "animal-park",
    category: "Game",
    title: "Animal Park",
    kicker: "AI-prototyped, shipped on Google Play",
    description:
      "A colour-sorting crowd puzzle prototyped in a single session with H5 Game Builder and Level Lab, then taken to a full Google Play release.",
    overview:
      "Animal Park is a colour-sorting puzzle: cute animal visitors line up at the gates waiting to board a train, but each cart only accepts its matching colour. Tap the gates to move animals forward. If the right cart isn't ready, they wait on a central carousel with limited seats. Fill the carousel with nowhere left to go, and it's a jam.\n\nThis started as a same-day prototype at Kwalee, built with the H5 Game Builder and Level Lab skills I built myself, and went on to become a fully shipped release on Google Play.",
    howItWorks: [
      { title: "One-line prompt", body: "H5 Game Builder turned the idea into a playable build in one session." },
      { title: "Tune levels", body: "Level Lab generated and balanced the difficulty curve." },
      { title: "Prove the fun", body: "The prototype was played and validated at Kwalee." },
      { title: "Ship", body: "Taken forward to a full release on Google Play." },
    ],
    highlights: ["Live on Google Play", "Same-day AI prototype", "Colour-matching sort puzzle", "Carousel jam-avoidance mechanic"],
    stack: ["H5 Game Builder", "Level Lab", "HTML5"],
    tags: ["Puzzle", "H5 Game Builder", "Shipped"],
    status: "Shipped",
    year: "2024",
    stat: { label: "Prompt to playable", value: "1 day" },
    image: animalParkCover,
    gallery: [animalParkCover, animalPark1, animalPark2, animalPark3],
    links: [{ label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.pocketspark.animalpark&hl=en" }],
  },
  {
    slug: "aqua-jam",
    category: "Game",
    title: "Aqua Jam",
    kicker: "Colour-sorting river traffic puzzle",
    description:
      "Send boats around a river loop to pick up riders of their colour; no overtaking, so one bad tap jams the channel.",
    overview:
      "A colour-sorting traffic puzzle on a river loop, and the next version of Color Water Trip. Tap the front boat in a line to send it around the channel. At each dock, riders who don't match hop off and the boat picks up riders of its colour.\n\nA boat leaves once it's full of one colour. Boats can't overtake, so a jam ends the level. Mystery boats, two-colour docks, roped boats and locked docks come in later.",
    howItWorks: [
      { title: "Tap a boat", body: "The front boat in a line sets off around the channel." },
      { title: "Swap riders", body: "At each dock, non-matching riders hop off and matching ones board." },
      { title: "Fill and leave", body: "A boat full of one colour exits the loop." },
      { title: "Avoid the jam", body: "Boats can't overtake, so order matters." },
    ],
    highlights: ["35 levels across 4 themes", "Mystery boats and two-colour docks", "Roped boats and locked docks", "Next version of Color Water Trip"],
    stack: [],
    tags: ["Puzzle", "Colour Sort", "Shipped"],
    status: "Shipped",
    year: "2026",
    stat: { label: "Levels", value: "35" },
    image: aquaJamImg,
    gallery: [aquaJamImg],
    videos: [{ src: "videos/aqua-jam.mp4", title: "Aqua Jam gameplay" }],
    links: [],
  },
  {
    slug: "paint-by-logic",
    category: "Game",
    title: "Paint by Logic",
    kicker: "Shikaku logic puzzle that paints a picture",
    description:
      "Drag rectangles so each holds one number and covers that many cells; every solved rectangle paints in part of the artwork.",
    overview:
      "A Shikaku logic puzzle that reveals a painting, one section at a time. Drag rectangles so each one holds exactly one number and covers that many cells, and each rectangle paints in part of the artwork.\n\nMistakes can be tapped back out, and a hint bulb solves one number. Finish before the clock runs out. Pip the penguin is the mascot.",
    howItWorks: [
      { title: "Read the numbers", body: "Each number is the area its rectangle must cover." },
      { title: "Drag rectangles", body: "Each rectangle holds exactly one number." },
      { title: "Paint the art", body: "Every correct rectangle reveals part of the painting." },
      { title: "Beat the clock", body: "Tap mistakes back out, or use a hint bulb." },
    ],
    highlights: ["Painting revealed piece by piece", "Hint bulb solves one number", "Timed levels", "25 levels, Pip the penguin mascot"],
    stack: [],
    tags: ["Puzzle", "Logic", "Shikaku"],
    status: "Shipped",
    year: "2026",
    stat: { label: "Levels", value: "25" },
    image: paintByLogicImg,
    gallery: [paintByLogicImg],
    videos: [{ src: "videos/paint-by-logic.mp4", title: "Paint by Logic gameplay" }],
    links: [],
  },
  {
    slug: "number-puzzle-blocks",
    category: "Game",
    title: "Number Puzzle Blocks",
    kicker: "Shikaku puzzle with 3D bead art (Penguin Painter)",
    description:
      "The same Shikaku rules as Paint by Logic, but each rectangle fills with shiny 3D beads, so a finished level becomes bead pixel art.",
    overview:
      "Shown in-game as \"Number Puzzle Blocks\"; the project is called Penguin Painter. It uses the same Shikaku rules and levels as Paint by Logic.\n\nThe difference is the art: each rectangle fills with shiny raised 3D beads, so a finished level becomes a bead (pixel-art) picture instead of a painting.",
    howItWorks: [
      { title: "Read the numbers", body: "Each number is the area its rectangle must cover." },
      { title: "Drag rectangles", body: "Each rectangle holds exactly one number." },
      { title: "Fill with beads", body: "Correct rectangles fill with raised 3D beads." },
      { title: "Bead picture", body: "A solved level becomes a pixel-art bead image." },
    ],
    highlights: ["Shiny raised 3D beads", "Pixel-art picture reveal", "Same rules as Paint by Logic", "25 levels"],
    stack: [],
    tags: ["Puzzle", "Logic", "Pixel Art"],
    status: "Shipped",
    year: "2026",
    stat: { label: "Levels", value: "25" },
    image: numberPuzzleImg,
    gallery: [numberPuzzleImg],
    videos: [{ src: "videos/number-puzzle-blocks.mp4", title: "Number Puzzle Blocks gameplay" }],
    links: [],
  },
  {
    slug: "float-out",
    category: "Game",
    title: "Float Out",
    kicker: "Pull-the-pin water puzzle",
    description:
      "Pull gold pins and turn valves so real-time particle water flows tank to tank until a rubber duck floats out to its pond.",
    overview:
      "A pull-the-pin water puzzle with real-time particle water. Glass tanks sit in a white toy frame on a grassy island with ponds. You pull gold pins and turn valve wheels so the water flows from tank to tank until a rubber duck floats up to its door, then rides a gush of water out into a pond.\n\nLater levels add chutes, U-tube pipes, drains, a sponge, a falling crate and a two-duck finale, so the order you open things in matters.",
    howItWorks: [
      { title: "Pull pins", body: "Gold pins hold the water back in each glass tank." },
      { title: "Turn valves", body: "Valve wheels route the flow between tanks." },
      { title: "Float the duck", body: "Water lifts the rubber duck up to its door." },
      { title: "Out to the pond", body: "The duck rides a gush of water out into the pond." },
    ],
    highlights: ["Real-time particle water", "Chutes, U-tubes, drains, sponge, falling crate", "Two-duck finale", "6 levels"],
    stack: [],
    tags: ["Puzzle", "Physics", "Water Sim"],
    status: "Prototype",
    year: "2026",
    stat: { label: "Levels", value: "6" },
    image: floatOutImg,
    gallery: [floatOutImg],
    videos: [{ src: "videos/float-out.mp4", title: "Float Out gameplay" }],
    links: [],
  },
  {
    slug: "pour-art",
    category: "Game",
    title: "Pour Art",
    kicker: "Acrylic pour-painting puzzle",
    description:
      "Tap paint bottles in the order the cup asks for; live marbling paint pours onto the canvas and reveals a hidden picture.",
    overview:
      "An acrylic pour-painting puzzle. You tap paint bottles in the colour order the cup asks for. Colours that aren't needed yet wait on a 5-slot rack, and a wrong tap when the rack is full loses the level.\n\nEach colour drops onto the canvas as live marbling paint, and after the last cup the marble turns into a hidden picture.",
    howItWorks: [
      { title: "Read the cup", body: "The cup asks for colours in a set order." },
      { title: "Tap bottles", body: "Correct colours pour; others wait on a 5-slot rack." },
      { title: "Marble the canvas", body: "Each colour lands as live marbling paint." },
      { title: "Reveal", body: "After the last cup, the marble becomes a hidden picture." },
    ],
    highlights: ["Live marbling paint", "5-slot holding rack", "Hidden-picture reveal", "6 levels: heart, tulip, strawberry, sailboat, fish, sunrise"],
    stack: [],
    tags: ["Puzzle", "Fluid Paint", "Casual"],
    status: "Prototype",
    year: "2026",
    stat: { label: "Levels", value: "6" },
    image: pourArtImg,
    gallery: [pourArtImg],
    videos: [{ src: "videos/pour-art.mp4", title: "Pour Art gameplay" }],
    links: [],
  },
  {
    slug: "mix-jam",
    category: "Game",
    title: "Mix Jam",
    kicker: "Paint-mixing sliding block puzzle",
    description:
      "Slide half tanks together: matching colours fill, primaries mix into orange, green or purple with live fluid paint.",
    overview:
      "A sliding block puzzle about mixing paint. Slide half tanks together: matching colours fill up, and two primaries pour into their mix (orange, green or purple) with live fluid paint.\n\nA full tank gets a lid and leaves through the door of its colour. Clear the board before the timer runs out, with Freeze and Hammer as tools. Glossy toy look throughout.",
    howItWorks: [
      { title: "Slide tanks", body: "Push half-filled tanks across the board." },
      { title: "Fill or mix", body: "Same colours fill up; two primaries pour into their mix." },
      { title: "Lid and exit", body: "A full tank is lidded and leaves through its colour's door." },
      { title: "Beat the clock", body: "Clear the board before time runs out, with Freeze and Hammer." },
    ],
    highlights: ["Live fluid paint mixing", "Orange, green and purple mixes", "Freeze and Hammer tools", "6 levels"],
    stack: [],
    tags: ["Puzzle", "Sliding Blocks", "Colour Mixing"],
    status: "Prototype",
    year: "2026",
    stat: { label: "Levels", value: "6" },
    image: mixJamImg,
    gallery: [mixJamImg],
    videos: [{ src: "videos/mix-jam.mp4", title: "Mix Jam gameplay" }],
    links: [],
  },
  {
    slug: "lift-off",
    category: "Game",
    title: "Lift Off!",
    kicker: "Colour-stacking delivery puzzle",
    description:
      "Drag parcel stacks onto pallets on a rooftop dock; matching neighbours hop on, and ten of a colour float away by balloon.",
    overview:
      "A colour-stacking puzzle on a rooftop delivery dock. Drag a parcel stack onto an empty pallet, and matching neighbours hop onto it, which can set off chain combos.\n\nWhen 10 of one colour stack up, a balloon lifts them off to fill that colour's quota. Fill every quota to win. You lose if the dock fills and you have no tools left. Each level has its own dock shape and adds one thing: taped crates, tarps, a conveyor belt or padlocks.",
    howItWorks: [
      { title: "Place a stack", body: "Drag a parcel stack onto an empty pallet." },
      { title: "Neighbours hop", body: "Matching neighbours jump on, chaining combos." },
      { title: "Lift off", body: "10 of one colour float away by balloon toward its quota." },
      { title: "Fill every quota", body: "Win before the dock fills up." },
    ],
    highlights: ["Chain combos", "Unique dock shape per level", "Taped crates, tarps, conveyor, padlocks", "6 levels"],
    stack: [],
    tags: ["Puzzle", "Colour Sort", "Stacking"],
    status: "Prototype",
    year: "2026",
    stat: { label: "Levels", value: "6" },
    image: liftOffImg,
    gallery: [liftOffImg],
    videos: [{ src: "videos/lift-off.mp4", title: "Lift Off! gameplay" }],
    links: [],
  },
  {
    slug: "sushi-stampede",
    category: "Game",
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
    videos: [{ src: "videos/sushi-stampede.mp4", title: "Sushi Stampede reel, cut in the same session" }],
    links: [],
  },
  {
    slug: "glass-and-light",
    category: "Game",
    title: "Glass & Light",
    kicker: "Stained-glass unscrew puzzle",
    description:
      "Tap rivets out of stained-glass windows; empty panes fall and shatter, letting the sunlight back into the chapel.",
    overview:
      "A stained-glass unscrew puzzle, at the prototype stage. Tap uncovered rivets, and they fly to the lantern of their colour, or to a holder if none matches.\n\nA pane with no rivets left falls and shatters, letting sunlight in. Remove every rivet to win (\"Light restored\"). You lose if all five holders fill up.",
    howItWorks: [
      { title: "Tap a rivet", body: "Only uncovered rivets can be removed." },
      { title: "Sort by colour", body: "Rivets fly to their lantern, or to one of five holders." },
      { title: "Shatter panes", body: "A pane with no rivets falls and lets sunlight in." },
      { title: "Light restored", body: "Clear every rivet before the holders fill." },
    ],
    highlights: ["Shattering glass panes", "Light restoration reveal", "5 overflow holders", "6 levels, Morning Chapel to Great West Window"],
    stack: [],
    tags: ["Puzzle", "Unscrew", "Prototype"],
    status: "Prototype",
    year: "2026",
    stat: { label: "Levels", value: "6" },
    image: glassLightImg,
    gallery: [glassLightImg],
    videos: [{ src: "videos/glass-and-light.mp4", title: "Glass & Light gameplay" }],
    links: [],
  },
  {
    slug: "pack-it-shut",
    category: "Game",
    title: "Pack It Shut!",
    kicker: "Suitcase-packing puzzle",
    description:
      "Items arrive in a fixed order; drag each into the case and leave room for what's coming before the lid slams shut.",
    overview:
      "A suitcase-packing puzzle. Items arrive in a fixed order, and you drag each one into the open case, where a glow shows where it will fit.\n\nEvery level packs exactly, so the trick is leaving room for what's coming. If the next item fits nowhere, the lid slams on the overstuffed case.",
    howItWorks: [
      { title: "See the queue", body: "Items arrive in a fixed, visible order." },
      { title: "Drag to place", body: "A glow previews where each item will fit." },
      { title: "Plan ahead", body: "Every level packs exactly, so leave room for later items." },
      { title: "Shut the case", body: "Pack everything before an item has nowhere to go." },
    ],
    highlights: ["Exact-fit levels", "Placement glow preview", "Cases from 3×3 to 6×5", "Plush 3D illustrated items", "6 trips"],
    stack: [],
    tags: ["Puzzle", "Packing", "Spatial"],
    status: "Prototype",
    year: "2026",
    stat: { label: "Trips", value: "6" },
    image: packItShutImg,
    gallery: [packItShutImg],
    videos: [{ src: "videos/pack-it-shut.mp4", title: "Pack It Shut! gameplay" }],
    links: [],
  },
  {
    slug: "mosslight",
    category: "Game",
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
    category: "Experiment",
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
    videos: [{ src: "videos/ue-crowd.mp4", title: "MetaHuman crowd cinematic, set up via MCP prompts" }],
    links: [{ label: "Read the write-up", url: "https://github.com/KrushnaChaudhary/unreal-mcp-crowd-gotchas" }],
  },
  {
    slug: "driftbrief",
    category: "Tool",
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
    slug: "planetation",
    category: "Game",
    title: "Planetation",
    kicker: "Tiny-planet driving game",
    description:
      "Race a car around the curved surface of a miniature world, weaving through village roads to the checkered flag.",
    overview:
      "Planetation is a driving game set on tiny, fully navigable planets: steer a car around the curved surface of a miniature world, past houses and trees, chasing the checkered flag along winding village roads.\n\nPrototyped at Kwalee with the H5 Game Builder and Level Lab agent skills I built myself. Still in active development.",
    howItWorks: [
      { title: "Prompt", body: "H5 Game Builder produced the first drivable tiny planet." },
      { title: "Courses", body: "Level Lab built the course and level progression." },
      { title: "Drive the curve", body: "The car follows the planet's curved 3D surface." },
      { title: "Iterate", body: "Still in active development." },
    ],
    highlights: ["Tiny-planet driving mechanic", "Curved-surface 3D navigation", "Village-road race courses"],
    stack: ["H5 Game Builder", "Level Lab", "Three.js"],
    tags: ["Racing", "H5 Game Builder", "3D"],
    status: "Prototype",
    year: "2024",
    image: planetation1,
    gallery: [planetation1, planetation2, planetation3],
    links: [],
  },
  {
    slug: "sunset-circuit",
    category: "Game",
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
    slug: "paint-paws",
    category: "Game",
    title: "Paint Paws",
    kicker: "Colour-mixing cat puzzle (demo)",
    description:
      "Tap a toy cat and it runs through paint puddles that change its colour; get every cat to the door of its exact colour.",
    overview:
      "A single-room demo, not a full game yet. Tap a toy cat and it runs straight ahead through paint puddles that change its colour, and colours mix, so a blue cat through yellow comes out green.\n\nGet every cat through the door of its exact colour. Hitting a wall, another cat or the wrong door costs one of 3 hearts. Wet paint climbs up the cats' fur, and they leave coloured paw prints.",
    howItWorks: [
      { title: "Tap a cat", body: "It runs straight ahead until something stops it." },
      { title: "Through the paint", body: "Puddles change its colour, and colours mix." },
      { title: "Find the door", body: "Each cat must exit through its exact colour." },
      { title: "Keep your hearts", body: "Walls, collisions and wrong doors cost one of 3 hearts." },
    ],
    highlights: ["Colour mixing on the move", "Paint climbing the fur", "Coloured paw prints", "Single-room demo"],
    stack: [],
    tags: ["Puzzle", "Colour Mixing", "Demo"],
    status: "Prototype",
    year: "2026",
    image: paintPawsImg,
    gallery: [paintPawsImg],
    videos: [{ src: "videos/paint-paws.mp4", title: "Paint Paws gameplay" }],
    links: [],
  },
  {
    slug: "level-lab",
    category: "Tool",
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
