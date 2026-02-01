import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar, ArrowRight, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

// Experience data with linked project slugs
const experiences = [
  {
    company: "Kwalee",
    role: "Game Developer",
    location: "Bangalore, India",
    period: "Apr 2024 – Present",
    description:
      "Architecting complete game prototypes every 2–3 weeks with full ownership of core gameplay, UI, SFX, and custom designer tools.",
    achievements: [
      "Rapid prototyping cycles (2-3 weeks)",
      "Built automated build distribution pipeline via n8n",
      "Led Looper's Hyper-casual to Hybrid-casual transition",
      "Developed core meta-systems for Puzzles & Cats",
    ],
    color: "neon-cyan",
    projects: [
      {
        slug: "puzzles-and-cats",
        title: "Puzzles & Cats",
        image: "/src/assets/puzzles-cats-collage.png",
      },
      {
        slug: "boarding-rush",
        title: "Boarding Rush",
        image: "/src/assets/boarding-rush-collage.png",
      },
      {
        slug: "grid-filler",
        title: "Grid Filler",
        image: "/src/assets/grid-filler-collage.png",
      },
      {
        slug: "dominoes-logic",
        title: "Dominoes Logic",
        image: "/src/assets/dominoes-collage.png",
      },
      {
        slug: "looper",
        title: "Looper",
        image: "/src/assets/looper-collage.png",
      },
    ],
  },
  {
    company: "Totality Corp",
    role: "Game Developer",
    location: "Gurugram, India",
    period: "Jan 2021 – Oct 2023",
    description:
      "Created modular Unity templates and frameworks that accelerated studio-wide production cycles.",
    achievements: [
      "Developed Rann Bhumi (5v5 combat) with Photon PUN 2",
      "Built authoritative server logic and state synchronization",
      "Maintained 60 FPS on mid-range devices",
      "Created reusable Unity frameworks",
    ],
    color: "neon-purple",
    projects: [
      {
        slug: "rann-bhumi",
        title: "Rann Bhumi",
        image: "/src/assets/rann-bhumi.jpg",
      },
    ],
  },
  {
    company: "Totality Corp (Roblox)",
    role: "Roblox Game Developer",
    location: "Gurugram, India",
    period: "Oct 2020 – Jan 2021",
    description:
      "Solo-developed a multiplayer Mini Golf title from scratch, managing physics, networking, and UX.",
    achievements: [
      "58K+ unique plays achieved",
      "Full-stack Roblox development",
      "Live player data-driven iteration",
      "Custom physics implementation",
    ],
    color: "neon-gold",
    projects: [
      {
        slug: "mini-golf",
        title: "Mini Golf",
        image: "/src/assets/mini-golf.png",
      },
    ],
  },
];

// Import images
import puzzlesCatsCollage from "@/assets/puzzles-cats-collage.png";
import boardingRushCollage from "@/assets/boarding-rush-collage.png";
import gridFillerCollage from "@/assets/grid-filler-collage.png";
import dominoesCollage from "@/assets/dominoes-collage.png";
import looperCollage from "@/assets/looper-collage.png";
import rannBhumiImg from "@/assets/rann-bhumi.jpg";
import miniGolfImg from "@/assets/mini-golf.png";

const projectImages: Record<string, string> = {
  "puzzles-and-cats": puzzlesCatsCollage,
  "boarding-rush": boardingRushCollage,
  "grid-filler": gridFillerCollage,
  "dominoes-logic": dominoesCollage,
  "looper": looperCollage,
  "rann-bhumi": rannBhumiImg,
  "mini-golf": miniGolfImg,
};

