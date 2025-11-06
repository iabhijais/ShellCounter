
import type { FC } from 'react';

const PlaceholderShellIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path 
            d="M12 9.5V14.5M9.5 12H14.5" 
            stroke="hsl(var(--muted-foreground))" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        <rect 
            x="7" 
            y="4" 
            width="10" 
            height="16" 
            rx="2" 
            stroke="hsl(var(--muted-foreground))" 
            strokeWidth="2" 
            strokeDasharray="2 2"
        />
    </svg>
);

export default PlaceholderShellIcon;
