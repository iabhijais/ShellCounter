"use client";

import React, { useMemo } from 'react';

const CONFETTI_COUNT = 150;
const COLORS = ['#F44336', '#2196F3', '#009688', '#FFEB3B', '#FFFFFF'];

type ConfettiPieceProps = {
  style: React.CSSProperties;
};

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ style }) => (
  <div className="absolute w-2 h-4" style={style}></div>
);

export const Confetti: React.FC = () => {
  const confettiPieces = useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }).map((_, index) => {
      const color = COLORS[index % COLORS.length];
      const left = `${Math.random() * 100}vw`;
      const animationDelay = `${Math.random() * 2}s`;
      const animationDuration = `${Math.random() * 3 + 2}s`;
      const transform = `rotate(${Math.random() * 360}deg)`;

      const style: React.CSSProperties = {
        backgroundColor: color,
        left,
        animationName: 'confetti-fall',
        animationTimingFunction: 'linear',
        animationIterationCount: '1',
        animationFillMode: 'forwards',
        animationDelay,
        animationDuration,
        transform,
      };

      return <ConfettiPiece key={index} style={style} />;
    });
  }, []);

  return (
    <div className="fixed top-[-10vh] left-0 w-full h-full pointer-events-none z-50">
      {confettiPieces}
    </div>
  );
};
