import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CareerJourney from "@/components/CareerJourney";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <div id="projects">
        <CareerJourney />
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
