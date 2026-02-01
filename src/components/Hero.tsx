import { motion } from "framer-motion";
import { ChevronDown, Linkedin, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { projectsList } from "@/data/projectsData";

const Hero = () => {
  // Take top 3 featured projects for the hero
  const featuredProjects = projectsList.slice(0, 3);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent"
          animate={{ y: ["-100vh", "100vh"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container relative z-10 px-6 pt-24 pb-12">
        {/* Top Section - Intro */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              <span className="text-neon-cyan font-display text-sm tracking-wider">
                AVAILABLE FOR WORK
              </span>
            </motion.div>

            <motion.h1
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-foreground">I BUILD</span>
              <br />
              <span className="gradient-text text-glow-cyan">GAMES</span>
              <br />
              <span className="text-foreground">THAT SHIP</span>
            </motion.h1>

            <motion.p
              className="text-muted-foreground text-lg md:text-xl max-w-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-foreground font-semibold">4+ years</span> crafting gameplay systems, 
              LiveOps infrastructure, and tools that help teams ship faster.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-4 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold bg-gradient-to-r from-neon-cyan to-neon-purple text-primary-foreground hover:opacity-90 transition-opacity"
              >
                HIRE ME
                <ArrowRight className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-3">
                <a
                  href="https://linkedin.com/in/krushnachaudhary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-border hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="mailto:krushnachaudhary.kc@gmail.com"
                  className="p-3 rounded-xl border border-border hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div>
                <div className="text-3xl font-display font-bold text-neon-cyan">10Cr+</div>
                <div className="text-sm text-muted-foreground">Downloads</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-neon-purple">6+</div>
                <div className="text-sm text-muted-foreground">Live Games</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-neon-gold">4+</div>
                <div className="text-sm text-muted-foreground">Years Exp</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Featured Project Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <Link to={`/project/${featuredProjects[0]?.slug}`} className="block group">
              <div className="relative rounded-2xl overflow-hidden border border-border hover:border-neon-cyan/50 transition-colors">
                {featuredProjects[0]?.image && (
                  <img
                    src={featuredProjects[0].image}
                    alt={featuredProjects[0].title}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-neon-cyan font-display text-sm tracking-wider">
                    {featuredProjects[0]?.subtitle}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-foreground group-hover:text-neon-cyan transition-colors">
                    {featuredProjects[0]?.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-neon-cyan text-sm">
                    <span>View Project</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 border border-neon-cyan/30 rounded-xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-neon-purple/20 rounded-xl -z-10" />
          </motion.div>
        </div>

        {/* More Projects Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg text-muted-foreground">
              MORE <span className="text-foreground">PROJECTS</span>
            </h3>
            <a
              href="#projects"
              className="text-neon-cyan font-display text-sm flex items-center gap-2 hover:gap-3 transition-all"
            >
              VIEW ALL
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {featuredProjects.slice(1, 3).map((project, index) => (
              <Link
                key={project.slug}
                to={`/project/${project.slug}`}
                className="group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl border border-border bg-card/30 hover:border-neon-cyan/50 transition-colors"
                >
                  {project.image && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <span className="text-neon-cyan font-display text-xs tracking-wider mb-1">
                      {project.subtitle}
                    </span>
                    <h4 className="font-display font-bold text-foreground group-hover:text-neon-cyan transition-colors">
                      {project.title}
                    </h4>
                    <div className="flex gap-2 mt-2">
                      {project.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded bg-border/50 text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <a
            href="#projects"
            className="flex flex-col items-center text-muted-foreground hover:text-neon-cyan transition-colors"
          >
            <span className="text-xs font-display tracking-wider mb-2">SCROLL</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;