import { motion } from "framer-motion";
import CoverFlow from "./CoverFlow";

const STATS = [
  { label: "YRS", value: "5+" },
  { label: "TITLES", value: "12" },
  { label: "STUDIOS", value: "2" },
  { label: "PUBLISHED SKILLS", value: "2" },
];

const MainMenu = () => {
  return (
    <section className="relative flex items-center overflow-hidden py-20 md:py-0 md:min-h-[calc(100vh-3.5rem)]">
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="container px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">
              Game Developer · Bangalore
            </p>

            <h1 className="font-display font-bold text-foreground mb-6 leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
              KRUSHNA
              <br />
              CHAUDHARY
            </h1>

            <p className="text-muted-foreground text-lg max-w-xl mb-8 leading-relaxed">
              5+ years shipping mobile games: gameplay programming, AI systems, and
              designer-friendly architecture across a dozen+ titles. Lately I've also been
              building AI agent skills that turn a one-line prompt into a playable HTML5 game,
              then using them to prototype real games solo.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 max-w-lg">
              {STATS.map((stat) => (
                <div key={stat.label} className="panel px-3 py-3 text-center">
                  <p className="stat-num text-xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-subtle-foreground uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="#library"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display text-sm tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              VIEW LIBRARY ↓
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <CoverFlow />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MainMenu;
