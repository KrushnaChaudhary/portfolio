import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bot, ExternalLink } from "lucide-react";
import { aiProjects, aiProjectsBySlug } from "@/data/aiProjectsData";
import { Aurora } from "@/components/fx/Motion";

const ease = [0.16, 1, 0.3, 1] as const;

const AiProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? aiProjectsBySlug[slug] : undefined;
  const [active, setActive] = useState(0);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display text-foreground mb-4">Project Not Found</h1>
          <Link to="/#work" className="text-primary hover:underline">
            ← Back to work
          </Link>
        </div>
      </div>
    );
  }

  const index = aiProjects.findIndex((p) => p.slug === project.slug);
  const prev = index > 0 ? aiProjects[index - 1] : null;
  const next = index < aiProjects.length - 1 ? aiProjects[index + 1] : null;
  const shot = project.gallery[active] ?? project.image;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-1/80 backdrop-blur-xl border-b border-border h-14">
        <div className="container px-6 h-full flex items-center justify-between">
          <Link to="/#work" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-display text-xs tracking-wider">ALL WORK</span>
          </Link>
          <Link to="/" className="font-display font-bold text-lg">
            <span className="text-primary">K</span>
            <span className="text-foreground">C</span>
          </Link>
        </div>
      </header>

      {/* Hero: blurred backdrop of the cover + framed visual */}
      <section className="relative pt-14 overflow-hidden">
        <div className="absolute inset-0">
          <img src={project.image} alt="" aria-hidden className="w-full h-full object-cover blur-3xl scale-125 opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <Aurora />
        <div className="container px-6 relative z-10 py-12 md:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="lg:col-span-6"
            >
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-display tracking-[0.2em] uppercase mb-4 bg-warning/15 text-warning border border-warning/30">
                <Bot className="w-3 h-3" /> AI Project · {project.status}
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-[1.05] mb-3">{project.title}</h1>
              <p className="font-display text-primary tracking-wide mb-5">{project.kicker}</p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">{project.description}</p>

              <div className="flex flex-wrap gap-3 mb-8">
                {project.links.map((l, i) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-display text-xs tracking-wider transition-colors ${
                      i === 0
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "border border-border-strong text-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {l.label.toUpperCase()} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>

              <div className="flex flex-wrap gap-px rounded-xl overflow-hidden border border-border bg-border w-fit">
                {[
                  { label: "Status", value: project.status },
                  { label: "Year", value: project.year },
                  ...(project.stat ? [project.stat] : []),
                ].map((c) => (
                  <div key={c.label} className="bg-surface-1/80 backdrop-blur px-4 py-3">
                    <p className="stat-num font-display font-bold text-foreground">{c.value}</p>
                    <p className="text-[10px] text-subtle-foreground uppercase tracking-wider">{c.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease }}
              className="lg:col-span-6"
            >
              <div className="relative rounded-2xl overflow-hidden border border-border-strong shadow-e3 bg-surface-2">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={shot}
                    src={shot}
                    alt={project.title}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                    className="w-full max-h-[70vh] object-contain mx-auto"
                  />
                </AnimatePresence>
              </div>
              {project.gallery.length > 1 && (
                <div className="flex gap-3 mt-4 justify-center">
                  {project.gallery.map((g, i) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Show image ${i + 1}`}
                      className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        i === active ? "border-primary opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                      }`}
                    >
                      <img src={g} alt="" className="w-full h-full object-cover object-top" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {project.videos && project.videos.length > 0 && (
        <section className="pt-4">
          <div className="container px-6 max-w-6xl">
            <h2 className="font-display text-2xl font-bold mb-6">Watch</h2>
            <div className={`grid gap-6 ${project.videos.length > 1 ? "lg:grid-cols-2" : ""}`}>
              {project.videos.map((v) => (
                <motion.figure
                  key={v.src}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, ease }}
                >
                  <video
                    src={`${import.meta.env.BASE_URL}${v.src}`}
                    poster={project.image}
                    controls
                    playsInline
                    preload="none"
                    className="w-full rounded-2xl border border-border-strong shadow-e3 bg-black aspect-video object-contain"
                  />
                  <figcaption className="text-xs text-subtle-foreground mt-2">{v.title}</figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Body */}
      <section className="py-16">
        <div className="container px-6 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="lg:col-span-7"
            >
              <h2 className="font-display text-2xl font-bold mb-5">The story</h2>
              {project.overview.split("\n\n").map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                  {p}
                </p>
              ))}
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="panel p-6">
                <h3 className="font-display text-sm tracking-[0.2em] uppercase text-subtle-foreground mb-4">Highlights</h3>
                <ul className="space-y-2.5">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-foreground">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="panel p-6">
                <h3 className="font-display text-sm tracking-[0.2em] uppercase text-subtle-foreground mb-4">Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span key={s} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>

          {/* How it works: numbered flow */}
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-8">How it works</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {project.howItWorks.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease }}
                  className="panel p-5 relative"
                >
                  <span className="stat-num font-display text-3xl font-bold text-primary/30">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display font-semibold text-foreground mt-2 mb-1.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                  {i < project.howItWorks.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-border-strong z-10" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Prev / next */}
          <div className="mt-20 grid sm:grid-cols-2 gap-4">
            {prev ? (
              <Link to={`/ai/${prev.slug}`} className="panel p-4 flex items-center gap-4 group hover:border-border-strong transition-colors">
                <img src={prev.image} alt="" className="w-16 h-16 rounded-lg object-cover object-top" />
                <div>
                  <p className="text-[10px] text-subtle-foreground uppercase tracking-wider">← Previous</p>
                  <p className="font-display font-semibold group-hover:text-primary transition-colors">{prev.title}</p>
                </div>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link to={`/ai/${next.slug}`} className="panel p-4 flex items-center justify-end gap-4 text-right group hover:border-border-strong transition-colors">
                <div>
                  <p className="text-[10px] text-subtle-foreground uppercase tracking-wider">Next →</p>
                  <p className="font-display font-semibold group-hover:text-primary transition-colors">{next.title}</p>
                </div>
                <img src={next.image} alt="" className="w-16 h-16 rounded-lg object-cover object-top" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AiProjectDetail;
