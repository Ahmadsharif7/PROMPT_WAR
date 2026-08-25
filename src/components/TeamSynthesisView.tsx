import React from 'react';
import { Project, User } from '../types';
import { useApp } from '../context/AppContext';
import { analyzeTeamSynthesis } from '../engine/matching';
import { SkillTag } from './SkillTag';
import {
  GitMerge,
  Users,
  CheckCircle2,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TeamSynthesisViewProps {
  project: Project;
  onClose?: () => void;
}

export const TeamSynthesisView: React.FC<TeamSynthesisViewProps> = ({
  project,
}) => {
  const { users, sendJoinRequest, currentUser } = useApp();

  const synthesis = analyzeTeamSynthesis(project, users);

  const handleInvite = (candidateUser: User, roleName: string) => {
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#8C7355', '#C8A578', '#1A1A1A'],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Team Synergy Score */}
      <div className="rounded-xl p-6 relative overflow-hidden bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/10 dark:border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#EFE8DC] dark:bg-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] border border-[#1A1A1A]/15 dark:border-white/[0.08] flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <GitMerge className="w-3.5 h-3.5 text-[#8C7355] dark:text-[#C8A578]" />
                SQUAD SYNTHESIS MATRIX
              </span>
              <span className="font-mono text-xs text-[#767064] dark:text-[#82828F]">
                MISSION // {project.code}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm text-[#4A463E] dark:text-[#B8B8C2] mt-1 max-w-2xl font-sans">
              {synthesis.synthesisSummary}
            </p>
          </div>

          {/* Squad Readiness Metric Gauge */}
          <div className="shrink-0 p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#121216] border border-[#1A1A1A]/10 dark:border-white/[0.08] shadow-sm flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#767064] dark:text-[#82828F] font-bold">
                Readiness Index
              </div>
              <div className="text-2xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                {synthesis.overallTeamSynergy}%
              </div>
              <div className="text-[10px] font-mono text-[#2D5A43] dark:text-[#6EE7B7] font-semibold">
                {synthesis.rolesCovered}/{synthesis.totalRolesNeeded} Roles Covered
              </div>
            </div>

            {/* Progress Circle Badge */}
            <div className="w-14 h-14 rounded-full border-4 border-[#EFE8DC] dark:border-white/[0.08] border-t-[#8C7355] dark:border-t-[#C8A578] border-r-[#1A1A1A] dark:border-r-[#F3F3F5] flex items-center justify-center font-mono text-xs font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
              {synthesis.coveragePercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Role Composition Matrix Tree */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#8C7355] dark:text-[#C8A578]" />
            <span>Domain Role Breakdown & Coverage</span>
          </h3>
          <span className="text-xs font-mono text-[#767064] dark:text-[#82828F]">
            Skills & bandwidth synthesis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {synthesis.roleCoverage.map((role, idx) => {
            const isFilled = !!role.assignedBuilder;
            const isCurrentUser = role.assignedBuilder?.id === currentUser.id;

            return (
              <div
                key={role.roleName}
                className={`rounded-xl p-5 border transition-all ${
                  isFilled
                    ? 'border-[#2D5A43]/30 dark:border-[#059669]/30 bg-[#FAF8F5] dark:bg-[#18181F]'
                    : 'border-[#1A1A1A]/10 dark:border-white/[0.08] bg-[#FFFFFF] dark:bg-[#121216] hover:border-[#8C7355]/40 dark:hover:border-[#C8A578]/40'
                }`}
              >
                {/* Role Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFE8DC] dark:bg-white/[0.08] text-[#767064] dark:text-[#9E9EA8]">
                        ROLE 0{idx + 1}
                      </span>
                      {isFilled ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EBF2EE] dark:bg-[#064E3B]/30 text-[#2D5A43] dark:text-[#6EE7B7] border border-[#4A6B56]/30 dark:border-[#059669]/30 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          Assigned
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8F5] dark:bg-[#C8A578]/10 text-[#8C7355] dark:text-[#C8A578] border border-[#8C7355]/30 dark:border-[#C8A578]/30 font-bold">
                          Vacant — Seeking
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                      {role.roleName}
                    </h4>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-mono text-[#767064] dark:text-[#82828F] uppercase">Fit Signal</div>
                    <div className="text-sm font-mono font-bold text-[#8C7355] dark:text-[#C8A578]">
                      {role.fitScore}%
                    </div>
                  </div>
                </div>

                {/* Target Skill Repertoire */}
                <div className="space-y-1.5 mb-4">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#767064] dark:text-[#82828F] font-bold">
                    Required Competencies
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {role.targetSkills.map((skill) => (
                      <SkillTag key={skill} name={skill} size="xs" />
                    ))}
                  </div>
                </div>

                {/* Assigned Member Card OR Candidate Recommendations */}
                {isFilled && role.assignedBuilder ? (
                  <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#121216] border border-[#2D5A43]/20 dark:border-[#059669]/20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={role.assignedBuilder.avatar}
                        alt={role.assignedBuilder.name}
                        className="w-9 h-9 rounded-lg object-cover border border-[#2D5A43]/40 dark:border-[#059669]/40 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#1A1A1A] dark:text-[#F3F3F5] truncate flex items-center gap-1.5">
                          {role.assignedBuilder.name}
                          {isCurrentUser && (
                            <span className="text-[9px] px-1 rounded bg-[#EFE8DC] dark:bg-white/[0.08] text-[#8C7355] dark:text-[#C8A578] font-mono">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#767064] dark:text-[#82828F] truncate">
                          {role.assignedBuilder.roleTitle}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#2D5A43] dark:text-[#6EE7B7] font-bold shrink-0">
                      {role.assignedBuilder.weeklyAvailability}h/wk
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono uppercase text-[#8C7355] dark:text-[#C8A578] flex items-center gap-1 font-bold">
                      <Sparkles className="w-3 h-3 text-[#8C7355] dark:text-[#C8A578]" />
                      <span>Recommended Candidates</span>
                    </div>

                    <div className="space-y-1.5">
                      {role.recommendedCandidates.map(({ user: candUser, fitScore }) => {
                        const isCandMe = candUser.id === currentUser.id;
                        return (
                          <div
                            key={candUser.id}
                            className="p-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#121216] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.06] border border-[#1A1A1A]/10 dark:border-white/[0.08] flex items-center justify-between gap-3 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={candUser.avatar}
                                alt={candUser.name}
                                className="w-7 h-7 rounded-md object-cover border border-[#1A1A1A]/15 dark:border-white/10 shrink-0"
                              />
                              <div className="min-w-0 truncate">
                                <div className="text-xs font-bold text-[#1A1A1A] dark:text-[#F3F3F5] truncate flex items-center gap-1">
                                  {candUser.name}
                                  {isCandMe && (
                                    <span className="text-[9px] px-1 rounded bg-[#EFE8DC] dark:bg-white/[0.08] text-[#8C7355] dark:text-[#C8A578] font-mono">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-[#767064] dark:text-[#82828F] truncate font-mono">
                                  {candUser.experienceLevel} • {candUser.weeklyAvailability}h/wk
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                                {fitScore}%
                              </span>

                              {isCandMe ? (
                                <button
                                  onClick={() => sendJoinRequest(project.id, `Applying for ${role.roleName}`)}
                                  className="btn-primary-action px-2.5 py-1 rounded-md text-[11px] font-serif font-semibold bg-[#1A1A1A] dark:bg-[#F3F3F5] hover:bg-[#8C7355] dark:hover:bg-[#C8A578] text-[#F9F7F2] dark:text-[#0A0A0C] shadow-sm"
                                >
                                  Apply
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleInvite(candUser, role.roleName)}
                                  className="px-2 py-1 rounded-md text-[11px] font-mono text-[#1A1A1A] dark:text-[#F3F3F5] hover:bg-[#FAF8F5] dark:hover:bg-white/[0.04] bg-[#FFFFFF] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.1] flex items-center gap-1 transition-all"
                                  title={`Invite ${candUser.name} to this role`}
                                >
                                  <UserPlus className="w-3 h-3 text-[#8C7355] dark:text-[#C8A578]" />
                                  <span className="hidden sm:inline">Invite</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Synthesis Principle Callout */}
      <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-white/[0.03] border-l-2 border-[#8C7355] dark:border-[#C8A578] border-y border-r border-[#1A1A1A]/10 dark:border-white/[0.06] flex items-start gap-3">
        <div className="text-xs text-[#38352F] dark:text-[#D4D4D8] leading-relaxed font-sans">
          <strong className="text-[#1A1A1A] dark:text-[#F3F3F5] font-bold">
            Synthesis Principle:
          </strong>{' '}
          ProjectMatch assembles teams by maximizing complementary coverage across Design,
          Data/Systems, Machine Learning, and Strategy. Each added builder elevates overall squad synergy.
        </div>
      </div>
    </div>
  );
};
