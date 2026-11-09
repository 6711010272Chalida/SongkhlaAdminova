import React from 'react';

interface WaveMotifProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Minimal abstract wave motif inspired by Songkhla Lake and Gulf of Thailand.
 * Elegant geometric lines with Deep Navy (#0B1F36) & subtle Gold (#C5A45A) accent.
 * Purely abstract geometric lines; NOT an official government seal or insignia.
 */
export const WaveMotif: React.FC<WaveMotifProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0B1F36] to-[#102C4C] p-1.5 shadow-sm border border-[#C5A45A]/35 ${sizeClasses[size]} ${className}`}>
      <svg 
        viewBox="0 0 36 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#C5A45A]"
      >
        {/* Subtle geometric wave arcs representing water crossroads (Songkhla Lake & Coastal Gulf) */}
        <path 
          d="M4 13C8 10 12 10 16 13C20 16 24 16 28 13C30 11.5 32 11.5 32 11.5" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
        />
        <path 
          d="M4 19C8 16 12 16 16 19C20 22 24 22 28 19C30 17.5 32 17.5 32 17.5" 
          stroke="currentColor" 
          strokeWidth="1.8" 
          strokeOpacity="0.85" 
          strokeLinecap="round" 
        />
        <path 
          d="M4 25C8 22 12 22 16 25C20 28 24 28 28 25C30 23.5 32 23.5 32 23.5" 
          stroke="currentColor" 
          strokeWidth="1.4" 
          strokeOpacity="0.5" 
          strokeLinecap="round" 
        />
        <circle cx="28" cy="9" r="1.8" fill="#C5A45A" />
      </svg>
    </div>
  );
};
