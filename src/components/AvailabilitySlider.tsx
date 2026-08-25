import React from 'react';

interface AvailabilitySliderProps {
  value: number; // 0-40 hours
  onChange: (hours: number) => void;
  targetHours?: number;
  label?: string;
  min?: number;
  max?: number;
  className?: string;
}

export const AvailabilitySlider: React.FC<AvailabilitySliderProps> = ({
  value,
  onChange,
  targetHours,
  label = 'Weekly Availability',
  min = 4,
  max = 40,
  className = '',
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const targetPercentage = targetHours ? ((targetHours - min) / (max - min)) * 100 : null;

  return (
    <div className={`space-y-2 select-none ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold tracking-wider uppercase text-[#38352F] dark:text-[#D4D4D8] flex items-center gap-2">
          <span>{label}</span>
          {targetHours && (
            <span className="text-[11px] text-[#8C7355] dark:text-[#C8A578] font-normal lowercase">
              (target: {targetHours}h/wk)
            </span>
          )}
        </label>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-base font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
            {value}
          </span>
          <span className="font-mono text-xs text-[#767064] dark:text-[#82828F]">hours/week</span>
        </div>
      </div>

      <div className="relative flex items-center h-8">
        {/* Background Track */}
        <div className="absolute inset-x-0 h-2 rounded-full bg-[#EFE8DC] dark:bg-white/[0.08] border border-[#1A1A1A]/10 dark:border-white/[0.08] overflow-hidden">
          {/* Target Indicator Marker if provided */}
          {targetPercentage !== null && (
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#8C7355] dark:bg-[#C8A578] z-10"
              style={{ left: `${targetPercentage}%` }}
              title={`Target Requirement: ${targetHours}h`}
            />
          )}

          {/* Filled Progress Bar with Editorial Bronze to Ink */}
          <div
            className="h-full bg-gradient-to-r from-[#8C7355] to-[#1A1A1A] dark:from-[#C8A578] dark:to-[#F3F3F5] transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Real Native Range Input overlay for accessibility & touch */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
        />

        {/* Custom Editorial Thumb */}
        <div
          className="absolute w-5 h-5 rounded-full bg-[#FFFFFF] dark:bg-[#1E1E24] border-2 border-[#1A1A1A] dark:border-white shadow-md pointer-events-none transform -translate-x-1/2 flex items-center justify-center transition-all duration-75"
          style={{ left: `${percentage}%` }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#8C7355] dark:bg-[#C8A578]" />
        </div>
      </div>

      <div className="flex justify-between text-[10px] font-mono text-[#767064] dark:text-[#82828F]">
        <span>Part-time ({min}h)</span>
        <span>Standard (15h)</span>
        <span>Sprint ({max}h)</span>
      </div>
    </div>
  );
};
