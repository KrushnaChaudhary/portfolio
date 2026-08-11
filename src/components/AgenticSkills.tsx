import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Package, ExternalLink, Copy, Check } from "lucide-react";
import { agenticSkills } from "@/data/agenticSkillsData";

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
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />

      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">AGENTIC</span>{" "}
            <span className="text-neon-purple text-glow-purple">SKILLS</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Installable AI agent skills I've built and published — for Claude Code, Cursor, and
            GitHub Copilot CLI
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {agenticSkills.map((skill, index) => (
            <motion.div key={skill.title} variants={cardVariants} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-card to-background rounded-2xl" />
              <div className="relative p-6 md:p-8 rounded-2xl border border-border hover:border-neon-cyan/50 transition-all duration-500 gradient-border h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className={`inline-flex p-3 rounded-lg bg-${skill.color}/10`}>
                    <skill.icon className={`w-6 h-6 text-${skill.color}`} />
                  </div>
                  <span className="text-xs font-display tracking-wider text-muted-foreground uppercase pt-2">
                    {skill.tagline}
                  </span>
                </div>

                <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                  {skill.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  {skill.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 text-xs font-medium rounded-full bg-${skill.color}/10 text-${skill.color} border border-${skill.color}/20`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(skill.installCommand, index)}
                  className="w-full flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 px-4 py-3 mb-6 text-left transition-colors hover:border-neon-cyan/40"
                  aria-label={`Copy install command for ${skill.title}`}
                >
                  <code className="font-mono text-xs md:text-sm text-neon-cyan truncate">
                    {skill.installCommand}
                  </code>
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>

                <div className="flex items-center gap-3 mt-auto">
                  <a
                    href={skill.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full border border-border hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300 hover:box-glow-cyan"
                    aria-label={`${skill.title} on GitHub`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={skill.npmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full border border-border hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300 hover:box-glow-cyan"
                    aria-label={`${skill.title} on npm`}
                  >
                    <Package className="w-4 h-4" />
                  </a>
                  <a
                    href={skill.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 ml-auto text-sm font-display tracking-wider text-neon-cyan"
                  >
                    <span>VIEW</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AgenticSkills;
