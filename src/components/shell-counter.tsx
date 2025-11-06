"use client";

import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./animated-number";

interface Sparkle {
  id: string;
  createdAt: number;
  color: string;
  size: number;
  style: {
    top: string;
    left: string;
    animation: string;
  };
}

let sparkleIdCounter = 0;
const generateSparkle = (color: string): Sparkle => {
  const size = Math.random() * 20 + 10;
  sparkleIdCounter++;
  return {
    id: `sparkle-${Date.now()}-${sparkleIdCounter}`,
    createdAt: Date.now(),
    color,
    size,
    style: {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animation: `sparkle ${Math.random() * 500 + 500}ms ease-out forwards`,
    },
  };
};

type ShellCounterProps = {
  label: string;
  count: number;
  onDecrement: () => void;
  icon: ReactNode;
  buttonColor: string;
  shadowColor: string;
  disabled?: boolean;
};

export function ShellCounter({
  label,
  count,
  onDecrement,
  icon,
  buttonColor,
  shadowColor,
  disabled = false,
}: ShellCounterProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const prevCountRef = useRef(count);

  useEffect(() => {
    if (prevCountRef.current > count && count >= 0) {
        const newSparkles = Array.from({ length: 15 }, () => generateSparkle(buttonColor.includes("F44336") ? "#F44336" : "#2196F3"));
        setSparkles(prev => [...prev, ...newSparkles]);
        setTimeout(() => {
            setSparkles(currentSparkles => currentSparkles.filter(s => Date.now() - s.createdAt < 1000));
        }, 1000);
    }
    prevCountRef.current = count;
  }, [count, buttonColor]);

  return (
    <div className="relative bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between shadow-2xl h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10">{icon}</div>
        <h2 className="text-2xl font-semibold font-headline text-foreground/90">
          {label}
        </h2>
      </div>
      <div className="text-8xl lg:text-9xl font-bold font-mono text-white mb-6" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
        <AnimatedNumber value={count} />
      </div>
      <div className="relative w-full flex justify-center">
        <button
          onClick={onDecrement}
          disabled={disabled}
          className={cn(
            "relative w-28 h-28 md:w-32 md:h-32 rounded-full text-white font-bold text-xl flex items-center justify-center transition-all duration-200 transform focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-background",
            buttonColor,
            shadowColor,
            "shadow-2xl hover:shadow-[0_0_30px_5px] active:shadow-lg",
            disabled ? "opacity-50 cursor-not-allowed hover:shadow-2xl active:scale-100" : "active:scale-95"
          )}
          aria-label={`Decrement ${label}`}
        >
          <span className="text-5xl">-</span>
        </button>
        <div className="absolute inset-0 pointer-events-none">
          {sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="absolute"
              style={sparkle.style}
            >
              <svg
                width={sparkle.size}
                height={sparkle.size}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: sparkle.color }}
              >
                <path d="M8 0L9.48528 6.51472L16 8L9.48528 9.48528L8 16L6.51472 9.48528L0 8L6.51472 6.51472L8 0Z" fill="currentColor" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
