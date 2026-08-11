import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { projectsList } from "@/data/projectsData";
import LevelCard from "./LevelCard";

type Filter = "ALL" | "SHIPPED" | "PROTOTYPE" | "MULTIPLAYER" | "PUZZLE";

const FILTERS: Filter[] = ["ALL", "SHIPPED", "PROTOTYPE", "MULTIPLAYER", "PUZZLE"];

const matchesFilter = (project: (typeof projectsList)[number], filter: Filter) => {
  if (filter === "ALL") return true;
  if (filter === "SHIPPED") return project.meta?.status === "Shipped";
  if (filter === "PROTOTYPE") return project.meta?.status && project.meta.status !== "Shipped";
  if (filter === "MULTIPLAYER") return project.tags.includes("Multiplayer");
  if (filter === "PUZZLE") return project.tags.includes("Puzzle");
  return true;
};

const LevelSelect = () => {
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered = useMemo(
    () => projectsList.filter((project) => matchesFilter(project, filter)),
    [filter]
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            LIBRARY <span className="text-subtle-foreground text-xl align-middle">{projectsList.length} TITLES</span>
          </h2>
          <p className="text-muted-foreground mt-1">Games and systems I've built across my career</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto scroll-smooth [-webkit-overflow-scrolling:touch] pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-full font-display text-xs tracking-wider transition-colors duration-200 border ${
              filter === f
                ? "bg-primary/10 text-primary border-primary/30"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <LevelCard key={project.slug} project={project} slug={project.slug} />
        ))}
      </motion.div>
    </div>
  );
};

export default LevelSelect;
