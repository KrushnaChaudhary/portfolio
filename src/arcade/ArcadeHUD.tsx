import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { BUILDINGS } from "@/data/hubMapData";

const TITLE_COUNT = BUILDINGS.filter((b) => b.kind === "arcade").length;

const ArcadeHUD = () => {
  return (
    <>
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <Link
          to="/"
          className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-full bg-surface-1/80 backdrop-blur-md border border-border text-xs font-display tracking-wider text-foreground hover:border-primary transition-colors"
        >
          <X className="w-4 h-4" />
          EXIT TO MENU
        </Link>
        <span className="pointer-events-auto px-3 py-2 rounded-full bg-surface-1/80 backdrop-blur-md border border-border text-xs font-display tracking-wider text-subtle-foreground">
          {TITLE_COUNT} TITLES
        </span>
      </div>
      <div className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-surface-1/60 text-xs text-subtle-foreground pointer-events-none">
        WASD / ARROWS TO MOVE · E TO ENTER · ESC TO EXIT
      </div>
    </>
  );
};

export default ArcadeHUD;
