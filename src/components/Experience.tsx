import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar } from "lucide-react";

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
      "Built automated build distribution pipeline via n8n (30% reduction in overhead)",
      "Led Looper's Hyper-casual to Hybrid-casual transition",
      "Developed core meta-systems for Puzzles & Cats",
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
  },
];

const Experience = () => {
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
            <span className="text-foreground">WORK</span>{" "}
            <span className="text-neon-gold">EXPERIENCE</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            4+ years of professional game development
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-gold transform md:-translate-x-1/2" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company + exp.period}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative mb-12 md:mb-16 ${
                index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:ml-auto"
              } md:w-1/2 pl-8 md:pl-0`}
            >
              {/* Timeline dot */}
              <div
                className={`absolute ${
                  index % 2 === 0 ? "left-0 md:-right-3" : "left-0 md:-left-3"
                } top-0 w-6 h-6 rounded-full bg-background border-2 border-neon-cyan flex items-center justify-center`}
              >
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-glow" />
              </div>

              <div className="p-6 rounded-xl border border-border bg-card/50 hover:border-neon-cyan/50 transition-all duration-300">
                <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                  <Briefcase className="w-4 h-4 text-neon-cyan" />
                  <span className="text-neon-cyan font-display text-sm tracking-wider">
                    {exp.role}
                  </span>
                </div>
                
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {exp.company}
                </h3>
                
                <div className={`flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
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
                
                <ul className={`space-y-2 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                  {exp.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className={`flex items-center gap-2 text-sm text-foreground/80 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-purple flex-shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
