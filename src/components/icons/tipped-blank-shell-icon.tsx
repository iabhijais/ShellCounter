
import type { FC } from 'react';

const TippedBlankShellIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g opacity="0.6">
        <path
        d="M15 15.5V6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6V15.5"
        stroke="#2196F3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
        <rect x="8" y="15" width="8" height="6" rx="1" stroke="#FFC107" strokeWidth="2" />
    </g>
    <path 
        d="M6 3L18 3" 
        stroke="hsl(var(--accent))" 
        strokeWidth="2" 
        strokeLinecap="round"
    />
  </svg>
);

export default TippedBlankShellIcon;
