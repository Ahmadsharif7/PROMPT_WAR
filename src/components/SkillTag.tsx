import React from 'react';
import { SkillCategory } from '../types';
import { SKILL_CATEGORIES_CONFIG } from '../data/mockData';

// Map common skill names to default categories if not explicitly passed
const SKILL_CATEGORY_LOOKUP: Record<string, SkillCategory> = {
  React: 'Frontend',
  'Tailwind CSS': 'Frontend',
  TypeScript: 'Frontend',
  JavaScript: 'Frontend',
  'Three.js': 'Frontend',
  HTML: 'Frontend',
  CSS: 'Frontend',
  'Node.js': 'Backend',
  Python: 'Backend',
  Go: 'Backend',
  'FastAPI': 'Backend',
  'C++': 'Backend',
  Rust: 'Backend',
  GraphQL: 'Backend',
  'UI/UX Design': 'Design',
  Figma: 'Design',
  'Design Systems': 'Design',
  'Product Design': 'Design',
  PostgreSQL: 'Data',
  'Data Engineering': 'Data',
  Redis: 'Data',
  'Apache Kafka': 'Data',
  SQL: 'Data',
  'Machine Learning': 'AI/ML',
  'PyTorch': 'AI/ML',
  'Computer Vision': 'AI/ML',
  'TensorFlow': 'AI/ML',
  'NLP': 'AI/ML',
  'Product Strategy': 'Management',
  'User Research': 'Management',
  'Agile': 'Management',
  'React Native': 'Mobile',
  Swift: 'Mobile',
  Flutter: 'Mobile',
  Docker: 'DevOps',
  Kubernetes: 'DevOps',
  AWS: 'DevOps',
  Security: 'Security',
  Web3: 'Security',
};

interface SkillTagProps {
  name: string;
  category?: SkillCategory;
  proficiency?: number;
  isMatched?: boolean;
  isMissing?: boolean;
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const SkillTag: React.FC<SkillTagProps> = ({
  name,
  category,
  proficiency,
  isMatched = false,
  isMissing = false,
  interactive = false,
  selected = false,
  onClick,
  size = 'sm',
  className = '',
}) => {
  const cat = category || SKILL_CATEGORY_LOOKUP[name] || 'Frontend';
  const styling = SKILL_CATEGORIES_CONFIG[cat] || SKILL_CATEGORIES_CONFIG.Frontend;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-xs gap-2',
  }[size];

  return (
    <span
      onClick={interactive ? onClick : undefined}
      className={`inline-flex items-center rounded-md font-mono font-medium whitespace-nowrap shrink-0 transition-all duration-200 border ${
        interactive ? 'cursor-pointer select-none' : ''
      } ${
        selected
          ? 'bg-[#1A1A1A] dark:bg-[#F3F3F5] border-[#1A1A1A] dark:border-[#F3F3F5] text-[#F9F7F2] dark:text-[#0A0A0C] shadow-sm scale-[1.02]'
          : isMatched
          ? 'bg-[#F2ECE1] dark:bg-[#C8A578]/15 border-[#8C7355] dark:border-[#C8A578]/50 text-[#1A1A1A] dark:text-[#F3F3F5] font-semibold'
          : isMissing
          ? 'bg-[#F5EAEA] dark:bg-[#7F1D1D]/20 border-[#8A3A3A]/20 dark:border-[#EF4444]/30 text-[#8A3A3A] dark:text-[#FCA5A5] line-through opacity-75'
          : `${styling.bgClass} ${styling.borderClass} ${styling.textClass} dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-[#E2E2E6] hover:border-[#1A1A1A]/30 dark:hover:border-white/20`
      } ${sizeClasses} ${className}`}
    >
      {/* Category Indicator Dot */}
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{
          backgroundColor: selected
            ? '#8C7355'
            : isMatched
            ? '#8C7355'
            : isMissing
            ? '#8A3A3A'
            : styling.dotColor,
        }}
      />
      
      <span className="truncate max-w-[140px]">{name}</span>

      {proficiency !== undefined && (
        <span className="text-[10px] opacity-75 font-mono ml-0.5">
          {proficiency}%
        </span>
      )}
    </span>
  );
};
