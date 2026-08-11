import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { projectsList } from "@/data/projectsData";

const COVERS = projectsList.slice(0, 3);

const CoverFlow = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (paused || reducedMotion.current) return;
    const id = setInterval(() => setActive((i) => (i + 1) % COVERS.length), 4500);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="relative aspect-[4/3] w-full max-w-md mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {COVERS.map((project, i) => {
        const offset = (i - active + COVERS.length) % COVERS.length;
        const isTop = offset === 0;
        return (
          <Link
            key={project.slug}
            to={`/project/${project.slug}`}
            className="absolute inset-0 rounded-2xl overflow-hidden border border-border transition-all duration-500 ease-out"
            style={{
              transform: `translate(${offset * 14}px, ${offset * 14}px) rotate(${offset * 2}deg)`,
              zIndex: COVERS.length - offset,
              boxShadow: isTop ? "var(--shadow-3)" : "var(--shadow-1)",
              pointerEvents: isTop ? "auto" : "none",
            }}
          >
            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover"
              />
            )}
            {isTop && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                <p className="font-display text-sm text-foreground">{project.title}</p>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default CoverFlow;
