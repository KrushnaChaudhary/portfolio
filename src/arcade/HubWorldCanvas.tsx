import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HubEngine3D } from "./engine/HubEngine3D";
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

  const posterSources = useMemo(() => {
    const map: Record<string, string> = {};
    for (const b of BUILDINGS) {
      const image = b.kind === "arcade" ? projectsData[b.slug]?.image : null;
      if (image) map[b.slug] = image;
    }
    return map;
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
      posterSources,
    });
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
      canvas.remove();
    };
    // Mount-once: navigate and posterSources are stable for the lifetime of this route.
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
      />
    </div>
  );
};

export default memo(HubWorldCanvas);
