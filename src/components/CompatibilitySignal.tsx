import React, { useEffect, useState, useRef } from 'react';

interface CompatibilitySignalProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
  showBreakdownPills?: boolean;
  sublabel?: string;
  animate?: boolean;
  className?: string;
}

export const CompatibilitySignal: React.FC<CompatibilitySignalProps> = ({
  score,
  size = 'md',
  showLabel = true,
  showBreakdownPills = false,
  sublabel,
  animate = true,
  className = '',
}) => {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [isCompleted, setIsCompleted] = useState(!animate);
  const animationFrameRef = useRef<number | null>(null);

  // Configuration by size
  const config = {
    sm: { diameter: 48, strokeWidth: 3.5, textSize: 'text-xs font-mono font-bold', subTextSize: 'text-[9px]' },
    md: { diameter: 72, strokeWidth: 4.5, textSize: 'text-lg font-serif font-bold', subTextSize: 'text-[10px]' },
    lg: { diameter: 96, strokeWidth: 5.5, textSize: 'text-2xl font-serif font-bold', subTextSize: 'text-xs' },
    hero: { diameter: 128, strokeWidth: 6.5, textSize: 'text-3xl font-serif font-bold', subTextSize: 'text-sm' },
  }[size];

  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!animate || prefersReducedMotion) {
      setDisplayScore(score);
      setIsCompleted(true);
      return;
    }

    // Ease-out-expo function over 500ms (within 400-600ms spec)
    const duration = 520;
    const startTime = performance.now();

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out-expo: 1 - 2^(-10t)
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.round(easeOutExpo * score);

      setDisplayScore(currentVal);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateCount);
      } else {
        setDisplayScore(score);
        setIsCompleted(true);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateCount);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [score, animate]);

  // Gradient selection by score tier with gradient colors
  const getScoreColor = () => {
    if (score >= 88) {
      return {
        gradId: 'scoreGradHighVibrant',
        text: 'text-[#1A1A1A] dark:text-[#F3F3F5]',
        tag: 'High Alignment',
      };
    }
    if (score >= 75) {
      return {
        gradId: 'scoreGradMidVibrant',
        text: 'text-[#5C564C] dark:text-[#E2E2E6]',
        tag: 'Strong Alignment',
      };
    }
    return {
      gradId: 'scoreGradBaseVibrant',
      text: 'text-[#767064] dark:text-[#B8B8C2]',
      tag: 'Viable Match',
    };
  };

  const scheme = getScoreColor();

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-full bg-[#FAF8F5] dark:bg-[#141418] border border-[#1A1A1A]/10 dark:border-white/[0.08] shadow-sm"
        style={{ width: config.diameter, height: config.diameter }}
      >
        <svg
          width={config.diameter}
          height={config.diameter}
          className="transform -rotate-90"
        >
          <defs>
            {/* High Tier Gradient: Radiant Gold to Bronze */}
            <linearGradient id="scoreGradHighVibrant" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5C06A" />
              <stop offset="50%" stopColor="#D49A45" />
              <stop offset="100%" stopColor="#8C7355" />
            </linearGradient>

            {/* Mid Tier Gradient: Emerald-Teal to Warm Bronze */}
            <linearGradient id="scoreGradMidVibrant" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#2BB381" />
              <stop offset="100%" stopColor="#A88B68" />
            </linearGradient>

            {/* Base Tier Gradient: Sapphire-Slate to Muted Bronze */}
            <linearGradient id="scoreGradBaseVibrant" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="60%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#6B7280" />
            </linearGradient>
          </defs>

          {/* Background Track Ring */}
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            className="stroke-black/[0.08] dark:stroke-white/[0.08]"
            strokeWidth={config.strokeWidth}
            fill="transparent"
          />

          {/* Animated Progress Gradient Ring */}
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            stroke={`url(#${scheme.gradId})`}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: isCompleted ? 'stroke-dashoffset 0.3s ease' : 'none',
            }}
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline">
            <span className={`${config.textSize} ${scheme.text} tracking-tight`}>
              {displayScore}
            </span>
            <span className="text-[10px] font-mono text-[#8C7355] dark:text-[#C8A578] ml-0.5 font-bold">%</span>
          </div>
          {size === 'hero' && (
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#767064] dark:text-[#82828F] -mt-1">
              Index
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <div className="mt-1.5 text-center">
          <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#5C564C] dark:text-[#9E9EA8]">
            {sublabel || scheme.tag}
          </div>
        </div>
      )}
    </div>
  );
};
