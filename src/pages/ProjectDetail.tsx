import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useEffect, useRef } from "react";
import { projectsData } from "@/data/projectsData";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectsData[slug] : null;
  const galleryRef = useRef<HTMLDivElement>(null);

  // Auto-scroll gallery effect (continuous, no pause)
  useEffect(() => {
    if (!project?.gallery || project.gallery.length === 0) return;
    
    const gallery = galleryRef.current;
    if (!gallery) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      if (gallery) {
        scrollPosition += scrollSpeed;
        
        // Reset to start when reaching the end (seamless loop)
        if (scrollPosition >= gallery.scrollWidth - gallery.clientWidth) {
          scrollPosition = 0;
        }
        
        gallery.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [project?.gallery]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display text-foreground mb-4">Project Not Found</h1>
          <Link to="/#projects" className="text-primary hover:underline">
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
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-display text-sm tracking-wider">BACK TO PROJECTS</span>
          </Link>
          <Link to="/" className="font-display font-bold text-xl">
            <span className="text-primary">K</span>
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
            className="max-w-6xl mx-auto"
          >
            <span className="text-primary font-display text-sm tracking-wider mb-4 block">
              {project.subtitle}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Gallery/Video + About Side by Side */}
      <section className="pb-12">
        <div className="container px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left side: Gallery OR YouTube Video */}
              {project.gallery && project.gallery.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:sticky lg:top-24"
                >
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Gallery
                  </h2>
                  <div 
                    ref={galleryRef}
                    className="overflow-hidden rounded-2xl border border-border bg-card/30"
                  >
                    <div className="flex gap-4 p-4" style={{ width: 'max-content' }}>
                      {project.gallery.map((img, idx) => (
                        <div 
                          key={idx} 
                          className="flex-shrink-0 w-48 md:w-56 aspect-[9/16] rounded-xl overflow-hidden border border-border/50"
                        >
                          <img 
                            src={img} 
                            alt={`${project.title} screenshot ${idx + 1}`} 
                            className="w-full h-full object-contain bg-card" 
                          />
                        </div>
                      ))}
                      {/* Duplicate images for seamless loop */}
                      {project.gallery.map((img, idx) => (
                        <div 
                          key={`dup-${idx}`} 
                          className="flex-shrink-0 w-48 md:w-56 aspect-[9/16] rounded-xl overflow-hidden border border-border/50"
                        >
                          <img 
                            src={img} 
                            alt={`${project.title} screenshot ${idx + 1}`} 
                            className="w-full h-full object-contain bg-card" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : project.youtubeId ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:sticky lg:top-24"
                >
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Trailer
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
              ) : null}

              {/* About + My Role + Features */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                {/* About the Game */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                    About the Game
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    {project.fullDescription.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-muted-foreground mb-3 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* My Role - Clear contribution section */}
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    What I Worked On
                  </h2>
                  <ul className="space-y-2">
                    {project.myRole.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-muted-foreground text-sm"
                      >
                        <span className="text-primary mt-1">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Game Features */}
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground mb-4">
                    Game Features
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="px-3 py-1.5 text-sm rounded-full bg-card border border-border text-muted-foreground"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Store Links */}
                {project.storeLinks && project.storeLinks.length > 0 && (
                  <div className="flex flex-wrap gap-4 pt-4">
                    {project.storeLinks.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {link.platform}
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Video - Only show separately if there's a gallery (otherwise it's shown beside About) */}
      {project.youtubeId && project.gallery && project.gallery.length > 0 && (
        <section className="pb-12">
          <div className="container px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
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