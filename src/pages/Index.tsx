import { motion } from "framer-motion";
import ConsoleShell from "@/components/shell/ConsoleShell";
import MainMenu from "@/components/screens/MainMenu";
import LevelSelect from "@/components/screens/LevelSelect";
import AgenticSkills from "@/components/AgenticSkills";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <ConsoleShell>
      <div id="main" className="scroll-mt-14">
        <MainMenu />
      </div>

      <div id="library" className="scroll-mt-14" />
      <div id="projects" className="scroll-mt-14" />
      <section className="py-24 relative overflow-hidden">
        <div className="container px-6 relative z-10">
          <LevelSelect />
        </div>
      </section>

      <div id="tools" className="scroll-mt-14" />
      <div id="agentic-skills" className="scroll-mt-14" />
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
              <span className="text-foreground">AGENTIC</span>{" "}
              <span className="text-primary">SKILLS</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Installable AI agent skills I've built and published for Claude Code, Cursor, and GitHub Copilot CLI
            </p>
          </motion.div>
          <AgenticSkills />
        </div>
      </section>

      <div id="career" className="scroll-mt-14">
        <Experience />
      </div>
      <div id="skills" className="scroll-mt-14">
        <Skills />
      </div>
      <div id="contact" className="scroll-mt-14">
        <Contact />
      </div>
    </ConsoleShell>
  );
};

export default Index;
