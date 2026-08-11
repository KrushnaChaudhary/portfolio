// Static Tailwind class map. Never build class names from data with template
// literals (`bg-${x}/10`) — Tailwind's scanner can't see those and drops them
// from the production build. Every branch here must be a literal string.
export type Accent = "primary" | "neutral" | "warm";

export const ACCENT: Record<Accent, { icon: string; wash: string; chip: string }> = {
  primary: {
    icon: "text-primary",
    wash: "bg-primary/10",
    chip: "bg-primary/10 text-primary border border-primary/20",
  },
  neutral: {
    icon: "text-muted-foreground",
    wash: "bg-surface-2",
    chip: "bg-surface-2 text-muted-foreground border border-border",
  },
  warm: {
    icon: "text-warning",
    wash: "bg-warning/10",
    chip: "bg-warning/10 text-warning border border-warning/20",
  },
};
