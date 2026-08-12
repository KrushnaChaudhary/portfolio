import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { projectsData, projectsList } from "@/data/projectsData";
import ProjectGallery from "@/components/screens/ProjectGallery";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectsData[slug] : null;

  const currentIndex = projectsList.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? projectsList[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < projectsList.length - 1
      ? projectsList[currentIndex + 1]
      : null;

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display text-foreground mb-4">Project Not Found</h1>
          <Link to="/#library" className="text-primary hover:underline">
            ← Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const meta = project.meta;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-surface-1/80 backdrop-blur-xl border-b border-border h-14"
      >
        <div className="container px-6 h-full flex items-center justify-between">
          <Link
            to="/#library"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-display text-xs tracking-wider">LIBRARY</span>
          </Link>
          <Link to="/" className="font-display font-bold text-lg">
            <span className="text-primary">K</span>
            <span className="text-foreground">C</span>
          </Link>
        </div>
      </motion.header>

      {/* Hero band */}
      <section className="relative pt-14">
        <div className="relative aspect-[4/3] md:aspect-[21/9] w-full overflow-hidden bg-surface-2">
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 container px-6 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-4xl"
            >
              <span className="text-primary font-display text-sm tracking-wider mb-2 block">
                {meta ? `${meta.genre} · ${meta.studio} · ${meta.year}` : project.subtitle}
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">
                {project.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Character sheet stat strip */}
      {meta && (
        <section className="border-b border-border">
          <div className="container px-6">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { label: "Status", value: meta.status },
                { label: "Engine", value: meta.engine },
                { label: "Platform", value: meta.platforms.join(" / ") },
                { label: "Year", value: meta.year },
                ...(meta.stat ? [{ label: meta.stat.label, value: meta.stat.value }] : []),
              ].map((cell) => (
                <div key={cell.label} className="shrink-0 snap-start">
                  <p className="text-[10px] text-subtle-foreground uppercase tracking-wider mb-0.5">
                    {cell.label}
                  </p>
                  <p className="stat-num text-sm font-display font-semibold text-foreground whitespace-nowrap">
                    {cell.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Body */}
      <section className="py-12">
        <div className="container px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left: media */}
              <div className="lg:sticky lg:top-24">
                {project.gallery && project.gallery.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="font-display text-2xl font-bold text-foreground mb-6">Gallery</h2>
                    <ProjectGallery images={project.gallery} title={project.title} />
                  </motion.div>
                ) : project.youtubeId ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="font-display text-2xl font-bold text-foreground mb-6">Trailer</h2>
                    <div className="aspect-video rounded-2xl overflow-hidden border border-border">
                      <iframe
                        src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=0&rel=0`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`${project.title} trailer`}
                      />
                    </div>
                  </motion.div>
                ) : null}
              </div>

              {/* Right: About / Contributions / Features / Store */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">About</h2>
                  <div className="max-w-none">
                    {project.fullDescription.split("\n\n").map((paragraph, idx) => (
                      <p key={idx} className="text-muted-foreground mb-3 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="panel p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    My Contributions
                  </h2>
                  <ul className="space-y-3">
                    {project.myRole.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-muted-foreground text-sm">
                        <span className="stat-num text-primary font-display text-xs shrink-0 mt-0.5">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="font-display text-lg font-bold text-foreground mb-4">Features</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="px-3 py-1.5 text-sm rounded-full bg-surface-2 border border-border text-muted-foreground"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {project.storeLinks && project.storeLinks.length > 0 && (
                  <div className="flex flex-wrap gap-4 pt-4">
                    {project.storeLinks.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink className="w-4 h-4" />
                        GET ON {link.platform.toUpperCase()}
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Gameplay video, only when a gallery already occupies the media slot */}
      {project.youtubeId && project.gallery && project.gallery.length > 0 && (
        <section className="pb-12">
          <div className="container px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
                Gameplay
              </h2>
              <div className="aspect-video rounded-2xl overflow-hidden border border-border">
                <iframe
                  src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=0&rel=0`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${project.title} trailer`}
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Prev / Next */}
      <section className="pb-12">
        <div className="container px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 border-t border-border pt-8">
            {prevProject ? (
              <Link
                to={`/project/${prevProject.slug}`}
                className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-display text-xs tracking-wider">
                  {prevProject.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {nextProject && (
              <Link
                to={`/project/${nextProject.slug}`}
                className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-right"
              >
                <span className="font-display text-xs tracking-wider">
                  {nextProject.title}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center panel p-8"
          >
            <h3 className="font-display text-xl font-bold text-foreground mb-4">
              Interested in working together?
            </h3>
            <Link
              to="/#contact"
              className="inline-block py-3 px-8 rounded-xl font-display font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              HIRE ME
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
