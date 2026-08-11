// Static Tailwind class map. Never build class names from data with template
// literals (`bg-${x}/10`) — Tailwind's scanner can't see those and drops them
// from the production build. Every branch here must be a literal string.
//
// NOTE: these reference the current neon-* palette (src/index.css /
// tailwind.config.ts). The design-token rewrite replaces that palette wholesale
// and this map gets updated alongside it — the point of this file is that the
// classes stay literal and grep-able through that change, not frozen forever.
export type Accent = "cyan" | "purple" | "gold" | "pink";

export const ACCENT: Record<Accent, { icon: string; wash: string; chip: string }> = {
  cyan: {
    icon: "text-neon-cyan",
    wash: "bg-neon-cyan/10",
    chip: "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20",
  },
  purple: {
    icon: "text-neon-purple",
    wash: "bg-neon-purple/10",
    chip: "bg-neon-purple/10 text-neon-purple border border-neon-purple/20",
  },
  gold: {
    icon: "text-neon-gold",
    wash: "bg-neon-gold/10",
    chip: "bg-neon-gold/10 text-neon-gold border border-neon-gold/20",
  },
  pink: {
    icon: "text-neon-pink",
    wash: "bg-neon-pink/10",
    chip: "bg-neon-pink/10 text-neon-pink border border-neon-pink/20",
  },
};
