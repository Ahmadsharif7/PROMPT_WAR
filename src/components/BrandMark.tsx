import React from 'react';

interface BrandMarkProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  size = 32,
  showText = true,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        {/* Editorial Accent Geometry */}
        <div className="absolute inset-0 bg-[#8C7355]/10 dark:bg-[#C8A578]/15 border border-[#8C7355]/30 dark:border-[#C8A578]/30 rounded-lg pointer-events-none" />
        
        {/* Editorial Archival Mark */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Converging Vector Alpha */}
          <path
            d="M8 10C13 10 16 14 20 20"
            className="stroke-[#1A1A1A] dark:stroke-[#F3F3F5]"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
          <circle cx="8" cy="10" r="2.5" className="fill-[#8C7355] dark:fill-[#C8A578]" />

          {/* Converging Vector Beta */}
          <path
            d="M32 30C27 30 24 26 20 20"
            className="stroke-[#1A1A1A] dark:stroke-[#F3F3F5]"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
          <circle cx="32" cy="30" r="2.5" className="fill-[#8C7355] dark:fill-[#C8A578]" />

          {/* Secondary Editorial Guidelines */}
          <path
            d="M32 10C28 13 24 16 20 20"
            className="stroke-[#8C7355] dark:stroke-[#C8A578]"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          <path
            d="M8 30C12 27 16 24 20 20"
            className="stroke-[#8C7355] dark:stroke-[#C8A578]"
            strokeWidth="1"
            strokeDasharray="2 3"
          />

          {/* Unified Synthesis Node */}
          <circle
            cx="20"
            cy="20"
            r="4"
            className="fill-[#1A1A1A] dark:fill-[#F3F3F5] stroke-[#F9F7F2] dark:stroke-[#0A0A0C]"
            strokeWidth="1.5"
          />
          <circle cx="20" cy="20" r="1.5" className="fill-[#F9F7F2] dark:fill-[#0A0A0C]" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-baseline gap-2 leading-none">
          <span className="font-serif font-bold text-xl tracking-tight text-[#1A1A1A] dark:text-[#F3F3F5]">
            ProjectMatch
          </span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C7355] dark:text-[#C8A578]">
            // SYNTHESIS
          </span>
        </div>
      )}
    </div>
  );
};
