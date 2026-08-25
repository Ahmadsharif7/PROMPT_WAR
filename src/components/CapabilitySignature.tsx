import React, { useEffect, useState } from 'react';
import { User, SkillCategory } from '../types';
import { SKILL_CATEGORIES_CONFIG } from '../data/mockData';

interface CapabilitySignatureProps {
  user: User;
  maxSkills?: number;
  className?: string;
}

export const CapabilitySignature: React.FC<CapabilitySignatureProps> = ({
  user,
  maxSkills = 6,
  className = '',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger skill bar fill animation on load
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 60);
    return () => clearTimeout(timeout);
  }, [user.id]);

  // Sort user skills by proficiency descending
  const sortedSkills = [...user.skills]
    .sort((a, b) => b.proficiency - a.proficiency)
    .slice(0, maxSkills);

  // Group by category to show category distribution
  const categoryStats = user.skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {} as Record<SkillCategory, number>);

  return (
    <div className={`glass-surface rounded-xl p-5 space-y-4 dark:bg-[#121216] dark:border-white/[0.08] ${className}`}>
      <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 dark:border-white/[0.08] pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C7355] dark:text-[#C8A578] font-bold">
            ARCHIVE // FOLIO
          </span>
          <h4 className="text-base font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] mt-0.5">
            Capability Signature
          </h4>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#8C7355] dark:bg-[#C8A578]" />
          <span className="text-[10px] font-mono text-[#5C564C] dark:text-[#9E9EA8] font-semibold uppercase">
            {user.experienceLevel} Tier
          </span>
        </div>
      </div>

      {/* Domain Category Spectrum Pills */}
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(categoryStats) as SkillCategory[]).map((cat) => {
          const config = SKILL_CATEGORIES_CONFIG[cat];
          return (
            <span
              key={cat}
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${config.borderClass} ${config.bgClass} ${config.textClass} dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-[#E2E2E6]`}
            >
              {cat} ({categoryStats[cat]})
            </span>
          );
        })}
      </div>

      {/* Individual Skill Power Meters with filling animation */}
      <div className="space-y-2.5 pt-1">
        {sortedSkills.map((skill, idx) => {
          const catConfig = SKILL_CATEGORIES_CONFIG[skill.category];
          const targetWidth = mounted ? `${skill.proficiency}%` : '0%';
          return (
            <div key={skill.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#38352F] dark:text-[#D4D4D8] flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: catConfig?.dotColor || '#8C7355' }}
                  />
                  {skill.name}
                </span>
                <span className="font-mono font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                  {skill.proficiency}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[#EFE8DC] dark:bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8C7355] to-[#1A1A1A] dark:from-[#C8A578] dark:to-[#F3F3F5] rounded-full"
                  style={{
                    width: targetWidth,
                    transition: 'width 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${idx * 70}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Capacity Telemetry */}
      <div className="pt-2 border-t border-[#1A1A1A]/10 dark:border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#767064] dark:text-[#82828F]">
        <span>Bandwidth: {user.weeklyAvailability}h/week</span>
        <span>{user.timezone}</span>
      </div>
    </div>
  );
};
