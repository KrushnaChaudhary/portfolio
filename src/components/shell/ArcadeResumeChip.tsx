import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { usePreferredMode } from "@/hooks/usePreferredMode";
import { preloadArcade } from "@/lib/preloadArcade";

// A returning arcade-mode visitor gets an opt-in resume chip, never an
// auto-redirect — a redirect on "/" would eat deep links (e.g. the
// GitHub Pages 404.html fallback resolving /portfolio/project/looper).
const ArcadeResumeChip = () => {
  const { mode } = usePreferredMode();
  const [dismissed, setDismissed] = useState(false);

  if (mode !== "arcade" || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="panel-raised flex items-center gap-3 pl-4 pr-2 py-2.5">
        <Link
          to="/arcade"
          onMouseEnter={preloadArcade}
          onFocus={preloadArcade}
          className="font-display text-xs tracking-wider text-primary hover:underline"
        >
          CONTINUE IN ARCADE MODE →
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ArcadeResumeChip;
