import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useInView } from "framer-motion";
import { Spotlight } from "@/components/fx/Motion";
import { ArrowUpRight, Bot, Gamepad2 } from "lucide-react";
import { projectsList } from "@/data/projectsData";
import { aiProjects, AiProject } from "@/data/aiProjectsData";

type Track = "games" | "ai";

const PREVIEW_COUNT = 6;

const STATUS_STYLE: Record<string, string> = {
  Shipped: "bg-success/15 text-success border-success/30",
  "In Development": "bg-warning/15 text-warning border-warning/30",
  Prototype: "bg-primary/15 text-primary border-primary/30",
  "Open Source": "bg-success/15 text-success border-success/30",
  "Playable Demo": "bg-warning/15 text-warning border-warning/30",
  "Write-up": "bg-surface-3 text-muted-foreground border-border",
};

const StatusChip = ({ label }: { label: string }) => (
  <span
    className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] font-display tracking-wider uppercase rounded-full border backdrop-blur ${
      STATUS_STYLE[label] ?? "bg-surface-2 text-muted-foreground border-border"
    }`}
  >
    {label}
  </span>
);

const AiCover = ({ project }: { project: AiProject }) => (
  <img
    src={project.image}
    alt={project.title}
    loading="lazy"
    decoding="async"
    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
  />
);

const Row = ({
  index,
  cover,
  title,
  kicker,
  description,
  tags,
  stat,
}: {
  index: number;
  cover: React.ReactNode;
  title: string;
  kicker: string;
  description: string;
  tags: string[];
  stat?: { label: string; value: string };
}) => (
  <Spotlight className="h-full">
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 300, damping: 22 }}
    className="panel overflow-hidden h-full flex hover:shadow-e3 hover:border-border-strong transition-[box-shadow,border-color] duration-300"
  >
    <div className="relative w-[38%] shrink-0 overflow-hidden bg-surface-2">{cover}</div>
    <div className="p-4 min-w-0 flex flex-col">
      <div className="flex items-start gap-2 mb-1">
        <span className="stat-num font-display text-[11px] text-subtle-foreground pt-0.5">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-base font-semibold text-foreground leading-tight flex-1">{title}</h3>
        <ArrowUpRight className="w-4 h-4 text-subtle-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>
      <p className="text-[11px] text-primary font-display tracking-wide uppercase mb-2 truncate">{kicker}</p>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">{description}</p>
      <div className="mt-auto flex items-center gap-2 flex-wrap">
        {stat && (
          <span className="px-2 py-0.5 rounded-md bg-surface-2 border border-border text-[10px]">
            <span className="stat-num font-semibold text-foreground">{stat.value}</span>{" "}
            <span className="text-subtle-foreground">{stat.label}</span>
          </span>
        )}
        {tags.slice(0, stat ? 2 : 3).map((t) => (
          <span key={t} className="text-[10px] text-subtle-foreground">
            #{t.replace(/\s+/g, "")}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
  </Spotlight>
);

const Counter = ({ to }: { to: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const c = animate(0, to, { duration: 1.2, ease: "easeOut", onUpdate: (v) => (node.textContent = String(Math.round(v))) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>0</span>;
};

const ColumnHeader = ({
  icon: Icon,
  title,
  sub,
  count,
  accent,
}: {
  icon: typeof Bot;
  title: string;
  sub: string;
  count: number;
  accent: string;
}) => (
  <div className="flex items-end justify-between gap-4 mb-5 pb-4 border-b border-border">
    <div className="flex items-center gap-3">
      <div className={`p-2.5 rounded-xl ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
    <span className="stat-num font-display text-4xl font-bold text-foreground/15"><Counter to={count} /></span>
  </div>
);

const GamesColumn = ({ expanded }: { expanded: boolean }) => {
  const list = expanded ? projectsList : projectsList.slice(0, PREVIEW_COUNT);
  return (
    <div>
      <ColumnHeader
        icon={Gamepad2}
        title="Games"
        sub="Shipped titles & studio prototypes · Unity, Roblox, H5"
        count={projectsList.length}
        accent="bg-primary/10 text-primary"
      />
      <div className="grid gap-4">
        {list.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: Math.min(i, 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to={`/project/${p.slug}`} className="group block h-full">
              <Row
                index={i}
                title={p.title}
                kicker={p.meta ? `${p.meta.genre} · ${p.meta.studio}` : p.subtitle}
                description={p.description}
                tags={p.tags}
                stat={p.meta?.stat}
                cover={
                  <>
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    )}
                    {p.meta?.status && <StatusChip label={p.meta.status} />}
                  </>
                }
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AiColumn = ({ expanded }: { expanded: boolean }) => {
  const list = expanded ? aiProjects : aiProjects.slice(0, PREVIEW_COUNT);
  return (
    <div>
      <ColumnHeader
        icon={Bot}
        title="AI Projects"
        sub="Agent skills, MCP tooling & AI-built games"
        count={aiProjects.length}
        accent="bg-warning/10 text-warning"
      />
      <div className="grid gap-4">
        {list.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: Math.min(i, 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to={`/ai/${p.slug}`} className="group block h-full">
              <Row
                index={i}
                title={p.title}
                kicker={p.kicker}
                description={p.description}
                tags={p.tags}
                stat={p.stat}
                cover={
                  <>
                    <AiCover project={p} />
                    <StatusChip label={p.status} />
                  </>
                }
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const DualShowcase = () => {
  const [track, setTrack] = useState<Track>("games");
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = Math.max(projectsList.length, aiProjects.length) - PREVIEW_COUNT;

  return (
    <section className="py-24 relative">
      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="text-primary font-display text-xs tracking-[0.3em] uppercase mb-3">Selected work</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Two tracks. <span className="text-subtle-foreground">One craft.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The games I've shipped on the left, the AI tooling that now builds them on the right. Both
            ranked by impact.
          </p>
        </motion.div>

        {/* Mobile track switcher */}
        <div className="lg:hidden flex p-1 mb-8 rounded-full border border-border bg-surface-1 max-w-sm mx-auto">
          {(["games", "ai"] as Track[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTrack(t)}
              className={`relative flex-1 py-2 rounded-full font-display text-xs tracking-wider transition-colors ${
                track === t ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {track === t && (
                <motion.span
                  layoutId="track-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">
              {t === "games" ? `GAMES · ${projectsList.length}` : `AI PROJECTS · ${aiProjects.length}`}
              </span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12">
          <div className={track === "games" ? "block" : "hidden lg:block"}>
            <GamesColumn expanded={expanded} />
          </div>
          <div className={track === "ai" ? "block" : "hidden lg:block"}>
            <AiColumn expanded={expanded} />
          </div>
        </div>

        {hiddenCount > 0 && (
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="px-6 py-3 rounded-xl border border-border-strong font-display text-xs tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {expanded ? "SHOW FEWER" : "SHOW ALL PROJECTS"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DualShowcase;
