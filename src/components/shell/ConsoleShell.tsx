import { ReactNode } from "react";
import TopRail from "./TopRail";
import SystemFooter from "./SystemFooter";
import ArcadeResumeChip from "./ArcadeResumeChip";

const ConsoleShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopRail />
      {children}
      <SystemFooter />
      <ArcadeResumeChip />
    </div>
  );
};

export default ConsoleShell;
