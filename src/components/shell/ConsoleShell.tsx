import { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import TopRail from "./TopRail";
import SystemFooter from "./SystemFooter";
import ArcadeResumeChip from "./ArcadeResumeChip";
import { ScrollProgress } from "@/components/fx/Motion";

const ConsoleShell = ({ children }: { children: ReactNode }) => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background text-foreground">
        <ScrollProgress />
        <TopRail />
        {children}
        <SystemFooter />
        <ArcadeResumeChip />
      </div>
    </MotionConfig>
  );
};

export default ConsoleShell;
