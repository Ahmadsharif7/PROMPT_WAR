import React from 'react';
import { useApp } from '../../context/AppContext';
import { CompatibilitySignal } from '../CompatibilitySignal';
import { ProjectCard } from '../ProjectCard';
import { CapabilitySignature } from '../CapabilitySignature';
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  Compass,
  ChevronRight,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    users,
    projects,
    allMatches,
    setActiveTab,
    setSelectedProjectId,
    setSynthesisModalProjectId,
    setEngineModalOpen,
  } = useApp();

  // Top 3 highest compatibility projects for current user
  const topProjects = allMatches.slice(0, 3);
  const highestMatch = allMatches[0];

  // Recommended peer collaborators (excluding currentUser)
  const peerCollaborators = users
    .filter((u) => u.id !== currentUser.id)
    .slice(0, 4);

  return (
    <div className="space-y-10 pb-16">
      {/* SECTION 1: COMMAND CENTER HERO */}
      <section className="relative rounded-2xl bg-[#FFFFFF] dark:bg-[#121216] p-6 sm:p-10 overflow-hidden border border-[#1A1A1A]/15 dark:border-white/[0.08] shadow-sm">
        {/* Editorial Accent Geometry */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#8C7355]/10 dark:bg-[#C8A578]/10 border-b border-l border-[#8C7355]/20 dark:border-[#C8A578]/20 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded bg-[#EFE8DC] dark:bg-white/[0.06] text-[#8C7355] dark:text-[#C8A578] border border-[#8C7355]/20 dark:border-[#C8A578]/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C7355] dark:bg-[#C8A578]" />
                DISPATCH // INTELLIGENCE
              </span>
              <span className="text-[11px] font-mono text-[#767064] dark:text-[#82828F] uppercase tracking-wider">
                VOL. 24 EDITION
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] tracking-tight leading-tight">
              Welcome back,{' '}
              <span className="text-[#8C7355] dark:text-[#C8A578] italic font-normal">
                {currentUser.name}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#4A463E] dark:text-[#B8B8C2] leading-relaxed font-sans">
              Discover missions calibrated to your capabilities. ProjectMatch has identified{' '}
              <strong className="text-[#1A1A1A] dark:text-[#F3F3F5] font-bold">{allMatches.length} matching missions</strong>{' '}
              configured for your <span className="text-[#8C7355] dark:text-[#C8A578] font-mono font-medium">{currentUser.roleTitle}</span> profile.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('projects')}
                className="btn-shimmer btn-primary-action px-5 py-2.5 rounded-lg text-xs sm:text-sm font-serif font-semibold text-[#F9F7F2] dark:text-[#0A0A0C] bg-[#1A1A1A] dark:bg-[#F3F3F5] hover:bg-[#8C7355] dark:hover:bg-[#C8A578] shadow-sm flex items-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355] dark:focus-visible:ring-[#C8A578]"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Matching Field</span>
              </button>

              <button
                onClick={() => setEngineModalOpen(true)}
                className="px-4 py-2.5 rounded-lg text-xs sm:text-sm font-mono font-bold text-[#1A1A1A] dark:text-[#F3F3F5] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] bg-[#FAF8F5] dark:bg-white/[0.04] border border-[#1A1A1A]/15 dark:border-white/[0.08] flex items-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355] dark:focus-visible:ring-[#C8A578]"
              >
                <Sparkles className="w-4 h-4 text-[#8C7355] dark:text-[#C8A578]" />
                <span>Calibrate Vector Weights</span>
              </button>
            </div>
          </div>

          {/* MATCH FIELD HIGH-POTENTIAL SIGNAL CARD */}
          {highestMatch && (
            <div
              onClick={() => setSelectedProjectId(highestMatch.project.id)}
              className="bg-[#FAF8F5] dark:bg-[#16161C] p-5 sm:p-6 rounded-xl border border-[#8C7355]/40 dark:border-[#C8A578]/40 hover:border-[#8C7355] dark:hover:border-[#C8A578] shadow-sm cursor-pointer transition-all duration-300 group shrink-0 lg:max-w-xs w-full"
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[#8C7355] dark:text-[#C8A578] uppercase tracking-widest font-bold text-[10px]">
                  Prime Compatibility
                </span>
                <span className="flex items-center gap-1 text-[#2D5A43] dark:text-[#6EE7B7] text-[10px] font-mono font-bold">
                  <TrendingUp className="w-3 h-3" />
                  +18% fit
                </span>
              </div>

              <div className="flex items-center gap-4 my-2">
                <CompatibilitySignal
                  score={highestMatch.match.finalScore}
                  size="md"
                  showLabel={false}
                  animate={true}
                />
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-[#767064] dark:text-[#82828F] uppercase tracking-wider">
                    MISSION // {highestMatch.project.code}
                  </div>
                  <h4 className="text-base font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] group-hover:text-[#8C7355] dark:group-hover:text-[#C8A578] transition-colors truncate">
                    {highestMatch.project.title}
                  </h4>
                  <span className="text-[11px] text-[#8C7355] dark:text-[#C8A578] font-mono block truncate font-medium">
                    {highestMatch.match.complementarityTag}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A]/10 dark:border-white/[0.08] flex items-center justify-between text-xs font-mono text-[#5C564C] dark:text-[#9E9EA8] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F3F3F5]">
                <span>View Full Telemetry</span>
                <ChevronRight className="w-4 h-4 text-[#8C7355] dark:text-[#C8A578] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: HIGHEST COMPATIBILITY MISSIONS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#8C7355] dark:text-[#C8A578]">
              CURATED SELECTION
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
              Recommended Missions
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('projects')}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#8C7355] dark:text-[#C8A578] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5] transition-colors uppercase tracking-wider"
          >
            <span>View All ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProjects.map(({ project, match }, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              match={match}
              index={idx}
              onOpenDetails={(id) => setSelectedProjectId(id)}
              onOpenSynthesis={(id) => setSynthesisModalProjectId(id)}
            />
          ))}
        </div>
      </section>

      {/* SECTION 3: CAPABILITY SIGNATURE & COMPLEMENTARY COLLABORATORS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1 & 2: Capability Signature Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#8C7355] dark:text-[#C8A578]">
                BUILDER PROFILE
              </div>
              <h2 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                Your Capability Spectrum
              </h2>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className="text-xs font-mono font-bold text-[#8C7355] dark:text-[#C8A578] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5] uppercase tracking-wider"
            >
              Edit Profile
            </button>
          </div>

          <CapabilitySignature user={currentUser} maxSkills={6} />
        </div>

        {/* Column 3: High-Potential Collaborators Network */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#8C7355] dark:text-[#C8A578]">
                PEER REGISTRY
              </div>
              <h2 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                Complementary Peers
              </h2>
            </div>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-[#121216] rounded-xl border border-[#1A1A1A]/10 dark:border-white/[0.08] p-4 space-y-3 shadow-sm">
            {peerCollaborators.map((peer) => (
              <div
                key={peer.id}
                className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-white/[0.03] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.06] border border-[#1A1A1A]/10 dark:border-white/[0.06] flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={peer.avatar}
                    alt={peer.name}
                    className="w-10 h-10 rounded-lg object-cover border border-[#1A1A1A]/15 dark:border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#1A1A1A] dark:text-[#F3F3F5] truncate">
                      {peer.name}
                    </div>
                    <div className="text-[11px] text-[#5C564C] dark:text-[#9E9EA8] truncate font-sans">
                      {peer.roleTitle}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-[#8C7355] dark:text-[#C8A578] font-semibold">
                        {peer.weeklyAvailability}h/wk
                      </span>
                      <span className="text-[10px] font-mono text-[#767064] dark:text-[#82828F]">
                        {peer.experienceLevel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFE8DC] dark:bg-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] border border-[#1A1A1A]/10 dark:border-white/[0.08]">
                    {peer.skills[0]?.name || 'Builder'}
                  </span>
                </div>
              </div>
            ))}

            <button
              onClick={() => setActiveTab('projects')}
              className="w-full py-2 rounded-lg text-xs font-mono font-bold text-center text-[#5C564C] dark:text-[#9E9EA8] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5] bg-[#FAF8F5] dark:bg-white/[0.04] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] border border-[#1A1A1A]/10 dark:border-white/[0.08] transition-colors uppercase tracking-wider"
            >
              Discover Squad Openings →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
