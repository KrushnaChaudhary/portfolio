import { ReactNode } from "react";
import TopRail from "./TopRail";
import SystemFooter from "./SystemFooter";

const ConsoleShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopRail />
      {children}
      <SystemFooter />
    </div>
  );
};

export default ConsoleShell;
