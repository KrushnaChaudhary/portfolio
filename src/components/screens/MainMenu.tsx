import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown, Bot, Gamepad2, Linkedin, Mail, Sparkles } from "lucide-react";
import { projectsList } from "@/data/projectsData";
import { aiProjects } from "@/data/aiProjectsData";
import { Aurora, Float, Magnetic, RevealWords, Tilt, useExitParallax } from "@/components/fx/Motion";

const STATS = [
  { label: "Game titles", value: String(projectsList.length) },
  { label: "AI projects", value: String(aiProjects.length) },
  { label: "Studios", value: "2" },
  { label: "Years shipping", value: "5+" },
];

const STACK = ["Unity", "C#", "Unreal 5", "Three.js", "Phaser", "MCP", "Claude Code", "Codex", "Cursor", "Photon", "Roblox", "Multi-Agent"];

const featuredGame = projectsList[0];
const featuredAi = aiProjects.find((p) => p.image) ?? aiProjects[0];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const TrackCard = ({
  to,
  external,
  image,
  label,
  title,
  icon: Icon,
  accent,
}: {
  to: string;
  external?: boolean;
  image?: string | null;
  label: string;
  title: string;
  icon: typeof Bot;
  accent: string;
}) => {
  const inner = (
    <div className="relative h-full rounded-2xl overflow-hidden border border-border-strong shadow-e3 bg-surface-2 group">
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="absolute left-4 right-4 bottom-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-display tracking-[0.2em] uppercase mb-2 backdrop-blur ${accent}`}
        >
          <Icon className="w-3 h-3" />
          {label}
        </span>
        <p className="font-display font-semibold text-foreground text-lg leading-tight">{title}</p>
      </div>
    </div>
  );
  return external ? (
    <a href={to} target="_blank" rel="noopener noreferrer" className="block h-full">
      {inner}
    </a>
  ) : (
    <Link to={to} className="block h-full">
      {inner}
    </Link>
  );
};

const MainMenu = () => {
  const { ref, y, opacity } = useExitParallax();

  return (
    <section
      ref={ref}
      className="relative flex flex-col justify-center overflow-hidden pt-20 pb-10 md:pt-0 md:pb-0 md:min-h-[calc(100vh-3.5rem)]"
    >
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <Aurora />

      <motion.div style={{ y, opacity }} className="container px-6 relative z-10 md:my-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.div
              {...fadeUp(0)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface-1/60 backdrop-blur mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-xs text-muted-foreground">
                Krushna Chaudhary · Gameplay Programmer @ Kwalee · Bangalore
              </span>
            </motion.div>

            <h1
              className="font-display font-bold text-foreground mb-6 leading-[1.04] tracking-tight"
              style={{ fontSize: "clamp(2.4rem, 6.2vw, 4.75rem)" }}
            >
              <RevealWords
                delay={0.1}
                lines={[
                  ["I", "build", <span className="text-shimmer-blue">games</span>],
                  ["and", "the", <span className="text-shimmer-amber">AI agents</span>],
                  ["that", "build", "them."],
                ]}
              />
            </h1>

            <motion.p {...fadeUp(0.75)} className="text-muted-foreground text-lg max-w-xl mb-8 leading-relaxed">
              5+ years shipping mobile games in Unity, from hybrid-casual puzzlers to 5v5 multiplayer combat.
              Now I design multi-agent workflows, MCP tools and agent skills that take a game from one prompt to
              a playable build.
            </motion.p>

            <motion.div {...fadeUp(0.9)} className="flex flex-wrap gap-3 mb-10">
              <Magnetic>
                <a
                  href="#work"
                  className="relative inline-flex items-center gap-2 px-5 py-3 rounded-xl font-display text-sm tracking-wider bg-primary text-primary-foreground overflow-hidden btn-sheen"
                >
                  <Gamepad2 className="w-4 h-4" /> SEE THE WORK
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="mailto:krushnachaudhary.kc@gmail.com"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-display text-sm tracking-wider border border-border-strong bg-surface-1/50 backdrop-blur text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" /> HIRE ME
                </a>
              </Magnetic>
              <Magnetic strength={0.4}>
                <a
                  href="https://www.linkedin.com/in/krushna-chaudhary/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex items-center px-3 py-3 rounded-xl border border-border-strong bg-surface-1/50 backdrop-blur text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </Magnetic>
            </motion.div>

            <motion.div
              {...fadeUp(1.05)}
              className="grid grid-cols-2 sm:grid-cols-4 gap-px max-w-xl rounded-xl overflow-hidden border border-border bg-border"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-surface-1/80 backdrop-blur px-4 py-3">
                  <p className="stat-num text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-subtle-foreground uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative grid grid-cols-2 gap-4 max-w-md mx-auto">
              <Float amp={7} duration={7}>
                <Tilt className="aspect-[3/4] lg:-rotate-2">
                  <TrackCard
                    to={`/project/${featuredGame.slug}`}
                    image={featuredGame.image}
                    label="Games"
                    title={featuredGame.title}
                    icon={Gamepad2}
                    accent="bg-primary/20 text-primary border border-primary/30"
                  />
                </Tilt>
              </Float>
              <Float amp={9} duration={8} delay={1.2} className="mt-10">
                <Tilt className="aspect-[3/4] lg:rotate-2">
                  <TrackCard
                    to={featuredAi.links[0].url}
                    external
                    image={featuredAi.image}
                    label="AI"
                    title={featuredAi.title}
                    icon={Bot}
                    accent="bg-warning/20 text-warning border border-warning/30"
                  />
                </Tilt>
              </Float>

              <Float amp={5} duration={5} delay={0.6} className="absolute -left-6 top-1/2 hidden sm:block z-20">
                <div className="px-3 py-1.5 rounded-full border border-border bg-surface-1/80 backdrop-blur text-[11px] text-muted-foreground shadow-e2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-warning" /> prompt → playable
                </div>
              </Float>
              <Float amp={6} duration={6} delay={2} className="absolute -right-4 top-2 hidden sm:block z-20">
                <div className="px-3 py-1.5 rounded-full border border-border bg-surface-1/80 backdrop-blur text-[11px] text-muted-foreground shadow-e2 stat-num">
                  {projectsList.length + aiProjects.length} projects
                </div>
              </Float>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div {...fadeUp(1.3)} className="relative z-10 mt-14 md:mt-0 md:mb-8">
        <div className="marquee-mask overflow-hidden">
          <div className="marquee flex w-max gap-10 py-2">
            {[...STACK, ...STACK].map((s, i) => (
              <span key={i} className="font-display text-sm tracking-[0.2em] uppercase text-subtle-foreground whitespace-nowrap">
                {s} <span className="text-primary/50 ml-10">✦</span>
              </span>
            ))}
          </div>
        </div>
        <a
          href="#work"
          aria-label="Scroll to work"
          className="hidden md:flex mx-auto mt-4 w-8 h-12 rounded-full border border-border-strong items-start justify-center pt-2"
        >
          <motion.span animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
          </motion.span>
        </a>
      </motion.div>
    </section>
  );
};

export default MainMenu;
