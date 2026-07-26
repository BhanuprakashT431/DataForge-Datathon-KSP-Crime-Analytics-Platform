import React from 'react';

export const PoliceBadge = ({ size = 32, className = '' }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Base Shield */}
    <path d="M100 10 C30 10, 10 40, 10 80 C10 140, 60 170, 100 190 C140 170, 190 140, 190 80 C190 40, 170 10, 100 10 Z" fill="url(#blueGrad)" stroke="#eab308" strokeWidth="6" />
    <path d="M100 20 C40 20, 20 45, 20 80 C20 135, 65 160, 100 178 C135 160, 180 135, 180 80 C180 45, 160 20, 100 20 Z" fill="none" stroke="#fcd34d" strokeWidth="2" strokeDasharray="6 6" />
    
    {/* Inner Star */}
    <path d="M100 40 L115 75 L150 75 L120 95 L130 130 L100 110 L70 130 L80 95 L50 75 L85 75 Z" fill="#eab308" stroke="#fef08a" strokeWidth="2"/>
    
    {/* Center Core */}
    <circle cx="100" cy="91" r="10" fill="#1e3a8a" stroke="#fcd34d" strokeWidth="3" />

    <defs>
      <linearGradient id="blueGrad" x1="100" y1="10" x2="100" y2="190" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e3a8a" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
    </defs>
  </svg>
);
