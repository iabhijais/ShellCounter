
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActiveShellIcon from "./icons/active-shell-icon";
import BlankShellIcon from "./icons/blank-shell-icon";
import type { ShellType } from "@/app/page";
import { TipPopover } from "./tip-popover";
import PlaceholderShellIcon from "./icons/placeholder-shell-icon";
import TippedActiveShellIcon from "./icons/tipped-active-shell-icon";
import TippedBlankShellIcon from "./icons/tipped-blank-shell-icon";

type RoundHistoryProps = {
  history: ShellType[];
  totalShells: number;
  tips: Record<number, ShellType>;
  onSetTip: (roundIndex: number, type: ShellType | null) => void;
};

export function RoundHistory({ history, totalShells, tips, onSetTip }: RoundHistoryProps) {
  if (totalShells === 0) return null;

  const historyItems = Array.from({ length: totalShells }, (_, index) => {
    const roundNumber = index + 1;
    const shell = history[index];
    const tip = tips[index];

    if (shell) {
      // Round has occurred
      return (
        <div key={index} className="flex flex-col items-center gap-1 animate-flip-in" style={{ animationDelay: `${index * 50}ms` }}>
          <span className="text-xs font-mono text-muted-foreground">{roundNumber}</span>
          <div className="w-8 h-8 p-1 bg-card rounded-md">
            {shell === "active" ? <ActiveShellIcon /> : <BlankShellIcon />}
          </div>
        </div>
      );
    }

    // Future round
    const getIcon = () => {
      if (tip === "active") return <TippedActiveShellIcon />;
      if (tip === "blank") return <TippedBlankShellIcon />;
      return <PlaceholderShellIcon />;
    };

    return (
        <TipPopover key={index} onSelect={(type) => onSetTip(index, type)} hasTip={!!tip}>
            <button className="flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-ring rounded-md p-1">
              <span className="text-xs font-mono text-muted-foreground">{roundNumber}</span>
              <div className="w-8 h-8 p-1 bg-card/50 hover:bg-card rounded-md transition-colors">
                {getIcon()}
              </div>
            </button>
        </TipPopover>
    );
  });

  return (
    <Card className="w-full bg-black/20 backdrop-blur-lg border-white/10 rounded-2xl p-4 mt-0">
      <CardHeader className="p-2 pt-0 md:p-4 md:pt-0">
        <CardTitle className="text-center font-headline text-xl md:text-2xl text-shadow-lg">Magazine</CardTitle>
      </CardHeader>
      <CardContent className="p-2 pb-0 md:p-4 md:pt-0">
        <div className="flex flex-wrap justify-center gap-2">
          {historyItems}
        </div>
      </CardContent>
    </Card>
  );
}
