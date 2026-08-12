import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HubEngine } from "./engine/HubEngine";
import { BUILDINGS } from "@/data/hubMapData";
import { projectsData } from "@/data/projectsData";
import Joystick from "./Joystick";
import InteractPrompt from "./InteractPrompt";
import ArcadeHUD from "./ArcadeHUD";

const HubWorldCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HubEngine | null>(null);
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new HubEngine(canvas, {
      onProximityChange: setNearestSlug,
      onNavigate: (target) => navigate(target),
      posterSources,
    });
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // Mount-once: navigate and posterSources are stable for the lifetime of this route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nearestBuilding = nearestSlug ? BUILDINGS.find((b) => b.slug === nearestSlug) ?? null : null;

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" />
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
