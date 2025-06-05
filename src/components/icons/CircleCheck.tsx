import React from 'react';

interface CircleCheckProps {
  className?: string;
}

export const CircleCheck: React.FC<CircleCheckProps> = ({ className }) => (
  <svg
    width="14"
    height="14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6.999.333C3.332.333.332 3.333.332 7c0 3.666 3 6.666 6.667 6.666 3.666 0 6.666-3 6.666-6.666 0-3.667-3-6.667-6.666-6.667zm2.8 5.533l-3.2 3.2a.644.644 0 0 1-.934 0L4.2 7.6a.644.644 0 0 1 0-.934.644.644 0 0 1 .933 0l1 1 2.733-2.733a.644.644 0 0 1 .934 0 .644.644 0 0 1 0 .933z"
      fill="#008083"
    />
  </svg>
); 