import ConsoleShell from "@/components/shell/ConsoleShell";
import MainMenu from "@/components/screens/MainMenu";
import LevelSelect from "@/components/screens/LevelSelect";
import Toolkit from "@/components/screens/Toolkit";
import QuestLog from "@/components/screens/QuestLog";
import SkillTree from "@/components/screens/SkillTree";
import Contact from "@/components/screens/Contact";

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
      <Toolkit />

      <div id="career" className="scroll-mt-14">
        <QuestLog />
      </div>
      <div id="skills" className="scroll-mt-14">
        <SkillTree />
      </div>
      <div id="contact" className="scroll-mt-14">
        <Contact />
      </div>
    </ConsoleShell>
  );
};

export default Index;
