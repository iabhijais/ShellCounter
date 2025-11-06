"use client";

import { AnimatedNumber } from "./animated-number";

type RoundTrackerProps = {
  current: number;
  total: number;
};

export function RoundTracker({ current, total }: RoundTrackerProps) {
    const isRoundOver = current > total;
  
    return (
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight text-shadow">
          {isRoundOver ? (
              "Round Over"
          ) : (
            <>
              Shell <AnimatedNumber value={current} /> of <AnimatedNumber value={total} />
            </>
          )}
        </h2>
      </div>
    );
  }
