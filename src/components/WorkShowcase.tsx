import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Bot } from "lucide-react";
import Projects from "@/components/Projects";
import AgenticSkills from "@/components/AgenticSkills";

type Tab = "work" | "skills";

const tabCopy: Record<Tab, { eyebrow: string; accent: string; sub: string }> = {
  work: {
    eyebrow: "FEATURED",
    accent: "PROJECTS",
    sub: "Games and systems I've built across my career",
  },
  skills: {
    eyebrow: "AGENTIC",
    accent: "SKILLS",
    sub: "Installable AI agent skills I've built and published for Claude Code, Cursor, and GitHub Copilot CLI",
  },
};

const WorkShowcase = () => {
  const [tab, setTab] = useState<Tab>("work");

  useEffect(() => {
    const applyHash = () => {
      setTab(window.location.hash === "#agentic-skills" ? "skills" : "work");
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const copy = tabCopy[tab];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/20 to-transparent pointer-events-none" />

      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">{copy.eyebrow}</span>{" "}
            <span className="text-primary ">{copy.accent}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{copy.sub}</p>
        </motion.div>

        <div className="flex items-center justify-center mb-16">
          <div className="inline-flex p-1 rounded-full border border-border bg-card/50">
            <button
              type="button"
              onClick={() => setTab("work")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-display text-sm tracking-wider transition-all duration-300 ${
                tab === "work"
                  ? "bg-primary/10 text-primary shadow-e2"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              SHIPPED GAMES
            </button>
            <button
              type="button"
              onClick={() => setTab("skills")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-display text-sm tracking-wider transition-all duration-300 ${
                tab === "skills"
                  ? "bg-primary/10 text-primary shadow-e2"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bot className="w-4 h-4" />
              AGENTIC SKILLS
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {tab === "work" ? <Projects /> : <AgenticSkills />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WorkShowcase;
