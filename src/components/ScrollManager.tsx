import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// How long to keep retrying for a hash target that has not mounted yet.
// /arcade is lazy(), so navigating /arcade -> /#skills unmounts a Suspense
// boundary and the anchor is not in the DOM on this effect's first tick.
const MAX_RETRY_FRAMES = 60; // ~1s at 60fps

export const ScrollManager = () => {
  // `key` matters: without it, activating the same hash twice in a row is a
  // no-op because pathname and hash are unchanged. Router gives each push a
  // fresh key.
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let raf = 0;
    let tries = 0;

    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        // scrollIntoView honours the anchors' `scroll-mt-14`, so the fixed
        // 56px top rail is accounted for automatically. A manual
        // scrollTo(offsetTop) would ignore scroll-margin and land under it.
        el.scrollIntoView({ behavior: "instant", block: "start" });
        return;
      }
      if (tries++ < MAX_RETRY_FRAMES) {
        raf = requestAnimationFrame(attempt);
      }
    };

    attempt();
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash, key]);

  return null;
};
