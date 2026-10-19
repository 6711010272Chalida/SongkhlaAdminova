import React from 'react';

interface WaveMotifProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Minimal abstract wave motif inspired by Songkhla Lake and the Gulf of Thailand coastline.
 * Purely abstract geometric lines; NOT an official government seal or insignia.
 */
export const WaveMotif: React.FC<WaveMotifProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative flex items-center justify-center rounded-lg bg-gradient-to-br from-[#0F2038] to-[#1E3A60] p-1.5 shadow-sm border border-amber-500/30 ${sizeClasses[size]} ${className}`}>
      <svg 
        viewBox="0 0 36 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-amber-300"
      >
        {/* Subtle geometric wave arcs representing water crossroads (Lake & Sea) */}
        <path 
          d="M4 14C8 11 12 11 16 14C20 17 24 17 28 14C30 12.5 32 12.5 32 12.5" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
        />
        <path 
          d="M4 20C8 17 12 17 16 20C20 23 24 23 28 20C30 18.5 32 18.5 32 18.5" 
          stroke="currentColor" 
          strokeWidth="1.8" 
          strokeOpacity="0.85" 
          strokeLinecap="round" 
        />
        <path 
          d="M4 26C8 23 12 23 16 26C20 29 24 29 28 26C30 24.5 32 24.5 32 24.5" 
          stroke="currentColor" 
          strokeWidth="1.4" 
          strokeOpacity="0.5" 
          strokeLinecap="round" 
        />
        <circle cx="28" cy="10" r="1.8" fill="#FDE68A" />
      </svg>
    </div>
  );
};
