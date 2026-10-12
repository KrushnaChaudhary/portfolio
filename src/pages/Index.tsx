import ConsoleShell from "@/components/shell/ConsoleShell";
import MainMenu from "@/components/screens/MainMenu";
import FeaturedStrip from "@/components/screens/FeaturedStrip";
import DualShowcase from "@/components/screens/DualShowcase";
import QuestLog from "@/components/screens/QuestLog";
import SkillTree from "@/components/screens/SkillTree";
import Contact from "@/components/screens/Contact";

const Index = () => {
  return (
    <ConsoleShell>
      <div id="main" className="scroll-mt-14">
        <MainMenu />
      </div>

      <FeaturedStrip />

      <div id="work" className="scroll-mt-14">
        {/* Legacy anchors kept so old links still land on the work section */}
        <div id="library" />
        <div id="projects" />
        <div id="tools" />
        <div id="agentic-skills" />
        <DualShowcase />
      </div>

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
