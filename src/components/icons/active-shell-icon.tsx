import type { FC } from 'react';

const ActiveShellIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 2C10.3431 2 9 3.34315 9 5V15C9 16.6569 10.3431 18 12 18C13.6569 18 15 16.6569 15 15V5C15 3.34315 13.6569 2 12 2Z"
      fill="#F44336"
    />
    <rect x="8" y="17" width="8" height="5" rx="1" fill="#FFC107" />
  </svg>
);

export default ActiveShellIcon;
