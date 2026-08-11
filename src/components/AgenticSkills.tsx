import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Package, ExternalLink, Copy, Check } from "lucide-react";
import { agenticSkills } from "@/data/agenticSkillsData";
import { ACCENT } from "@/lib/accents";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const AgenticSkills = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (command: string, index: number) => {
    navigator.clipboard.writeText(command);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex((current) => (current === index ? null : current)), 1600);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {agenticSkills.map((skill, index) => {
        const accent = ACCENT[skill.accent];
        return (
        <motion.div key={skill.title} variants={cardVariants} className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-card to-background rounded-2xl" />
          <div className="relative p-6 md:p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-500 edge-highlight h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className={`inline-flex p-3 rounded-lg ${accent.wash}`}>
                <skill.icon className={`w-6 h-6 ${accent.icon}`} />
              </div>
              <span className="text-xs font-display tracking-wider text-muted-foreground uppercase pt-2">
                {skill.tagline}
              </span>
            </div>

            <h3 className="font-display text-xl font-semibold mb-3 text-foreground">{skill.title}</h3>

            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{skill.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${accent.chip}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleCopy(skill.installCommand, index)}
              className="w-full flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 px-4 py-3 mb-6 text-left transition-colors hover:border-primary/40"
              aria-label={`Copy install command for ${skill.title}`}
            >
              <code className="font-mono text-xs md:text-sm text-primary truncate">
                {skill.installCommand}
              </code>
              {copiedIndex === index ? (
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>

            <div className="flex items-center gap-3 mt-auto">
              <a
                href={skill.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-border hover:border-primary hover:text-primary transition-all duration-300 hover:shadow-e2"
                aria-label={`${skill.title} on GitHub`}
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={skill.npmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-border hover:border-primary hover:text-primary transition-all duration-300 hover:shadow-e2"
                aria-label={`${skill.title} on npm`}
              >
                <Package className="w-4 h-4" />
              </a>
              <a
                href={skill.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 ml-auto text-sm font-display tracking-wider text-primary"
              >
                <span>VIEW</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
        );
      })}
    </motion.div>
  );
};

export default AgenticSkills;
