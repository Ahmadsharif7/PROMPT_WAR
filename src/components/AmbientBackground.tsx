import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#F9F7F2] dark:bg-[#0A0A0C] transition-colors duration-300">
      {/* Light Mode Archival Paper Gradient Base */}
      <div className="dark:hidden absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#FFFFFF_0%,_#F9F7F2_55%,_#F2ECE1_100%)]" />

      {/* Dark Mode Deep Stellar Archival Base */}
      <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#14141A_0%,_#0A0A0C_55%,_#060608_100%)]" />

      {/* Atmospheric Editorial Washes (Light: Ochre/Warm Sienna, Dark: Luminous Bronze/Amber/Indigo) */}
      <div className="absolute -top-32 -left-20 w-[550px] h-[550px] rounded-full bg-[#8C7355]/[0.06] dark:bg-[#C8A578]/[0.08] blur-[120px] animate-blob-1" />
      <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-[#A89078]/[0.05] dark:bg-[#9E7D52]/[0.06] blur-[140px] animate-blob-2" />
      <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] rounded-full bg-[#D5C7B4]/[0.08] dark:bg-[#2A231C]/[0.15] blur-[130px] animate-blob-3" />

      {/* Subtle Editorial Ruling Grid */}
      <div className="absolute inset-0 bg-tech-grid bg-radial-vignette opacity-70 dark:opacity-40" />

      {/* Fine Paper Border Rulers / Edge Detail */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#1A1A1A]/[0.04] dark:bg-white/[0.04]" />
      <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-[#1A1A1A]/[0.04] dark:bg-white/[0.04]" />
    </div>
  );
};
