"use client";

import { useEffect, useState } from "react";

type AnimatedNumberProps = {
  value: number;
};

export function AnimatedNumber({ value }: AnimatedNumberProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (value !== currentValue) {
      setKey(prevKey => prevKey + 1);
      setCurrentValue(value);
    }
  }, [value, currentValue]);

  return (
    <div className="inline-block" style={{ perspective: '100px' }}>
      <span key={key} className="inline-block animate-flip-in">
        {currentValue}
      </span>
    </div>
  );
}
