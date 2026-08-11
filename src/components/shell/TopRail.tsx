import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const SECTIONS = [
  { id: "main", label: "MAIN" },
  { id: "library", label: "LIBRARY" },
  { id: "tools", label: "TOOLS" },
  { id: "career", label: "CAREER" },
  { id: "skills", label: "SKILLS" },
  { id: "contact", label: "CONTACT" },
];

const TopRail = () => {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface-1/80 backdrop-blur-xl border-b border-border">
        <div className="container h-full px-6">
          <div className="flex items-center justify-between h-full">
            <a href="#main" className="font-display font-bold text-lg tracking-wider">
              <span className="text-primary">K</span>
              <span className="text-foreground">C</span>
            </a>

            <div className="hidden md:flex items-center gap-1">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`relative px-4 py-2 rounded-full font-display text-xs tracking-wider transition-colors duration-200 ${
                    activeId === section.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeId === section.id && (
                    <motion.span
                      layoutId="railPill"
                      className="absolute inset-0 rounded-full bg-primary/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{section.label}</span>
                </a>
              ))}
            </div>

            <div className="hidden md:block">
              <a
                href="mailto:krushnachaudhary.kc@gmail.com"
                className="px-4 py-2 rounded-lg font-display text-xs tracking-wider border border-primary text-primary hover:bg-primary/10 transition-all"
              >
                HIRE ME
              </a>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-surface-1 pt-14 md:hidden"
          >
            <div className="container px-6 py-8">
              <div className="flex flex-col gap-1">
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`py-3 font-display text-xl tracking-wider ${
                      activeId === section.id ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {section.label}
                  </a>
                ))}
                <a
                  href="mailto:krushnachaudhary.kc@gmail.com"
                  className="mt-4 py-4 px-6 rounded-xl font-display text-center bg-primary text-primary-foreground"
                >
                  HIRE ME
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopRail;
