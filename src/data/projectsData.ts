import rannBhumiImg from "@/assets/rann-bhumi.jpg";
import miniGolfImg from "@/assets/mini-golf.png";
import looperCollage from "@/assets/looper-collage.png";
import dominoesCollage from "@/assets/dominoes-collage.png";
import gridFillerCollage from "@/assets/grid-filler-collage.png";
import puzzlesCatsCollage from "@/assets/puzzles-cats-collage.png";
import boardingRushCollage from "@/assets/boarding-rush-collage.png";
import looperStore1 from "@/assets/looper-store-1.png";
import looperStore2 from "@/assets/looper-store-2.png";
import looperStore3 from "@/assets/looper-store-3.png";
import dominoesStore1 from "@/assets/dominoes-store-1.png";
import dominoesStore2 from "@/assets/dominoes-store-2.png";
import dominoesStore3 from "@/assets/dominoes-store-3.png";
import gridFiller1 from "@/assets/grid-filler-1.webp";
import gridFiller2 from "@/assets/grid-filler-2.webp";
import gridFiller3 from "@/assets/grid-filler-3.webp";
import gridFiller4 from "@/assets/grid-filler-4.webp";
import puzzlesCats1 from "@/assets/puzzles-cats-1.png";
import puzzlesCats2 from "@/assets/puzzles-cats-2.png";
import puzzlesCats3 from "@/assets/puzzles-cats-3.png";
import puzzlesCats4 from "@/assets/puzzles-cats-4.png";
import puzzlesCats5 from "@/assets/puzzles-cats-5.png";
import puzzlesCats6 from "@/assets/puzzles-cats-6.png";
import puzzlesCats7 from "@/assets/puzzles-cats-7.png";
import puzzlesCats8 from "@/assets/puzzles-cats-8.png";
import puzzlesCats9 from "@/assets/puzzles-cats-9.png";
import boardingRush1 from "@/assets/boarding-rush-1.webp";
import boardingRush2 from "@/assets/boarding-rush-2.webp";
import boardingRush3 from "@/assets/boarding-rush-3.webp";
import boardingRush4 from "@/assets/boarding-rush-4.webp";
// Video imports removed - not needed currently

export interface ProjectData {
  title: string;
  subtitle: string;
  description: string;
  image: string | null;
  tags: string[];
  highlights: string[];
  myRole: string[];
  fullDescription: string;
  youtubeId?: string;
  storeLinks?: { platform: string; url: string }[];
  gallery?: string[];
}

