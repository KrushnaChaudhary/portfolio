import rannBhumiImg from "@/assets/rann-bhumi.jpg";
import miniGolfImg from "@/assets/mini-golf.png";
import looperCollage from "@/assets/looper-collage.png";
import dominoesCollage from "@/assets/dominoes-collage.png";
import gridFillerCollage from "@/assets/grid-filler-collage.png";
import puzzlesCatsCollage from "@/assets/puzzles-cats-collage.png";
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

export interface ProjectData {
  title: string;
  subtitle: string;
  description: string;
  image: string | null;
  tags: string[];
  highlights: string[];
  fullDescription: string;
  youtubeId?: string;
  storeLinks?: { platform: string; url: string }[];
  gallery?: string[];
}

export const projectsData: Record<string, ProjectData> = {
  "rann-bhumi": {
    title: "Rann Bhumi",
    subtitle: "5v5 Combat Title",
    description:
      "A mythological combat game inspired by Kurukshetra. Developed class-based weapons, killstreak systems based on classical Indian godly weapons, and Photon PUN 2 networking with authoritative server logic.",
    image: rannBhumiImg,
    tags: ["Unity", "Photon PUN 2", "Combat", "Multiplayer", "NFT"],
    highlights: [
      "5 unique character classes with different fighting styles",
      "Killstreak system inspired by Call of Duty",
      "NFT integration for in-game assets",
      "60 FPS on mid-range devices",
      "Authoritative server logic",
      "Sound integration across the game",
    ],
    fullDescription: `Developed gameplay mechanics inspired by the mythological war of Kurukshetra. Created unique mechanics for five character classes to different fighting styles while sticking closely to the theme.

Built a killstreak system based on classical Indian godly weapons, similar to Call Of Duty. Collaborated with the design team to accommodate NFTs within Rannbhumi.

Integrated all the sounds in the game. Playtested and balanced the game by tweaking character, weapon and killstreak stats, and attack behaviours.

Technical highlights include authoritative server logic with Photon PUN 2, state synchronization, and optimization to maintain 60 FPS on mid-range devices.`,
    youtubeId: "6MYYo47iuLM",
    gallery: [],
  },
  "grid-filler": {
    title: "Grid Filler: Shikaku Tiles",
    subtitle: "Logic Puzzle Game",
    description:
      "A clean and satisfying logic puzzle built around filling grids with perfect rectangles using pure reasoning.",
    image: gridFillerCollage,
    tags: ["Unity", "Puzzle", "Mobile", "LiveOps"],
    highlights: [
      "1000+ challenging levels",
      "Daily puzzles with unique grids",
      "Competitive leaderboards",
      "Train your brain mechanics",
      "Clean, satisfying UX",
      "Cross-platform support",
    ],
    fullDescription: `Grid Filler: Shikaku Tiles is a clean and satisfying logic puzzle built around filling grids with perfect rectangles using pure reasoning.

Divide each grid into squares and tiles, making sure every section matches its number exactly. The rules are simple, but every decision matters. One misplaced tile can block the whole board, while a smart move reveals a smooth, elegant solution.

Features include 1000+ levels, daily puzzles, competitive leaderboards, and a spin-the-wheel reward system. The game focuses on training your brain through meaningful logic rather than random guessing.`,
    storeLinks: [
      { platform: "App Store", url: "https://apps.apple.com/vn/app/grid-filler-shikaku-tiles/id6756872108" },
    ],
    gallery: [gridFiller1, gridFiller2, gridFiller3, gridFiller4],
  },
  "puzzles-and-cats": {
    title: "Puzzles & Cats",
    subtitle: "LiveOps Mobile Game",
    description:
      "Developed core meta-systems including Shop, Economy, and Procedural Logic. Built LiveOps pipelines using remote-configurable data for safe, no-build updates.",
    image: puzzlesCatsCollage,
    tags: ["Unity", "LiveOps", "Meta-Systems", "Mobile"],
    highlights: [
      "Remote-configurable updates",
      "Economy system design",
      "Procedural content generation",
      "Shop integration",
      "LiveOps pipeline development",
      "No-build deployment capability",
    ],
    fullDescription: `Developed core meta-systems for this LiveOps mobile game, focusing on Shop, Economy, and Procedural Logic systems.

Built robust LiveOps pipelines using remote-configurable data, enabling safe updates without requiring new app builds. This approach significantly reduced deployment risk and accelerated feature iteration.`,
    youtubeId: "gnA_2x3F1SU",
    gallery: [puzzlesCats1, puzzlesCats2, puzzlesCats3, puzzlesCats4, puzzlesCats5, puzzlesCats6],
  },
  "dominoes-logic": {
    title: "Dominoes Logic",
    subtitle: "Live Puzzle Game",
    description:
      "Developed dynamic grid generation, FTUE, and Level Editors. Owned full UI/UX and Analytics integration for the live title.",
    image: dominoesCollage,
    tags: ["Unity", "Puzzle", "Level Editor", "Analytics"],
    highlights: [
      "Dynamic grid generation system",
      "Custom level editor tools",
      "FTUE (First Time User Experience)",
      "Full analytics suite integration",
      "Complete UI/UX ownership",
      "Live title maintenance",
    ],
    fullDescription: `Every move matters. Place tiles carefully, align numbers, and watch the board come together, one smart decision at a time.

Dominoes Logic is a clean number puzzle built around thoughtful domino placement and satisfying pattern completion. Each level challenges you to read the grid, think ahead, and fit the right tiles together to clear the board smoothly.

Developed dynamic grid generation systems and created comprehensive Level Editors for the design team. Implemented the First Time User Experience (FTUE) flow to onboard new players effectively.

Owned the full UI/UX design and implementation, along with deep Analytics integration to track player behavior and game performance metrics.`,
    storeLinks: [
      { platform: "Google Play", url: "https://play.google.com/store/apps/details?id=com.kwalee.dominodrop" },
    ],
    gallery: [dominoesStore1, dominoesStore2, dominoesStore3],
  },
  "looper": {
    title: "Looper",
    subtitle: "Hybrid-Casual Overhaul",
    description:
      "Led the transition from Hyper-casual to Hybrid-casual, implementing retention features and designer-facing economy structures to drive LTV.",
    image: looperCollage,
    tags: ["Unity", "Hybrid-Casual", "Retention", "Economy"],
    highlights: [
      "10Cr+ downloads achieved",
      "Hyper to Hybrid-casual transition",
      "Retention feature implementation",
      "Economy system architecture",
      "LTV optimization strategies",
      "Designer-facing tools",
    ],
    fullDescription: `Dive into Looper, the musical puzzle game that tests your timing and sense of harmony. Every tap sets a vibrant beat in motion, weaving through intricate constellations. Precision is crucial—mistimed taps could lead to a crash, but nail it, and bask in the gratifying loop of harmonious success.

This isn't just a rhythm game; it's a musical journey that resonates with the soul. Looper offers an array of meticulously crafted levels to satisfy your puzzle-solving cravings. Each level unfolds a new musical track, keeping the experience fresh and engaging.

Led the strategic transition of Looper from a Hyper-casual to Hybrid-casual game model. This involved implementing retention features and creating designer-facing economy structures to drive long-term value (LTV).

The transition required careful balance of maintaining casual accessibility while adding depth through meta-progression and engagement loops.`,
    storeLinks: [
      { platform: "Google Play", url: "https://play.google.com/store/apps/details?id=com.kwalee.looper" },
    ],
    gallery: [looperStore1, looperStore2, looperStore3],
  },
  "mini-golf": {
    title: "Mini Golf",
    subtitle: "Multiplayer Roblox Game",
    description:
      "Solo-developed a multiplayer Mini Golf title reaching 58K+ unique plays. Managed physics, networking, and UX iteration based on live player data.",
    image: miniGolfImg,
    tags: ["Roblox", "Lua", "Multiplayer", "Physics"],
    highlights: [
      "58K+ unique plays achieved",
      "5 unique levels designed",
      "Custom physics implementation",
      "Live player data-driven iteration",
      "Full UI and audio integration",
      "Stylized environment design",
    ],
    fullDescription: `Developed the game and implemented UI and audio effects. Designed and implemented 5 unique levels and the lobby for the game.

Revamped the aesthetics of the game through stylized props, environment setting, and colour scheme.

Solo-developed this multiplayer Mini Golf title from scratch, managing physics, networking, and UX. Achieved 58K+ unique plays through continuous iteration based on live player data.`,
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
