import { useEffect } from "react";
import { Link } from "react-router-dom";
import HubWorldCanvas from "@/arcade/HubWorldCanvas";
import { BUILDINGS } from "@/data/hubMapData";
import { projectsData } from "@/data/projectsData";
import { usePreferredMode, useArcadeAvailable } from "@/hooks/usePreferredMode";

const ArcadePage = () => {
  const { markArcade } = usePreferredMode();
  const available = useArcadeAvailable();
  const targets = BUILDINGS.filter((b) => b.kind !== "portal");

  useEffect(() => {
    markArcade();
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = `${window.location.origin}${import.meta.env.BASE_URL}`;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-background">
      <h1 className="sr-only">Arcade hub — walk to a building to open a project</h1>
      <ul className="sr-only">
        {targets.map((b) => (
          <li key={b.slug}>
            <Link to={b.target}>{projectsData[b.slug]?.title ?? b.sign}</Link>
          </li>
        ))}
      </ul>

      {available ? (
        <HubWorldCanvas />
      ) : (
        <div className="h-full overflow-y-auto px-6 py-16">
          <div className="max-w-2xl mx-auto">
            <Link to="/" className="text-sm text-primary hover:underline mb-6 inline-block">
              ← Back to menu
            </Link>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Arcade Hub</h2>
            <p className="text-muted-foreground mb-8">
              Animation is off (reduced motion). Here's every stop in the hub as a plain list.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {targets.map((b) => (
                <Link
                  key={b.slug}
                  to={b.target}
                  className="panel p-4 hover:border-primary/50 transition-colors"
                >
                  <p className="font-display text-sm font-semibold text-foreground">{b.sign}</p>
                  <p className="text-xs text-subtle-foreground mt-1 uppercase tracking-wider">
                    {b.kind === "arcade" ? "Project" : "Section"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArcadePage;
