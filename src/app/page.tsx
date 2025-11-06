
"use client";

import { useState, useCallback, useMemo } from "react";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";
import { ShellCounter } from "@/components/shell-counter";
import { ResetModal } from "@/components/reset-modal";
import { Confetti } from "@/components/confetti";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSounds } from "@/hooks/use-sounds";
import ActiveShellIcon from "@/components/icons/active-shell-icon";
import BlankShellIcon from "@/components/icons/blank-shell-icon";
import { RoundTracker } from "@/components/round-tracker";
import { PredictionChart } from "@/components/prediction-chart";
import { RoundHistory } from "@/components/round-history";
import { Card } from "@/components/ui/card";
import { TipPopover } from "@/components/tip-popover";

export type ShellType = "active" | "blank";

export default function Home() {
  const [totalActive, setTotalActive] = useState(3);
  const [totalBlank, setTotalBlank] = useState(3);
  const [activeSpent, setActiveSpent] = useState(0);
  const [blankSpent, setBlankSpent] = useState(0);
  const [history, setHistory] = useState<ShellType[]>([]);
  const [tips, setTips] = useState<Record<number, ShellType>>({});

  const [isResetModalOpen, setResetModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const { playActiveShellSound, playBlankShellSound, playResetSound, playToggleSound } = useSounds(soundEnabled);

  const remainingActive = totalActive - activeSpent;
  const remainingBlank = totalBlank - blankSpent;
  const remainingTotal = remainingActive + remainingBlank;
  const totalShells = totalActive + totalBlank;
  const currentRound = history.length + 1;

  const handleShellUsed = useCallback((type: ShellType) => {
    if (remainingTotal <= 0) return;

    if (type === "active") {
      if (remainingActive > 0) {
        setActiveSpent(c => c + 1);
        setHistory(h => [...h, "active"]);
        playActiveShellSound();
      }
    } else {
      if (remainingBlank > 0) {
        setBlankSpent(c => c + 1);
        setHistory(h => [...h, "blank"]);
        playBlankShellSound();
      }
    }
  }, [remainingActive, remainingBlank, remainingTotal, playActiveShellSound, playBlankShellSound]);


  const handleReset = useCallback((active: number, blank: number) => {
    setTotalActive(active);
    setTotalBlank(blank);
    setActiveSpent(0);
    setBlankSpent(0);
    setHistory([]);
    setTips({});
    setResetModalOpen(false);
    playResetSound();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  }, [playResetSound]);
  
  const handleSoundToggle = useCallback((checked: boolean) => {
    setSoundEnabled(checked);
    playToggleSound(checked);
  }, [playToggleSound]);

  const handleSetTip = useCallback((roundIndex: number, type: ShellType | null) => {
    setTips(prevTips => {
      const newTips = {...prevTips};
      if (type === null) {
        delete newTips[roundIndex];
      } else {
        newTips[roundIndex] = type;
      }
      return newTips;
    });
  }, []);

  // Check if current round has a tip
  const currentRoundTip = tips[history.length];

  const prediction = useMemo(() => {
    if (remainingTotal === 0) return { active: 0, blank: 0, text: "Round Over!" };
    
    // Check if there's a tip for the current round
    if (currentRoundTip === "active") {
      return { active: 100, blank: 0, text: "100% Chance of Active (Tipped)" };
    }
    if (currentRoundTip === "blank") {
      return { active: 0, blank: 100, text: "100% Chance of Blank (Tipped)" };
    }
    
    if (remainingActive === 0) return { active: 0, blank: 100, text: "100% Chance of Blank" };
    if (remainingBlank === 0) return { active: 100, blank: 0, text: "100% Chance of Active" };
    
    const activeChance = Math.round((remainingActive / remainingTotal) * 100);
    const blankChance = 100 - activeChance;
    
    return { active: activeChance, blank: blankChance, text: `${activeChance}% Active, ${blankChance}% Blank` };
  }, [remainingActive, remainingBlank, remainingTotal, currentRoundTip]);


  return (
    <>
      <main 
        className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      >
        <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
          <Label htmlFor="sound-toggle" className="flex items-center gap-2 cursor-pointer">
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            <span className="text-sm font-medium sr-only sm:not-sr-only">Sound</span>
          </Label>
          <Switch
            id="sound-toggle"
            checked={soundEnabled}
            onCheckedChange={handleSoundToggle}
            aria-label="Toggle sound effects"
          />
        </div>

        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter text-shadow-lg">
              ShellShock Counter
            </h1>
            <p className="text-sm text-muted-foreground mt-1 text-right pr-2">by hawkkeyed</p>
            <RoundTracker current={currentRound} total={totalShells} />
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <ShellCounter
                    label="Active Shells"
                    count={remainingActive}
                    onDecrement={() => handleShellUsed("active")}
                    icon={<ActiveShellIcon />}
                    buttonColor="bg-[#F44336]"
                    shadowColor="shadow-[#F44336]/30"
                    disabled={currentRoundTip === "blank"}
                />
                <ShellCounter
                    label="Blank Shells"
                    count={remainingBlank}
                    onDecrement={() => handleShellUsed("blank")}
                    icon={<BlankShellIcon />}
                    buttonColor="bg-[#2196F3]"
                    shadowColor="shadow-[#2196F3]/30"
                    disabled={currentRoundTip === "active"}
                />
            </div>
            
            <div className="lg:col-span-6 flex flex-col gap-4 md:gap-6">
              <TipPopover onSelect={() => {}} hasTip={false}>
                  <Card className="flex-grow w-full h-full bg-black/20 backdrop-blur-lg border-white/10 rounded-2xl p-4">
                      <h3 className="text-center font-headline text-2xl mb-2 text-shadow-lg">Prediction</h3>
                      <p className="text-center text-lg font-bold mb-4 text-accent">{prediction.text}</p>
                      <PredictionChart 
                          activePercentage={prediction.active}
                          blankPercentage={prediction.blank}
                      />
                  </Card>
              </TipPopover>
              <RoundHistory 
                history={history}
                totalShells={totalShells}
                tips={tips}
                onSetTip={handleSetTip}
              />
            </div>
          </div>
          
          <div className="w-full max-w-sm mt-4 md:mt-6">
             <Button 
                onClick={() => setResetModalOpen(true)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl font-bold text-lg py-6 shadow-lg transition-transform hover:scale-105 w-full h-20"
                >
                <RotateCcw className="mr-2 h-6 w-6"/>
                New Game
            </Button>
          </div>
        </div>

         <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <p className="text-8xl font-black text-white/5 -rotate-12 select-none">
            Abhay k bap ki app hai ye
          </p>
        </div>
      </main>

      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onReset={handleReset}
        currentActive={totalActive}
        currentBlank={totalBlank}
      />
      
      {showConfetti && <Confetti />}
    </>
  );
}
