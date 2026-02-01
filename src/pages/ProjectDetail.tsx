import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { projectsData } from "@/data/projectsData";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectsData[slug] : null;

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display text-foreground mb-4">Project Not Found</h1>
          <Link to="/#projects" className="text-neon-cyan hover:underline">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="container px-6 h-16 flex items-center justify-between">
          <Link
            to="/#projects"
            className="flex items-center gap-2 text-muted-foreground hover:text-neon-cyan transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-display text-sm tracking-wider">BACK TO PROJECTS</span>
          </Link>
          <Link to="/" className="font-display font-bold text-xl">
            <span className="text-neon-cyan">K</span>
            <span className="text-foreground">C</span>
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-24 pb-8 relative">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-neon-cyan font-display text-sm tracking-wider mb-4 block">
              {project.subtitle}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 text-sm font-medium rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section - Above About */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="pb-12">
          <div className="container px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
                Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.gallery.map((img, idx) => (
                  <motion.div 
                    key={idx} 
                    className="aspect-[9/16] rounded-xl overflow-hidden border border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <img 
                      src={img} 
                      alt={`${project.title} screenshot ${idx + 1}`} 
                      className="w-full h-full object-contain bg-card" 
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* YouTube Video - After Gallery */}
      {project.youtubeId && (
        <section className="pb-12">
          <div className="container px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
                Gameplay Video
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

      {/* Store Links */}
      {project.storeLinks && project.storeLinks.length > 0 && (
        <section className="pb-8">
          <div className="container px-6">
            <div className="max-w-5xl mx-auto flex flex-wrap gap-4 justify-center">
              {project.storeLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 hover:bg-neon-cyan/20 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="pb-24">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                About the Project
              </h2>
              <div className="prose prose-invert max-w-none">
                {project.fullDescription.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-muted-foreground mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Key Features
              </h2>
              <ul className="space-y-3">
                {project.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <span className="w-2 h-2 rounded-full bg-neon-purple mt-2 flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </motion.div>
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
            className="max-w-2xl mx-auto text-center p-8 rounded-2xl border border-border bg-card/50"
          >
            <h3 className="font-display text-xl font-bold text-foreground mb-4">
              Interested in working together?
            </h3>
            <Link
              to="/#contact"
              className="inline-block py-3 px-8 rounded-xl font-display font-semibold bg-gradient-to-r from-neon-cyan to-neon-purple text-primary-foreground hover:opacity-90 transition-opacity"
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
