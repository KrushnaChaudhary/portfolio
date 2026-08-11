import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, Linkedin, Mail } from "lucide-react";
import { projectsList } from "@/data/projectsData";

const showcaseGames = [...projectsList, ...projectsList];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-pattern">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent"
          animate={{ y: ["-100vh", "100vh"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.p
            className="text-neon-cyan font-display text-sm md:text-base tracking-[0.3em] uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Game Developer
          </motion.p>

          <motion.h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-foreground">KRUSHNA</span>
            <br />
            <span className="gradient-text text-glow-cyan">CHAUDHARY</span>
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            5+ years shipping mobile games: <span className="text-neon-cyan">gameplay programming</span>,{" "}
            <span className="text-neon-purple">AI systems</span>, and{" "}
            <span className="text-neon-gold">designer-friendly architecture</span> across a dozen+ titles.
            Lately I've also been building{" "}
            <span className="text-neon-pink">AI agent skills</span> that turn a one-line prompt into a
            playable HTML5 game, then using them to prototype real games solo.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-6 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <a
              href="https://www.linkedin.com/in/krushna-chaudhary/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-border hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300 hover:box-glow-cyan"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:krushnachaudhary.kc@gmail.com"
              className="p-3 rounded-full border border-border hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300 hover:box-glow-cyan"
            >
              <Mail className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden mb-10"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
            {showcaseGames.map((game, index) => (
              <Link
                key={`${game.slug}-${index}`}
                to={`/project/${game.slug}`}
                className="group relative flex-shrink-0 w-52 sm:w-64 aspect-video rounded-xl overflow-hidden border border-border hover:border-neon-cyan/50 transition-colors duration-300"
              >
                {game.image && (
                  <img
                    src={game.image}
                    alt={game.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                <span className="absolute bottom-2 left-3 right-3 font-display text-xs md:text-sm tracking-wide text-foreground truncate">
                  {game.title}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="text-center">
          <motion.button
            onClick={() => {
              const projectsSection = document.getElementById('projects');
              if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex flex-col items-center text-muted-foreground hover:text-neon-cyan transition-colors cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-sm font-display tracking-wider mb-2">VIEW WORK</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