export const projectsData: Record<string, ProjectData> = {
  "rann-bhumi": {
    title: "Rann Bhumi",
    subtitle: "5v5 Combat Title • Totality Corp",
    description:
      "A mythological 5v5 combat game inspired by Kurukshetra. Built class-based combat systems and multiplayer networking.",
    image: rannBhumiImg,
    tags: ["Unity", "Photon PUN 2", "Combat", "Multiplayer"],
    highlights: [
      "5v5 multiplayer combat",
      "Mythological theme & weapons",
      "Class-based fighting styles",
      "Killstreak reward systems",
      "60 FPS mobile performance",
    ],
    myRole: [
      "Developed class-based weapons for 5 unique character classes",
      "Built killstreak system inspired by Call of Duty using Indian godly weapons",
      "Implemented Photon PUN 2 networking with authoritative server logic",
      "Handled state synchronization for real-time multiplayer",
      "Optimized gameplay to maintain 60 FPS on mid-range devices",
      "Integrated all sound effects and audio systems",
      "Playtested and balanced character, weapon, and killstreak stats",
    ],
    fullDescription: `Rann Bhumi is a mythological combat game inspired by the epic war of Kurukshetra. Players engage in 5v5 battles using class-based characters, each with unique fighting styles rooted in Indian mythology.

The game features a killstreak system similar to Call of Duty, but themed around classical Indian godly weapons like the Brahmastra and Sudarshana Chakra. Each class offers distinct combat mechanics that require different playstyles and strategies.`,
    youtubeId: "6MYYo47iuLM",
    gallery: [],
  },
  "grid-filler": {
    title: "Grid Filler: Shikaku Tiles",
    subtitle: "Logic Puzzle Game • Kwalee",
    description:
      "A satisfying logic puzzle where players fill grids with perfect rectangles. Built core gameplay, level tools, and meta-systems.",
    image: gridFillerCollage,
    tags: ["Unity", "Puzzle", "Mobile", "Level Tools"],
    highlights: [
      "1000+ handcrafted levels",
      "Daily puzzle challenges",
      "Competitive leaderboards",
      "Clean, satisfying UX",
    ],
    myRole: [
      "Owned core gameplay logic and grid-filling mechanics",
      "Built level editor tools for the design team",
      "Developed meta-systems for progression and rewards",
      "Optimized grid performance and visual feedback",
      "Implemented spin-the-wheel reward system",
    ],
    fullDescription: `Grid Filler is a clean logic puzzle where players divide grids into perfect rectangles, ensuring each section matches its number exactly. Simple rules, but every decision matters—one misplaced tile can block the entire board.

Features 1000+ levels, daily puzzles, competitive leaderboards, and a satisfying reward system. The game focuses on training your brain through meaningful logic rather than random guessing.`,
    storeLinks: [
      { platform: "App Store", url: "https://apps.apple.com/vn/app/grid-filler-shikaku-tiles/id6756872108" },
    ],
    gallery: [gridFiller1, gridFiller2, gridFiller3, gridFiller4],
  },
  "puzzles-and-cats": {
    title: "Puzzles & Cats",
    subtitle: "LiveOps Mobile Game • Kwalee",
    description:
      "A match-3 puzzle game with cat collection mechanics. Built core meta-systems and LiveOps infrastructure.",
    image: puzzlesCatsCollage,
    tags: ["Unity", "LiveOps", "Meta-Systems", "Mobile"],
    highlights: [
      "Cat collection & upgrades",
      "Match-3 puzzle gameplay",
      "LiveOps content updates",
      "Economy & shop systems",
    ],
    myRole: [
      "Developed core meta-systems: Shop, Economy, and Progression",
      "Built procedural logic for content generation",
      "Created LiveOps pipelines using remote-configurable data",
      "Enabled safe, no-build updates for live game changes",
      "Reduced deployment risk and accelerated feature iteration",
    ],
    fullDescription: `Puzzles & Cats combines match-3 puzzle gameplay with a cat collection meta-game. Players solve puzzles to unlock and upgrade adorable cat characters, each with unique abilities and personalities.

The game features robust LiveOps infrastructure allowing the team to push content updates, balance changes, and new events without requiring app store updates.`,
    youtubeId: "gnA_2x3F1SU",
    gallery: [puzzlesCats1, puzzlesCats2, puzzlesCats4, puzzlesCats5, puzzlesCats6, puzzlesCats8, puzzlesCats9],
  },
  "boarding-rush": {
    title: "Boarding Rush",
    subtitle: "Live Puzzle Game • Kwalee",
    description:
      "A satisfying tap puzzle where players sort passengers onto boats. Built dynamic grids, level tools, and full UI/UX.",
    image: boardingRushCollage,
    tags: ["Unity", "Puzzle", "Level Editor", "Analytics"],
    highlights: [
      "Hex-grid puzzle mechanics",
      "Color-matching gameplay",
      "Dynamic level generation",
      "Relaxing beach theme",
    ],
    myRole: [
      "Developed dynamic grid generation system for varied puzzle layouts",
      "Built custom Level Editor tools for the design team",
      "Implemented FTUE (First Time User Experience) flow",
      "Owned full UI/UX design and implementation",
      "Integrated comprehensive analytics for player behavior tracking",
      "Maintained and updated the live title",
    ],
    fullDescription: `Boarding Rush is a satisfying tap puzzle where players sort colorful passengers onto matching boats at a busy dock. Each level brings new grid configurations, faster pace, and smart challenges.

The game features a relaxing beach theme with smooth animations and cheerful visuals. Players must plan routes and time their moves to keep the queue flowing before the dock overflows.`,
    storeLinks: [
      { platform: "Google Play", url: "https://play.google.com/store/apps/details?id=com.kwalee.boardingrush" },
    ],
    gallery: [boardingRush1, boardingRush2, boardingRush3, boardingRush4],
  },
  "dominoes-logic": {
    title: "Dominoes Logic",
    subtitle: "Live Puzzle Game • Kwalee",
    description:
      "A number puzzle built around domino placement. Built dynamic grids, level tools, and full UI/UX.",
    image: dominoesCollage,
    tags: ["Unity", "Puzzle", "Level Editor", "Analytics"],
    highlights: [
      "Number-matching puzzles",
      "Domino tile mechanics",
      "Dynamic level generation",
      "Clean, minimal design",
    ],
    myRole: [
      "Developed dynamic grid generation system for puzzle layouts",
      "Built custom Level Editor tools for the design team",
      "Implemented FTUE (First Time User Experience) flow",
      "Owned full UI/UX design and implementation",
      "Integrated comprehensive analytics for player behavior tracking",
      "Maintained and updated the live title",
    ],
    fullDescription: `Dominoes Logic is a clean number puzzle where players place domino tiles to match numbers and clear the board. Every move matters—think ahead to find smooth, elegant solutions.

Each level challenges you to read the grid, plan your moves, and fit the right tiles together. The game features a minimal design focused on satisfying puzzle-solving.`,
    storeLinks: [
      { platform: "Google Play", url: "https://play.google.com/store/apps/details?id=com.kwalee.dominodrop" },
    ],
    gallery: [dominoesStore1, dominoesStore2, dominoesStore3],
  },
  "looper": {
    title: "Looper",
    subtitle: "Hybrid-Casual Overhaul • Kwalee",
    description:
      "A musical puzzle game with 10Cr+ downloads. Led the transition from Hyper-casual to Hybrid-casual.",
    image: looperCollage,
    tags: ["Unity", "Hybrid-Casual", "Retention", "Economy"],
    highlights: [
      "10Cr+ downloads",
      "Musical rhythm gameplay",
      "Timing-based puzzles",
      "Hybrid-casual meta",
    ],
    myRole: [
      "Led strategic transition from Hyper-casual to Hybrid-casual model",
      "Implemented retention features to increase player engagement",
      "Created designer-facing economy structures",
      "Built meta-progression systems to drive LTV",
      "Balanced casual accessibility with meaningful depth",
    ],
    fullDescription: `Looper is a musical puzzle game where every tap sets a vibrant beat in motion. Players navigate through intricate constellations, timing their moves precisely to create harmonious loops.

With 10Cr+ downloads, the game successfully transitioned from Hyper-casual to Hybrid-casual, adding meta-progression and engagement loops while maintaining its accessible, pick-up-and-play appeal.`,
    storeLinks: [
      { platform: "Google Play", url: "https://play.google.com/store/apps/details?id=com.kwalee.looper" },
    ],
    gallery: [looperStore1, looperStore2, looperStore3],
  },
  "mini-golf": {
    title: "Mini Golf",
    subtitle: "Multiplayer Roblox Game • Totality Corp",
    description:
      "A multiplayer Mini Golf title reaching 58K+ unique plays. Solo-developed all systems from scratch.",
    image: miniGolfImg,
    tags: ["Roblox", "Lua", "Multiplayer", "Physics"],
    highlights: [
      "58K+ unique plays",
      "5 unique course designs",
      "Multiplayer competition",
      "Stylized visuals",
    ],
    myRole: [
      "Solo-developed the entire game from scratch",
      "Built custom physics system for ball movement",
      "Implemented multiplayer networking and lobbies",
      "Designed and built 5 unique course levels",
      "Created all UI and audio integration",
      "Iterated on UX based on live player data",
      "Revamped aesthetics with stylized props and environments",
    ],
    fullDescription: `Mini Golf is a multiplayer Roblox game where players compete across 5 unique course designs. The game features custom physics, stylized visuals, and competitive multiplayer.

Achieved 58K+ unique plays through continuous iteration based on live player feedback, improving UX and course designs over time.`,
    gallery: [],
  },
};

// Project list for the main projects page (order matters)
export const projectsList = [
  {
    slug: "rann-bhumi",
    ...projectsData["rann-bhumi"],
  },
  {
    slug: "puzzles-and-cats",
    ...projectsData["puzzles-and-cats"],
  },
  {
    slug: "boarding-rush",
    ...projectsData["boarding-rush"],
  },
  {
    slug: "grid-filler",
    ...projectsData["grid-filler"],
  },
  {
    slug: "dominoes-logic",
    ...projectsData["dominoes-logic"],
  },
  {
    slug: "looper",
    ...projectsData["looper"],
  },
  {
    slug: "mini-golf",
    ...projectsData["mini-golf"],
  },
];
