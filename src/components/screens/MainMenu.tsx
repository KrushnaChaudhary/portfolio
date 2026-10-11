import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bot, Gamepad2, Linkedin, Mail } from "lucide-react";
import { projectsList } from "@/data/projectsData";
import { aiProjects } from "@/data/aiProjectsData";

const STATS = [
  { label: "Downloads on Looper", value: "10Cr+" },
  { label: "Game titles", value: String(projectsList.length) },
  { label: "AI projects", value: String(aiProjects.length) },
  { label: "Years shipping", value: "5+" },
];

const featuredGame = projectsList[0];
const featuredAi = aiProjects.find((p) => p.image) ?? aiProjects[0];

const TrackCard = ({
  to,
  external,
  image,
  label,
  title,
  icon: Icon,
  className,
  accent,
}: {
  to: string;
  external?: boolean;
  image?: string | null;
  label: string;
  title: string;
  icon: typeof Bot;
  className: string;
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
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute left-4 right-4 bottom-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-display tracking-[0.2em] uppercase mb-2 ${accent}`}>
          <Icon className="w-3 h-3" />
          {label}
        </span>
        <p className="font-display font-semibold text-foreground text-lg leading-tight">{title}</p>
      </div>
    </div>
  );
  return external ? (
    <a href={to} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link to={to} className={className}>
      {inner}
    </Link>
  );
};

const MainMenu = () => {
  return (
    <section className="relative flex items-center overflow-hidden py-20 md:py-0 md:min-h-[calc(100vh-3.5rem)]">
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div
        className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.55), transparent 65%)" }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--warning) / 0.5), transparent 65%)" }}
      />

      <div className="container px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface-1/70 backdrop-blur mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-xs text-muted-foreground">
                Krushna Chaudhary · Gameplay Programmer @ Kwalee · Bangalore
              </span>
            </div>

            <h1
              className="font-display font-bold text-foreground mb-6 leading-[1.02] tracking-tight"
              style={{ fontSize: "clamp(2.4rem, 6.2vw, 4.75rem)" }}
            >
              I build <span className="text-primary">games</span>
              <br />
              and the <span className="text-warning">AI agents</span>
              <br />
              that build them.
            </h1>

            <p className="text-muted-foreground text-lg max-w-xl mb-8 leading-relaxed">
              5+ years shipping mobile games in Unity, from a 10Cr+ download hit to 5v5 multiplayer combat.
              Now I design multi-agent workflows, MCP tools and agent skills that take a game from one prompt
              to a playable build.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href="#work"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-display text-sm tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Gamepad2 className="w-4 h-4" /> SEE THE WORK
              </a>
              <a
                href="mailto:krushnachaudhary.kc@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-display text-sm tracking-wider border border-border-strong text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" /> HIRE ME
              </a>
              <a
                href="https://www.linkedin.com/in/krushna-chaudhary/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center px-3 py-3 rounded-xl border border-border-strong text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px max-w-xl rounded-xl overflow-hidden border border-border bg-border">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-surface-1 px-4 py-3">
                  <p className="stat-num text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-subtle-foreground uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="relative grid grid-cols-2 gap-4 max-w-md mx-auto">
              <TrackCard
                to={`/project/${featuredGame.slug}`}
                image={featuredGame.image}
                label="Games"
                title={featuredGame.title}
                icon={Gamepad2}
                accent="bg-primary/20 text-primary border border-primary/30"
                className="block aspect-[3/4] lg:-rotate-2 hover:rotate-0 transition-transform duration-500"
              />
              <TrackCard
                to={featuredAi.links[0].url}
                external
                image={featuredAi.image}
                label="AI"
                title={featuredAi.title}
                icon={Bot}
                accent="bg-warning/20 text-warning border border-warning/30"
                className="block aspect-[3/4] mt-10 lg:rotate-2 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MainMenu;
