import { motion } from "framer-motion";
import { ExternalLink, Gamepad2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import rannBhumiImg from "@/assets/rann-bhumi.jpg";
import miniGolfImg from "@/assets/mini-golf.png";

const projects = [
  {
    slug: "rann-bhumi",
    title: "Rann Bhumi",
    subtitle: "5v5 Combat Title",
    description:
      "A mythological combat game inspired by Kurukshetra. Developed class-based weapons, killstreak systems based on classical Indian godly weapons, and Photon PUN 2 networking with authoritative server logic.",
    image: rannBhumiImg,
    tags: ["Unity", "Photon PUN 2", "Combat", "Multiplayer"],
    highlights: [
      "5 unique character classes",
      "Killstreak system (CoD-inspired)",
      "NFT integration",
      "60 FPS on mid-range devices",
    ],
  },
  {
    slug: "mini-golf",
    title: "Mini Golf",
    subtitle: "Multiplayer Roblox Game",
    description:
      "Solo-developed a multiplayer Mini Golf title reaching 58K+ unique plays. Managed physics, networking, and UX iteration based on live player data.",
    image: miniGolfImg,
    tags: ["Roblox", "Lua", "Multiplayer", "Physics"],
    highlights: [
      "58K+ unique plays",
      "5 unique levels",
      "Custom physics system",
      "Live data-driven iteration",
    ],
  },
  {
    slug: "puzzles-and-cats",
    title: "Puzzles & Cats",
    subtitle: "LiveOps Mobile Game",
    description:
      "Developed core meta-systems including Shop, Economy, and Procedural Logic. Built LiveOps pipelines using remote-configurable data for safe, no-build updates.",
    image: null,
    tags: ["Unity", "LiveOps", "Meta-Systems", "Mobile"],
    highlights: [
      "Remote-configurable updates",
      "Economy system",
      "Procedural content",
      "Shop integration",
    ],
  },
  {
    slug: "dominoes-logic",
    title: "Dominoes Logic",
    subtitle: "Live Puzzle Game",
    description:
      "Developed dynamic grid generation, FTUE, and Level Editors. Owned full UI/UX and Analytics integration for the live title.",
    image: null,
    tags: ["Unity", "Puzzle", "Level Editor", "Analytics"],
    highlights: [
      "Dynamic grid generation",
      "Custom level editor",
      "FTUE system",
      "Full analytics suite",
    ],
  },
  {
    slug: "looper",
    title: "Looper",
    subtitle: "Hybrid-Casual Overhaul",
    description:
      "Led the transition from Hyper-casual to Hybrid-casual, implementing retention features and designer-facing economy structures to drive LTV.",
    image: null,
    tags: ["Unity", "Hybrid-Casual", "Retention", "Economy"],
    highlights: [
      "Hyper → Hybrid transition",
      "Retention features",
      "Economy systems",
      "LTV optimization",
    ],
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-24 relative">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">FEATURED</span>{" "}
            <span className="text-neon-purple text-glow-purple">PROJECTS</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Games and systems I've built across my career
          </p>
        </motion.div>

        <div className="space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/project/${project.slug}`}>
                <div className="relative rounded-2xl border border-border bg-card/50 overflow-hidden hover:border-neon-cyan/50 transition-all duration-500 cursor-pointer">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Image */}
                    <div className="relative aspect-video md:aspect-auto overflow-hidden">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-muted to-card flex items-center justify-center">
                          <Gamepad2 className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-neon-cyan font-display text-sm tracking-wider">
                          {project.subtitle}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-neon-cyan transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <ul className="grid grid-cols-2 gap-2 mb-6">
                        {project.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                            {highlight}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-2 text-neon-cyan font-display text-sm tracking-wider group-hover:gap-4 transition-all">
                        <span>VIEW PROJECT</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
