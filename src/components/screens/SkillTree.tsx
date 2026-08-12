import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { skillTreeData, SkillBranch, SkillNode } from "@/data/skillTreeData";
import { projectsData } from "@/data/projectsData";
import { ACCENT } from "@/lib/accents";

const BRANCHES: { id: SkillBranch; label: string }[] = [
  { id: "engine", label: "ENGINES & RUNTIME" },
  { id: "systems", label: "SYSTEMS & GAMEPLAY" },
  { id: "tools", label: "PIPELINE & TOOLS" },
];

const ProficiencyMeter = ({ level }: { level: number }) => (
  <div className="flex gap-1" aria-label={`Proficiency ${level} of 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`h-2 w-4 rounded-sm ${i < level ? "bg-primary" : "bg-border"}`}
      />
    ))}
  </div>
);

const SkillNodeCard = ({ node }: { node: SkillNode }) => {
  const [expanded, setExpanded] = useState(false);
  const accent = ACCENT[node.accent];
  const relatedProjects = (node.relatedSlugs ?? [])
    .map((slug) => ({ slug, project: projectsData[slug] }))
    .filter((entry) => entry.project);

  return (
    <div className="relative pl-8">
      <span className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary border-2 border-background" />
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="panel w-full text-left p-4 hover:border-primary/50 transition-colors duration-300"
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-3">
          <div className={`inline-flex p-2.5 rounded-lg ${accent.wash} shrink-0`}>
            <node.icon className={`w-5 h-5 ${accent.icon}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base font-semibold text-foreground mb-1.5">
              {node.label}
            </h3>
            <ProficiencyMeter level={node.level} />
            <div className="flex flex-wrap gap-1.5 mt-3">
              {node.items.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-0.5 text-xs rounded-full bg-surface-2 text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <div className="mt-2 p-4 rounded-lg bg-surface-2 text-sm text-muted-foreground">
            <p className="mb-3">{node.blurb}</p>
            {relatedProjects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {relatedProjects.map(({ slug, project }) => (
                  <Link
                    key={slug}
                    to={`/project/${slug}`}
                    className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {project.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const BranchColumn = ({ branch, label }: { branch: SkillBranch; label: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const nodes = skillTreeData
    .filter((s) => s.branch === branch)
    .sort((a, b) => a.tier - b.tier);

  return (
    <div ref={ref}>
      <h3 className="font-display text-sm tracking-wider text-subtle-foreground uppercase mb-6">
        {label}
      </h3>
      <div className="relative">
        <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-border overflow-hidden">
          <motion.div
            className="w-full bg-primary origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: inView ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ height: "100%" }}
          />
        </div>
        <div className="space-y-4">
          {nodes.map((node) => (
            <SkillNodeCard key={node.id} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
};

const SkillTree = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">TECHNICAL</span>{" "}
            <span className="text-primary">ARSENAL</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            The tools and technologies I wield to bring games to life. Tap a node for details.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {BRANCHES.map((b) => (
            <BranchColumn key={b.id} branch={b.id} label={b.label} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillTree;
