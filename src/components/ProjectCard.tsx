import React, { useState } from 'react';
import { Project, MatchResult } from '../types';
import { useApp } from '../context/AppContext';
import { CompatibilitySignal } from './CompatibilitySignal';
import { SkillTag } from './SkillTag';
import {
  Users,
  Clock,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  GitMerge,
  Send,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProjectCardProps {
  project: Project;
  match: MatchResult;
  onOpenDetails: (projectId: string) => void;
  onOpenSynthesis: (projectId: string) => void;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  match,
  onOpenDetails,
  onOpenSynthesis,
  index = 0,
}) => {
  const { currentUser, sendJoinRequest, requests } = useApp();
  const [isSending, setIsSending] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [showQuickRequestInput, setShowQuickRequestInput] = useState(false);

  // Check if current user is owner
  const isOwner = project.ownerId === currentUser.id;

  // Check if current user is already a member
  const isMember = project.currentMembers.some((m) => m.id === currentUser.id);

  // Check if request is already sent
  const existingRequest = requests.find(
    (r) => r.projectId === project.id && r.senderId === currentUser.id
  );

  const handleRequestJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOwner || isMember || existingRequest) return;

    if (!showQuickRequestInput) {
      setShowQuickRequestInput(true);
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      const success = sendJoinRequest(project.id, customMsg);
      setIsSending(false);
      setShowQuickRequestInput(false);
      if (success) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#8C7355', '#C8A578', '#1A1A1A'],
        });
      }
    }, 400);
  };

  return (
    <div
      onClick={() => onOpenDetails(project.id)}
      style={{
        animationDelay: `${Math.min(index * 70, 700)}ms`,
      }}
      className="editorial-card-interactive animate-card-entrance group rounded-xl p-6 cursor-pointer relative overflow-hidden flex flex-col justify-between dark:bg-[#121216] dark:border-white/[0.08]"
    >
      {/* Top Accent Box Corner motif */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-[#8C7355]/10 dark:bg-[#C8A578]/10 border-b border-l border-[#8C7355]/20 dark:border-[#C8A578]/20 pointer-events-none" />

      {/* Main Content Area */}
      <div>
        {/* Header Metadata Row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[11px] font-bold text-[#8C7355] dark:text-[#C8A578] tracking-widest uppercase">
                MISSION // {project.code}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#1A1A1A]/30 dark:bg-white/30" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFE8DC] dark:bg-white/[0.06] text-[#1A1A1A] dark:text-[#F3F3F5] font-medium">
                {project.type}
              </span>
              {isOwner && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8C7355]/15 dark:bg-[#C8A578]/20 text-[#8C7355] dark:text-[#C8A578] font-bold border border-[#8C7355]/30 dark:border-[#C8A578]/30">
                  Lead Director
                </span>
              )}
            </div>

            <h3 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] group-hover:text-[#8C7355] dark:group-hover:text-[#C8A578] transition-colors leading-snug">
              {project.title}
            </h3>
          </div>

          {/* Compatibility Signal Ring */}
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <CompatibilitySignal
              score={match.finalScore}
              size="md"
              showLabel={false}
              animate={true}
            />
          </div>
        </div>

        {/* Tagline / Description */}
        <p className="text-sm text-[#4A463E] dark:text-[#B8B8C2] line-clamp-2 mt-2.5 leading-relaxed font-sans">
          {project.tagline || project.description}
        </p>

        {/* Editorial Match Callout Box */}
        <div className="mt-4 p-3 rounded-lg bg-[#FAF8F5] dark:bg-white/[0.03] border-l-2 border-[#8C7355] dark:border-[#C8A578] border-y border-r border-[#1A1A1A]/10 dark:border-white/[0.06] flex items-start gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#8C7355] dark:text-[#C8A578] shrink-0 mt-0.5" />
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#8C7355] dark:text-[#C8A578] tracking-wider">
                Alignment: {match.complementarityTag}
              </span>
            </div>
            <p className="text-xs text-[#38352F] dark:text-[#D4D4D8] leading-snug font-sans">
              {match.explanation}
            </p>
          </div>
        </div>

        {/* Required Skills Pill Cloud */}
        <div className="mt-4 space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#767064] dark:text-[#82828F] font-bold">
            Required Capabilities
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
            {project.requiredSkills.map((skillName) => {
              const isMatched = match.breakdown.overlappingSkills.some(
                (s) => s.toLowerCase() === skillName.toLowerCase()
              );
              return (
                <SkillTag
                  key={skillName}
                  name={skillName}
                  isMatched={isMatched}
                  size="xs"
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Area: Team, Timeline, and Primary Action */}
      <div className="mt-6 pt-4 border-t border-[#1A1A1A]/10 dark:border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between text-xs text-[#5C564C] dark:text-[#9E9EA8] font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#8C7355] dark:text-[#C8A578]" />
              <span>
                {project.currentMembers.length}/{project.teamSize} builders
              </span>
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#767064] dark:text-[#82828F]" />
              <span>{project.weeklyHoursNeeded}h/wk</span>
            </span>
          </div>

          {/* Owner Avatar Stack */}
          <div className="flex items-center -space-x-1.5">
            {project.currentMembers.map((member) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                title={`${member.name} (${member.roleTitle})`}
                className="w-6 h-6 rounded-full object-cover ring-2 ring-[#FFFFFF] dark:ring-[#121216] border border-[#1A1A1A]/20 dark:border-white/20"
              />
            ))}
          </div>
        </div>

        {/* Quick Message Input if expanded */}
        {showQuickRequestInput && (
          <div
            className="pt-2 animate-in fade-in slide-in-from-top-2 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Why you're a great fit (optional note)..."
              className="w-full text-xs px-3 py-2 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#8C7355] dark:border-[#C8A578] text-[#1A1A1A] dark:text-[#F3F3F5] placeholder-[#767064] dark:placeholder-[#72727D] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578]"
              autoFocus
            />
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-1">
          {/* Team Synthesis Inspector button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSynthesis(project.id);
            }}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#F3F3F5] bg-[#FAF8F5] dark:bg-white/[0.04] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] border border-[#1A1A1A]/15 dark:border-white/[0.08] transition-all flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355] dark:focus-visible:ring-[#C8A578]"
            title="Inspect full-team role synthesis & complementary gaps"
          >
            <GitMerge className="w-3.5 h-3.5 text-[#8C7355] dark:text-[#C8A578]" />
            <span>Squad Matrix</span>
          </button>

          {/* Join Request Button with scale + subtle glow on hover */}
          {isMember ? (
            <div className="flex-1 px-3 py-2 rounded-lg text-xs font-mono font-medium text-[#2D5A43] dark:text-[#6EE7B7] bg-[#EBF2EE] dark:bg-[#064E3B]/30 border border-[#4A6B56]/30 dark:border-[#059669]/30 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A43] dark:text-[#6EE7B7]" />
              <span>Squad Member</span>
            </div>
          ) : existingRequest ? (
            <div className="flex-1 px-3 py-2 rounded-lg text-xs font-mono font-medium text-[#8C7355] dark:text-[#C8A578] bg-[#FAF8F5] dark:bg-[#C8A578]/10 border border-[#8C7355]/30 dark:border-[#C8A578]/30 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8C7355] dark:text-[#C8A578]" />
              <span className="capitalize">{existingRequest.status.toLowerCase()} Request</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRequestJoin}
              disabled={isSending}
              className={`btn-shimmer btn-primary-action flex-1 px-3.5 py-2 rounded-lg text-xs font-serif font-semibold text-[#F9F7F2] dark:text-[#0A0A0C] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355] dark:focus-visible:ring-[#C8A578] flex items-center justify-center gap-1.5 ${
                showQuickRequestInput
                  ? 'bg-[#8C7355] dark:bg-[#C8A578]'
                  : 'bg-[#1A1A1A] dark:bg-[#F3F3F5] hover:bg-[#8C7355] dark:hover:bg-[#C8A578] shadow-sm'
              }`}
            >
              {isSending ? (
                <div className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
              ) : showQuickRequestInput ? (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Note</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-[#EFE8DC] dark:text-[#A88B68]" />
                  <span>Request to Join</span>
                </>
              )}
            </button>
          )}

          {/* Deep Details Link */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(project.id);
            }}
            className="p-2 rounded-lg bg-[#FAF8F5] dark:bg-white/[0.04] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] text-[#5C564C] dark:text-[#9E9EA8] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5] border border-[#1A1A1A]/15 dark:border-white/[0.08] transition-all"
            title="Open Complete Project Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
