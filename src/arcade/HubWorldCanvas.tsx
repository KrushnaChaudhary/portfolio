import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HubEngine3D } from "./engine/HubEngine3D";
import { HologramSpec } from "./engine/hologram";
import { BUILDINGS } from "@/data/hubMapData";
import { projectsData } from "@/data/projectsData";
import Joystick from "./Joystick";
import InteractPrompt from "./InteractPrompt";
import ArcadeHUD from "./ArcadeHUD";

const HubWorldCanvas = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HubEngine3D | null>(null);
  const navigate = useNavigate();
  const [nearestSlug, setNearestSlug] = useState<string | null>(null);

  const hologramSpecs = useMemo<HologramSpec[]>(() => {
    // Only project (arcade) buildings get the rich hologram treatment —
    // kiosk/portal keep a plain billboard sign (see scene3d.ts) since they
    // have no cover art and don't need a projector stage of their own.
    return BUILDINGS.filter((b) => b.kind === "arcade").map((b) => {
      const project = projectsData[b.slug];
      const meta = project?.meta;
      const statLine = meta
        ? [meta.year, meta.engine, meta.platforms.join("/"), meta.status].filter(Boolean).join(" · ")
        : "";
      // Cover first, then up to two gallery shots — capped at three total so
      // the slideshow cycles at a readable pace rather than crawling through
      // a whole project's screenshots.
      const images = [project?.image, ...(project?.gallery ?? [])].filter((url): url is string => Boolean(url)).slice(0, 3);
      return {
        slug: b.slug,
        title: project?.title ?? b.sign,
        statLine,
        building: b,
        images,
      };
    });
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // The canvas is created per mount rather than being a JSX element React
    // owns. Teardown calls forceContextLoss() to release the WebGL context
    // (browsers cap concurrent contexts), which permanently kills that canvas
    // — so reusing the same DOM node on a later mount would hand three.js a
    // dead context and throw. A fresh canvas each time makes that impossible.
    const canvas = document.createElement("canvas");
    canvas.className = "w-full h-full block";
    host.appendChild(canvas);

    const engine = new HubEngine3D(canvas, {
      onProximityChange: setNearestSlug,
      onNavigate: (target) => navigate(target),
      hologramSpecs,
    });
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
      canvas.remove();
    };
    // Mount-once: navigate and hologramSpecs are stable for the lifetime of this route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nearestBuilding = nearestSlug ? BUILDINGS.find((b) => b.slug === nearestSlug) ?? null : null;

  return (
    <div className="relative w-full h-full">
      <div ref={hostRef} className="absolute inset-0" />
      <ArcadeHUD />
      <InteractPrompt building={nearestBuilding} />
      <Joystick
        onVector={(vec) => engineRef.current?.setJoystickVector(vec)}
        onInteract={() => engineRef.current?.triggerInteract()}
        onJump={() => engineRef.current?.triggerJump()}
      />
    </div>
  );
};

export default memo(HubWorldCanvas);
