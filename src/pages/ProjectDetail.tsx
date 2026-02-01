import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Gamepad2, ExternalLink } from "lucide-react";
import rannBhumiImg from "@/assets/rann-bhumi.jpg";
import miniGolfImg from "@/assets/mini-golf.png";

const projectsData: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  image: string | null;
  tags: string[];
  highlights: string[];
  fullDescription: string;
  videoUrl?: string;
  gallery?: string[];
}> = {
  "rann-bhumi": {
    title: "Rann Bhumi",
    subtitle: "5v5 Combat Title",
    description:
      "A mythological combat game inspired by Kurukshetra. Developed class-based weapons, killstreak systems based on classical Indian godly weapons, and Photon PUN 2 networking with authoritative server logic.",
    image: rannBhumiImg,
    tags: ["Unity", "Photon PUN 2", "Combat", "Multiplayer", "NFT"],
    highlights: [
      "5 unique character classes with different fighting styles",
      "Killstreak system inspired by Call of Duty",
      "NFT integration for in-game assets",
      "60 FPS on mid-range devices",
      "Authoritative server logic",
      "Sound integration across the game",
    ],
    fullDescription: `Developed gameplay mechanics inspired by the mythological war of Kurukshetra. Created unique mechanics for five character classes to different fighting styles while sticking closely to the theme.

Built a killstreak system based on classical Indian godly weapons, similar to Call Of Duty. Collaborated with the design team to accommodate NFTs within Rannbhumi.

Integrated all the sounds in the game. Playtested and balanced the game by tweaking character, weapon and killstreak stats, and attack behaviours.

Technical highlights include authoritative server logic with Photon PUN 2, state synchronization, and optimization to maintain 60 FPS on mid-range devices.`,
    videoUrl: undefined,
    gallery: [],
  },
  "mini-golf": {
    title: "Mini Golf",
    subtitle: "Multiplayer Roblox Game",
    description:
      "Solo-developed a multiplayer Mini Golf title reaching 58K+ unique plays. Managed physics, networking, and UX iteration based on live player data.",
    image: miniGolfImg,
    tags: ["Roblox", "Lua", "Multiplayer", "Physics"],
    highlights: [
      "58K+ unique plays achieved",
      "5 unique levels designed",
      "Custom physics implementation",
      "Live player data-driven iteration",
      "Full UI and audio integration",
      "Stylized environment design",
    ],
    fullDescription: `Developed the game and implemented UI and audio effects. Designed and implemented 5 unique levels and the lobby for the game.

Revamped the aesthetics of the game through stylized props, environment setting, and colour scheme.

Solo-developed this multiplayer Mini Golf title from scratch, managing physics, networking, and UX. Achieved 58K+ unique plays through continuous iteration based on live player data.`,
    videoUrl: undefined,
    gallery: [],
  },
  "puzzles-and-cats": {
    title: "Puzzles & Cats",
    subtitle: "LiveOps Mobile Game",
    description:
      "Developed core meta-systems including Shop, Economy, and Procedural Logic. Built LiveOps pipelines using remote-configurable data for safe, no-build updates.",
    image: null,
    tags: ["Unity", "LiveOps", "Meta-Systems", "Mobile"],
    highlights: [
      "Remote-configurable updates",
      "Economy system design",
      "Procedural content generation",
      "Shop integration",
      "LiveOps pipeline development",
      "No-build deployment capability",
    ],
    fullDescription: `Developed core meta-systems for this LiveOps mobile game, focusing on Shop, Economy, and Procedural Logic systems.

Built robust LiveOps pipelines using remote-configurable data, enabling safe updates without requiring new app builds. This approach significantly reduced deployment risk and accelerated feature iteration.`,
    videoUrl: undefined,
    gallery: [],
  },
  "dominoes-logic": {
    title: "Dominoes Logic",
    subtitle: "Live Puzzle Game",
    description:
      "Developed dynamic grid generation, FTUE, and Level Editors. Owned full UI/UX and Analytics integration for the live title.",
    image: null,
    tags: ["Unity", "Puzzle", "Level Editor", "Analytics"],
    highlights: [
      "Dynamic grid generation system",
      "Custom level editor tools",
      "FTUE (First Time User Experience)",
      "Full analytics suite integration",
      "Complete UI/UX ownership",
      "Live title maintenance",
    ],
    fullDescription: `Developed dynamic grid generation systems and created comprehensive Level Editors for the design team. Implemented the First Time User Experience (FTUE) flow to onboard new players effectively.

Owned the full UI/UX design and implementation, along with deep Analytics integration to track player behavior and game performance metrics.`,
    videoUrl: undefined,
    gallery: [],
  },
  "looper": {
    title: "Looper",
    subtitle: "Hybrid-Casual Overhaul",
    description:
      "Led the transition from Hyper-casual to Hybrid-casual, implementing retention features and designer-facing economy structures to drive LTV.",
    image: null,
    tags: ["Unity", "Hybrid-Casual", "Retention", "Economy"],
    highlights: [
      "Hyper to Hybrid-casual transition",
      "Retention feature implementation",
      "Economy system architecture",
      "LTV optimization strategies",
      "Designer-facing tools",
      "Player engagement systems",
    ],
    fullDescription: `Led the strategic transition of Looper from a Hyper-casual to Hybrid-casual game model. This involved implementing retention features and creating designer-facing economy structures to drive long-term value (LTV).

The transition required careful balance of maintaining casual accessibility while adding depth through meta-progression and engagement loops.`,
    videoUrl: undefined,
    gallery: [],
  },
};

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectsData[slug] : null;

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display text-foreground mb-4">Project Not Found</h1>
          <Link to="/" className="text-neon-cyan hover:underline">
            ← Back to Home
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
          <span className="font-display font-bold text-xl">
            <span className="text-neon-cyan">K</span>
            <span className="text-foreground">C</span>
          </span>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 relative">
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

      {/* Main Image/Video */}
      <section className="pb-16">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            {project.videoUrl ? (
              <div className="aspect-video rounded-2xl overflow-hidden border border-border">
                <iframe
                  src={project.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : project.image ? (
              <div className="aspect-video rounded-2xl overflow-hidden border border-border">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-muted to-card flex items-center justify-center">
                <Gamepad2 className="w-24 h-24 text-muted-foreground/30" />
              </div>
            )}
          </motion.div>
        </div>
      </section>

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

      {/* Gallery placeholder */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="pb-24">
          <div className="container px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
                Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.gallery.map((img, idx) => (
                  <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-border">
                    <img src={img} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
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
              className="inline-block py-3 px-8 rounded-xl font-display font-semibold bg-gradient-to-r from-neon-cyan to-neon-purple text-primary-foreground hover:opacity-90 transition-opacity"
            >
              GET IN TOUCH
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
