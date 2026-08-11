import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WorkShowcase from "@/components/WorkShowcase";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <div id="projects" className="scroll-mt-20" />
      <div id="agentic-skills" className="scroll-mt-20" />
      <WorkShowcase />
      <div id="experience">
        <Experience />
      </div>
      <div id="skills">
        <Skills />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </div>
  );
};

export default Index;
