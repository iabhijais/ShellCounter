"use client";

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Card } from './ui/card';

type PredictionChartProps = {
  activePercentage: number;
  blankPercentage: number;
};

const CustomBarLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  const radius = 10;

  return (
    <g>
      <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle">
        {`${value}%`}
      </text>
    </g>
  );
};


export function PredictionChart({ activePercentage, blankPercentage }: PredictionChartProps) {
  const data = useMemo(() => {
    return [
      { name: 'Active', value: activePercentage },
      { name: 'Blank', value: blankPercentage },
    ];
  }, [activePercentage, blankPercentage]);

  return (
    <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            barCategoryGap="20%"
            >
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis type="category" dataKey="name" hide />
            <Bar dataKey="value" radius={[10, 10, 10, 10]} background={{ fill: 'rgba(255, 255, 255, 0.1)', radius: 10 }}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Active' ? '#F44336' : '#2196F3'} />
                ))}
            </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
