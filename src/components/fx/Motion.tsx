import { ReactNode, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/** Thin bar at the very top that fills as the page scrolls. */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] bg-gradient-to-r from-primary via-primary to-warning"
    />
  );
};

/** Slowly drifting colour fields behind a section. Pure transforms, GPU-friendly. */
export const Aurora = () => {
  const reduce = useReducedMotion();
  const blob = (cls: string, style: React.CSSProperties, x: number[], y: number[], d: number) => (
    <motion.div
      aria-hidden
      className={`absolute rounded-full blur-3xl pointer-events-none ${cls}`}
      style={style}
      animate={reduce ? undefined : { x, y, scale: [1, 1.08, 1] }}
      transition={{ duration: d, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    />
  );
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {blob(
        "-top-48 -left-40 w-[40rem] h-[40rem] opacity-30",
        { background: "radial-gradient(circle, hsl(var(--primary) / 0.6), transparent 65%)" },
        [0, 80, -20],
        [0, 40, 90],
        18
      )}
      {blob(
        "-bottom-56 -right-40 w-[38rem] h-[38rem] opacity-25",
        { background: "radial-gradient(circle, hsl(var(--warning) / 0.55), transparent 65%)" },
        [0, -90, 20],
        [0, -50, -10],
        22
      )}
      {blob(
        "top-1/3 left-1/2 w-[26rem] h-[26rem] opacity-[0.12]",
        { background: "radial-gradient(circle, hsl(280 80% 65% / 0.7), transparent 65%)" },
        [0, -120, 60],
        [0, 60, -40],
        26
      )}
      <div className="absolute inset-0 noise" />
    </div>
  );
};

/** Headline that rises in word by word from behind a mask. */
export const RevealWords = ({ lines, delay = 0 }: { lines: ReactNode[][]; delay?: number }) => {
  let i = 0;
  return (
    <>
      {lines.map((words, li) => (
        <span key={li} className="block">
          {words.map((w, wi) => {
            const idx = i++;
            return (
              <span key={wi} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, delay: delay + idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  {w}
                  {wi < words.length - 1 ? " " : ""}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </>
  );
};

/** Card that tilts toward the cursor with spring physics. */
export const Tilt = ({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) => {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 200, damping: 18 });
  const glare = useMotionTemplate`radial-gradient(400px circle at ${useTransform(mx, (v) => v * 100)}% ${useTransform(
    my,
    (v) => v * 100
  )}%, hsl(0 0% 100% / 0.12), transparent 50%)`;

  return (
    <motion.div
      className={className}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      <div className="relative h-full">
        {children}
        {!reduce && (
          <motion.div aria-hidden className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: glare }} />
        )}
      </div>
    </motion.div>
  );
};

/** Gentle idle bob for floating elements. */
export const Float = ({
  children,
  className,
  amp = 8,
  duration = 6,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  amp?: number;
  duration?: number;
  delay?: number;
}) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      animate={reduce ? undefined : { y: [0, -amp, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

/** Element that leans toward the cursor while hovered. */
export const Magnetic = ({ children, className, strength = 0.25 }: { children: ReactNode; className?: string; strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
};

/** Wrapper that paints a soft spotlight under the cursor (used on project cards). */
export const Spotlight = ({ children, className }: { children: ReactNode; className?: string }) => {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const bg = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, hsl(var(--primary) / 0.14), transparent 70%)`;
  return (
    <div
      className={`relative ${className ?? ""}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        x.set(-500);
        y.set(-500);
      }}
    >
      {children}
      <motion.div aria-hidden className="absolute inset-0 rounded-[var(--radius)] pointer-events-none z-10" style={{ background: bg }} />
    </div>
  );
};

/** Parallax helper: returns a ref and motion values that fade/drift a section as it scrolls away. */
export const useExitParallax = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return { ref, y, opacity };
};
