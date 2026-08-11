export interface CareerQuest {
  id: string;
  company: string;
  role: string;
  location: string;
  period: string;
  status: "active" | "complete";
  summary: string;
  objectives: string[];
}

export const careerData: CareerQuest[] = [
  {
    id: "kwalee",
    company: "Kwalee",
    role: "Game Developer",
    location: "Bangalore, India",
    period: "Apr 2024 – Present",
    status: "active",
    summary:
      "Architecting complete game prototypes every 2–3 weeks with full ownership of core gameplay, UI, SFX, and custom designer tools.",
    objectives: [
      "Rapid prototyping cycles (2-3 weeks)",
      "Built automated build distribution pipeline via n8n (30% reduction in overhead)",
      "Led Looper's Hyper-casual to Hybrid-casual transition",
      "Developed core meta-systems for Puzzles & Cats",
    ],
  },
  {
    id: "totality-corp",
    company: "Totality Corp",
    role: "Game Developer",
    location: "Gurugram, India",
    period: "Jan 2021 – Oct 2023",
    status: "complete",
    summary:
      "Created modular Unity templates and frameworks that accelerated studio-wide production cycles.",
    objectives: [
      "Developed Rann Bhumi (5v5 combat) with Photon PUN 2",
      "Built authoritative server logic and state synchronization",
      "Maintained 60 FPS on mid-range devices",
      "Created reusable Unity frameworks",
    ],
  },
  {
    id: "totality-corp-roblox",
    company: "Totality Corp (Roblox)",
    role: "Roblox Game Developer",
    location: "Gurugram, India",
    period: "Oct 2020 – Jan 2021",
    status: "complete",
    summary:
      "Solo-developed a multiplayer Mini Golf title from scratch, managing physics, networking, and UX.",
    objectives: [
      "58K+ unique plays achieved",
      "Full-stack Roblox development",
      "Live player data-driven iteration",
      "Custom physics implementation",
    ],
  },
];
