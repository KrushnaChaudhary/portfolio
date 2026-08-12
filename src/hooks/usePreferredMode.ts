import { useEffect, useState } from "react";

export type SiteMode = "ui" | "arcade";
const STORAGE_KEY = "kc.mode";

function readStoredMode(): SiteMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === "arcade" ? "arcade" : "ui";
  } catch {
    return "ui";
  }
}

export function usePreferredMode() {
  const [mode, setMode] = useState<SiteMode>(readStoredMode);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ui") === "1") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      setMode("ui");
    }
  }, []);

  const markArcade = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "arcade");
    } catch {
      // ignore
    }
    setMode("arcade");
  };

  const markUi = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "ui");
    } catch {
      // ignore
    }
    setMode("ui");
  };

  return { mode, markArcade, markUi };
}

// Arcade is hidden (not force-disabled — direct /arcade hits still get the
// reduced-motion fallback screen) on constrained devices or when the user
// has asked for reduced motion.
export function useArcadeAvailable(): boolean {
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cores = navigator.hardwareConcurrency ?? 8;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const constrained = cores <= 2 || (memory !== undefined && memory <= 2);
    setAvailable(!reducedMotion && !constrained);
  }, []);

  return available;
}