const CareerJourney = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">CAREER</span>{" "}
            <span className="text-neon-purple text-glow-purple">JOURNEY</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            4+ years of professional game development with shipped titles
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Timeline line - visible on larger screens */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-gold transform -translate-x-1/2" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company + exp.period}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="mb-16 lg:mb-24"
            >
              {/* Desktop Layout */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 items-start">
                {/* Experience Card - alternating sides */}
                <div className={index % 2 === 0 ? "lg:pr-12" : "lg:order-2 lg:pl-12"}>
                  {/* Timeline dot */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-background border-2 ${
                    exp.color === "neon-cyan" ? "border-neon-cyan" :
                    exp.color === "neon-purple" ? "border-neon-purple" : "border-neon-gold"
                  } flex items-center justify-center z-10`}>
                    <div className={`w-3 h-3 rounded-full ${
                      exp.color === "neon-cyan" ? "bg-neon-cyan" :
                      exp.color === "neon-purple" ? "bg-neon-purple" : "bg-neon-gold"
                    } animate-pulse-glow`} />
                  </div>

                  <motion.div
                    className={`p-6 rounded-2xl border border-border bg-card/50 hover:border-${exp.color}/50 transition-all duration-300 ${
                      index % 2 === 0 ? "text-right" : "text-left"
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? "justify-end" : ""}`}>
                      <Briefcase className={`w-4 h-4 ${
                        exp.color === "neon-cyan" ? "text-neon-cyan" :
                        exp.color === "neon-purple" ? "text-neon-purple" : "text-neon-gold"
                      }`} />
                      <span className={`font-display text-sm tracking-wider ${
                        exp.color === "neon-cyan" ? "text-neon-cyan" :
                        exp.color === "neon-purple" ? "text-neon-purple" : "text-neon-gold"
                      }`}>
                        {exp.role}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                      {exp.company}
                    </h3>

                    <div className={`flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 ${index % 2 === 0 ? "justify-end" : ""}`}>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4">
                      {exp.description}
                    </p>

                    <ul className={`space-y-2 ${index % 2 === 0 ? "text-right" : ""}`}>
                      {exp.achievements.slice(0, 3).map((achievement) => (
                        <li
                          key={achievement}
                          className={`flex items-center gap-2 text-sm text-foreground/80 ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            exp.color === "neon-cyan" ? "bg-neon-cyan" :
                            exp.color === "neon-purple" ? "bg-neon-purple" : "bg-neon-gold"
                          }`} />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Projects - opposite side */}
                <div className={index % 2 === 0 ? "lg:pl-12" : "lg:order-1 lg:pr-12"}>
                  <div className={`${index % 2 === 0 ? "" : "text-right"}`}>
                    <p className={`text-sm text-muted-foreground mb-4 font-display tracking-wider ${
                      index % 2 === 0 ? "" : "text-right"
                    }`}>
                      SHIPPED PROJECTS
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {exp.projects.map((project, pIndex) => (
                        <motion.div
                          key={project.slug}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + pIndex * 0.1 }}
                        >
                          <Link
                            to={`/project/${project.slug}`}
                            className="group block"
                          >
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border hover:border-neon-cyan/50 transition-all duration-300">
                              <img
                                src={projectImages[project.slug]}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="font-display text-sm text-foreground group-hover:text-neon-cyan transition-colors truncate">
                                  {project.title}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-neon-cyan/70 transition-colors">
                                  <span>View</span>
                                  <ArrowRight className="w-3 h-3" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden">
                <div className="relative pl-8">
                  {/* Timeline line for mobile */}
                  {index < experiences.length - 1 && (
                    <div className="absolute left-3 top-8 bottom-0 w-px bg-gradient-to-b from-border to-transparent" />
                  )}

                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-background border-2 ${
                    exp.color === "neon-cyan" ? "border-neon-cyan" :
                    exp.color === "neon-purple" ? "border-neon-purple" : "border-neon-gold"
                  } flex items-center justify-center`}>
                    <div className={`w-2 h-2 rounded-full ${
                      exp.color === "neon-cyan" ? "bg-neon-cyan" :
                      exp.color === "neon-purple" ? "bg-neon-purple" : "bg-neon-gold"
                    }`} />
                  </div>

                  {/* Experience Card */}
                  <div className="p-5 rounded-xl border border-border bg-card/50 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className={`w-4 h-4 ${
                        exp.color === "neon-cyan" ? "text-neon-cyan" :
                        exp.color === "neon-purple" ? "text-neon-purple" : "text-neon-gold"
                      }`} />
                      <span className={`font-display text-xs tracking-wider ${
                        exp.color === "neon-cyan" ? "text-neon-cyan" :
                        exp.color === "neon-purple" ? "text-neon-purple" : "text-neon-gold"
                      }`}>
                        {exp.role}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {exp.company}
                    </h3>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm">
                      {exp.description}
                    </p>
                  </div>

                  {/* Projects Grid */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-3 font-display tracking-wider">
                      SHIPPED PROJECTS
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {exp.projects.map((project) => (
                        <Link
                          key={project.slug}
                          to={`/project/${project.slug}`}
                          className="group block"
                        >
                          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border">
                            <img
                              src={projectImages[project.slug]}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-2">
                              <p className="font-display text-xs text-foreground truncate">
                                {project.title}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerJourney;
