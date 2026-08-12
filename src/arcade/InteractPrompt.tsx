import { AnimatePresence, motion } from "framer-motion";
import { HubBuilding } from "@/data/hubMapData";
import { projectsData } from "@/data/projectsData";

const InteractPrompt = ({ building }: { building: HubBuilding | null }) => {
  const cover = building?.kind === "arcade" ? projectsData[building.slug]?.image : null;

  return (
    <div className="absolute bottom-28 md:bottom-6 inset-x-0 flex justify-center pointer-events-none">
      <AnimatePresence>
        {building && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="panel-raised flex items-center gap-3 px-4 py-3"
          >
            {cover && (
              <img src={cover} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
            )}
            <div>
              <p className="text-[10px] text-subtle-foreground uppercase tracking-wider">Enter</p>
              <p className="font-display text-sm font-semibold text-foreground">{building.sign}</p>
            </div>
            <span className="pointer-fine:inline-block hidden ml-2 px-2 py-1 rounded-md bg-surface-2 text-xs font-mono text-muted-foreground">
              E
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractPrompt;
