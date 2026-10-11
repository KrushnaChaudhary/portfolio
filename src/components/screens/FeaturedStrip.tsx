import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Bot, Gamepad2 } from "lucide-react";
import { projectsData } from "@/data/projectsData";
import { aiProjectsBySlug } from "@/data/aiProjectsData";
import { Tilt } from "@/components/fx/Motion";

type Tile = {
  to: string;
  image: string;
  title: string;
  kicker: string;
  kind: "game" | "ai";
  className: string;
};

const game = (slug: string, className: string): Tile => {
  const p = projectsData[slug];
  return {
    to: `/project/${slug}`,
    image: p.image ?? "",
    title: p.title,
    kicker: p.meta ? `${p.meta.genre} · ${p.meta.studio}` : p.subtitle,
    kind: "game",
    className,
  };
};

const ai = (slug: string, className: string): Tile => {
  const p = aiProjectsBySlug[slug];
  return { to: `/ai/${slug}`, image: p.image, title: p.title, kicker: p.kicker, kind: "ai", className };
};

// Bento of the most visually striking work, alternating games and AI builds.
const TILES: Tile[] = [
  ai("pressureglass-taskkeel", "md:col-span-4 md:row-span-2"),
  game("rann-bhumi", "md:col-span-2"),
  ai("break-my-game", "md:col-span-2 md:row-span-2"),
  game("monster-mayhem", "md:col-span-2"),
  ai("ue-metahuman-crowd", "md:col-span-2"),
  ai("sushi-stampede", "md:col-span-2"),
  ai("mosslight", "md:col-span-4"),
];

const FeaturedStrip = () => (
  <section className="relative py-20">
    <div className="container px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-end justify-between gap-4 mb-8"
      >
        <div>
          <p className="text-primary font-display text-xs tracking-[0.3em] uppercase mb-2">Featured</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Highlight reel</h2>
        </div>
        <a href="#work" className="hidden sm:inline font-display text-xs tracking-wider text-muted-foreground hover:text-primary">
          ALL PROJECTS ↓
        </a>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 md:auto-rows-[200px] gap-4">
        {TILES.map((t, i) => (
          <motion.div
            key={t.to}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className={`${t.className} min-h-[220px]`}
          >
            <Tilt max={4} className="h-full">
              <Link to={t.to} className="group relative block h-full rounded-2xl overflow-hidden border border-border bg-surface-2 shadow-e2">
                <img
                  src={t.image}
                  alt={t.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
                <span
                  className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-display tracking-[0.2em] uppercase backdrop-blur ${
                    t.kind === "ai"
                      ? "bg-warning/20 text-warning border border-warning/30"
                      : "bg-primary/20 text-primary border border-primary/30"
                  }`}
                >
                  {t.kind === "ai" ? <Bot className="w-3 h-3" /> : <Gamepad2 className="w-3 h-3" />}
                  {t.kind === "ai" ? "AI" : "Game"}
                </span>
                <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground truncate">{t.kicker}</p>
                    <p className="font-display font-semibold text-foreground text-lg leading-tight">{t.title}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-foreground/70 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </div>
              </Link>
            </Tilt>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedStrip;
