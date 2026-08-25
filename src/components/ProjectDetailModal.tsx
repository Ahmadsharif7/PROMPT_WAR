import React, { useState } from 'react';
import { Project } from '../types';
import { useApp } from '../context/AppContext';
import { CompatibilitySignal } from './CompatibilitySignal';
import { SkillTag } from './SkillTag';
import { TeamSynthesisView } from './TeamSynthesisView';
import {
  X,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Send,
  GitMerge,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  const { currentUser, getProjectMatch, sendJoinRequest, requests } = useApp();
  const [activeTab, setActiveTab] = useState<'match' | 'synthesis'>('match');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const match = getProjectMatch(project);
  const { breakdown } = match;

  const isOwner = project.ownerId === currentUser.id;
  const isMember = project.currentMembers.some((m) => m.id === currentUser.id);
  const existingRequest = requests.find(
    (r) => r.projectId === project.id && r.senderId === currentUser.id
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOwner || isMember || existingRequest) return;

    setIsSending(true);
    setTimeout(() => {
      sendJoinRequest(project.id, message);
      setIsSending(false);
      setSentSuccess(true);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#8C7355', '#C8A578', '#1A1A1A'],
      });
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#FFFFFF] dark:bg-[#121216] rounded-2xl overflow-hidden shadow-2xl border border-[#1A1A1A]/15 dark:border-white/[0.1] my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]/10 dark:border-white/[0.08] bg-[#FAF8F5] dark:bg-[#18181F]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#EFE8DC] dark:bg-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] border border-[#1A1A1A]/15 dark:border-white/[0.08] uppercase tracking-wider">
              MISSION // {project.code}
            </span>
            <span className="text-xs font-mono text-[#767064] dark:text-[#82828F]">
              {project.type}
            </span>
          </div>

          {/* Tab Switcher: Compatibility vs Team Synthesis */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#EFE8DC]/80 dark:bg-white/[0.04] border border-[#1A1A1A]/10 dark:border-white/[0.08]">
            <button
              onClick={() => setActiveTab('match')}
              className={`px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === 'match'
                  ? 'bg-[#FFFFFF] dark:bg-[#1E1E26] text-[#1A1A1A] dark:text-[#F3F3F5] shadow-sm border border-[#1A1A1A]/10 dark:border-white/[0.1]'
                  : 'text-[#5C564C] dark:text-[#9E9EA8] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5]'
              }`}
            >
              Alignment Matrix
            </button>
            <button
              onClick={() => setActiveTab('synthesis')}
              className={`px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'synthesis'
                  ? 'bg-[#1A1A1A] dark:bg-[#F3F3F5] text-[#F9F7F2] dark:text-[#0A0A0C] shadow-sm'
                  : 'text-[#5C564C] dark:text-[#9E9EA8] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5]'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Squad Synthesis</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#FFFFFF] dark:bg-[#18181F] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] text-[#767064] dark:text-[#9E9EA8] hover:text-[#1A1A1A] dark:hover:text-white border border-[#1A1A1A]/10 dark:border-white/[0.08] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355] dark:focus-visible:ring-[#C8A578]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-[#FFFFFF] dark:bg-[#121216]">
          {activeTab === 'synthesis' ? (
            <TeamSynthesisView project={project} />
          ) : (
            <>
              {/* Project Hero Row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1A1A1A]/10 dark:border-white/[0.08]">
                <div className="space-y-2 max-w-2xl">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] tracking-tight">
                    {project.title}
                  </h1>
                  <p className="text-base text-[#4A463E] dark:text-[#B8B8C2] leading-relaxed font-sans">
                    {project.tagline}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#5C564C] dark:text-[#9E9EA8] pt-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#8C7355] dark:text-[#C8A578]" />
                      <span>{project.timeline}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#767064] dark:text-[#82828F]" />
                      <span>{project.weeklyHoursNeeded}h/week needed</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#8C7355] dark:text-[#C8A578]" />
                      <span>
                        {project.currentMembers.length}/{project.teamSize} builders assembled
                      </span>
                    </span>
                  </div>
                </div>

                {/* Compatibility Hero Signal */}
                <div className="shrink-0 p-5 rounded-xl bg-[#FAF8F5] dark:bg-[#18181F] flex flex-col items-center justify-center border border-[#1A1A1A]/10 dark:border-white/[0.08] shadow-sm">
                  <CompatibilitySignal
                    score={match.finalScore}
                    size="lg"
                    showLabel={true}
                    sublabel={match.complementarityTag}
                    animate={true}
                  />
                  <div className="text-[10px] font-mono text-[#767064] dark:text-[#82828F] mt-2 text-center uppercase tracking-wider">
                    Weighted Vector Index
                  </div>
                </div>
              </div>

              {/* Dynamic Match Reason Box */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] dark:bg-white/[0.03] border-l-3 border-[#8C7355] dark:border-[#C8A578] border-y border-r border-[#1A1A1A]/10 dark:border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-[#8C7355] dark:text-[#C8A578] font-mono text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Primary Alignment Thesis</span>
                </div>
                <p className="text-sm sm:text-base text-[#1A1A1A] dark:text-[#F3F3F5] leading-relaxed font-sans">
                  {match.explanation}
                </p>
              </div>

              {/* Four Vector Score Component Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#8C7355] dark:text-[#C8A578]">
                    Compatibility Matrix Breakdown
                  </h3>
                  <span className="text-xs font-mono text-[#767064] dark:text-[#82828F]">
                    Deterministic Scoring
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Vector 1: Skills (45%) */}
                  <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/10 dark:border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#38352F] dark:text-[#D4D4D8] font-semibold">Skills (45%)</span>
                      <span className="font-mono font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                        {breakdown.skillsScore}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#EFE8DC] dark:bg-white/[0.08] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8C7355] to-[#1A1A1A] dark:from-[#C8A578] dark:to-[#F3F3F5] rounded-full"
                        style={{ width: `${breakdown.skillsScore}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-[#767064] dark:text-[#82828F] font-mono">
                      {breakdown.overlappingSkills.length} of {project.requiredSkills.length} skills matched
                    </div>
                  </div>

                  {/* Vector 2: Interests (20%) */}
                  <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/10 dark:border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#38352F] dark:text-[#D4D4D8] font-semibold">Interests (20%)</span>
                      <span className="font-mono font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                        {breakdown.interestsScore}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#EFE8DC] dark:bg-white/[0.08] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#A88B68] to-[#8C7355] dark:from-[#C8A578] dark:to-[#D4B58A] rounded-full"
                        style={{ width: `${breakdown.interestsScore}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-[#767064] dark:text-[#82828F] font-mono">
                      {breakdown.sharedInterests.length} shared domains
                    </div>
                  </div>

                  {/* Vector 3: Availability (20%) */}
                  <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/10 dark:border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#38352F] dark:text-[#D4D4D8] font-semibold">Availability (20%)</span>
                      <span className="font-mono font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                        {breakdown.availabilityScore}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#EFE8DC] dark:bg-white/[0.08] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#5C564C] to-[#8C7355] dark:from-[#9E9EA8] dark:to-[#C8A578] rounded-full"
                        style={{ width: `${breakdown.availabilityScore}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-[#767064] dark:text-[#82828F] font-mono">
                      {currentUser.weeklyAvailability}h vs {project.weeklyHoursNeeded}h target
                    </div>
                  </div>

                  {/* Vector 4: Experience (15%) */}
                  <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/10 dark:border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#38352F] dark:text-[#D4D4D8] font-semibold">Experience (15%)</span>
                      <span className="font-mono font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                        {breakdown.experienceScore}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#EFE8DC] dark:bg-white/[0.08] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1A1A1A] to-[#8C7355] dark:from-[#F3F3F5] dark:to-[#C8A578] rounded-full"
                        style={{ width: `${breakdown.experienceScore}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-[#767064] dark:text-[#82828F] font-mono">
                      {currentUser.experienceLevel} vs {project.targetExperience}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Detailed Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/10 dark:border-white/[0.08] space-y-3">
                  <h4 className="text-xs font-mono uppercase text-[#8C7355] dark:text-[#C8A578] font-bold tracking-wider">
                    Direct Skill Overlap
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {breakdown.overlappingSkills.length > 0 ? (
                      breakdown.overlappingSkills.map((s) => (
                        <SkillTag key={s} name={s} isMatched={true} />
                      ))
                    ) : (
                      <span className="text-xs text-[#767064] dark:text-[#82828F] font-mono">
                        No direct match with required stack.
                      </span>
                    )}
                  </div>

                  {breakdown.missingSkills.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[10px] font-mono uppercase text-[#767064] dark:text-[#82828F] mb-1.5">
                        Mission Needs Coverage For:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {breakdown.missingSkills.map((s) => (
                          <SkillTag key={s} name={s} isMissing={true} size="xs" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 rounded-xl bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/10 dark:border-white/[0.08] space-y-3">
                  <h4 className="text-xs font-mono uppercase text-[#5C564C] dark:text-[#9E9EA8] font-bold tracking-wider">
                    Complementary Value Added
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {breakdown.complementarySkills.map((s) => (
                      <SkillTag key={s} name={s} size="sm" />
                    ))}
                  </div>

                  <div className="pt-2">
                    <div className="text-[10px] font-mono uppercase text-[#767064] dark:text-[#82828F] mb-1.5">
                      Shared Passions & Themes:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.interests.map((int) => {
                        const isShared = currentUser.interests.some(
                          (ci) => ci.toLowerCase() === int.toLowerCase()
                        );
                        return (
                          <span
                            key={int}
                            className={`text-xs font-mono px-2.5 py-1 rounded border ${
                              isShared
                                ? 'bg-[#F2ECE1] dark:bg-[#C8A578]/15 text-[#1A1A1A] dark:text-[#F3F3F5] border-[#8C7355]/40 dark:border-[#C8A578]/40 font-semibold'
                                : 'bg-[#FFFFFF] dark:bg-white/[0.04] text-[#767064] dark:text-[#82828F] border-[#1A1A1A]/10 dark:border-white/[0.08]'
                            }`}
                          >
                            {int} {isShared && '✦'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-[#8C7355] dark:text-[#C8A578] font-bold tracking-wider">
                  Project Mission & Context
                </h4>
                <div className="p-5 rounded-xl bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/10 dark:border-white/[0.08] text-sm text-[#38352F] dark:text-[#D4D4D8] leading-relaxed font-sans">
                  {project.description}
                </div>
              </div>

              {/* Current Team Members */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-[#8C7355] dark:text-[#C8A578] font-bold tracking-wider">
                  Current Squad ({project.currentMembers.length} Members)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.currentMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/10 dark:border-white/[0.08] flex items-center gap-3"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#1A1A1A]/20 dark:border-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#1A1A1A] dark:text-[#F3F3F5] truncate flex items-center gap-1.5">
                          {member.name}
                          {member.id === project.ownerId && (
                            <span className="text-[9px] px-1 rounded bg-[#EFE8DC] dark:bg-white/[0.08] text-[#8C7355] dark:text-[#C8A578] font-mono font-bold">
                              Lead
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#5C564C] dark:text-[#9E9EA8] truncate">
                          {member.roleTitle}
                        </div>
                        <div className="text-[10px] font-mono text-[#8C7355] dark:text-[#C8A578] mt-0.5 font-medium">
                          {member.weeklyAvailability}h/week capacity
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="p-4 sm:p-6 border-t border-[#1A1A1A]/10 dark:border-white/[0.08] bg-[#FAF8F5] dark:bg-[#18181F] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-[#5C564C] dark:text-[#9E9EA8]">
            {isMember
              ? 'You are already a member of this project squad.'
              : isOwner
              ? 'You are the creator and squad lead for this mission.'
              : existingRequest
              ? `Join request submitted (${existingRequest.status}).`
              : 'Transmitting will share your capability signature with the lead.'}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isMember ? (
              <div className="px-5 py-2.5 rounded-lg bg-[#EBF2EE] dark:bg-[#064E3B]/30 text-[#2D5A43] dark:text-[#6EE7B7] font-mono text-xs font-bold border border-[#4A6B56]/30 dark:border-[#059669]/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Squad Member</span>
              </div>
            ) : existingRequest || sentSuccess ? (
              <div className="px-5 py-2.5 rounded-lg bg-[#F2ECE1] dark:bg-[#C8A578]/15 text-[#8C7355] dark:text-[#C8A578] font-mono text-xs font-bold border border-[#8C7355]/40 dark:border-[#C8A578]/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Request Transmitted ({existingRequest?.status || 'PENDING'})</span>
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Note to mission lead..."
                  className="text-xs px-3 py-2 rounded-lg bg-[#FFFFFF] dark:bg-[#121216] border border-[#1A1A1A]/15 dark:border-white/[0.1] text-[#1A1A1A] dark:text-[#F3F3F5] placeholder-[#767064] dark:placeholder-[#72727D] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578] w-48 sm:w-64"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="btn-shimmer btn-primary-action px-5 py-2.5 rounded-lg text-xs font-serif font-semibold text-[#F9F7F2] dark:text-[#0A0A0C] bg-[#1A1A1A] dark:bg-[#F3F3F5] hover:bg-[#8C7355] dark:hover:bg-[#C8A578] shadow-sm flex items-center gap-2 shrink-0 transition-transform active:scale-95"
                >
                  {isSending ? (
                    <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
