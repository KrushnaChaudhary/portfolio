// Shared so both the lazy route (App.tsx) and the hover/focus preload
// trigger (TopRail) reference the same dynamic import — the module loader
// caches it, so calling this twice does not refetch.
export const preloadArcade = () => import("@/pages/Arcade");
