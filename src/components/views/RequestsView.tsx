import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RequestStatus } from '../../types';
import { CompatibilitySignal } from '../CompatibilitySignal';
import { SkillTag } from '../SkillTag';
import {
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  ArrowUpRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RequestsView: React.FC = () => {
  const {
    currentUser,
    requests,
    updateRequestStatus,
    setSelectedProjectId,
    setActiveTab,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'received' | 'sent'>('received');

  // Filter requests relative to current user
  const receivedRequests = requests.filter(
    (r) => r.projectOwnerId === currentUser.id || r.type === 'received'
  );

  const sentRequests = requests.filter(
    (r) => r.senderId === currentUser.id || r.type === 'sent'
  );

  const currentList = activeSubTab === 'received' ? receivedRequests : sentRequests;

  const handleStatusUpdate = (requestId: string, status: RequestStatus) => {
    updateRequestStatus(requestId, status);
    if (status === 'ACCEPTED') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#8C7355', '#C8A578', '#2D5A43'],
      });
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#EBF2EE] dark:bg-[#064E3B]/30 text-[#2D5A43] dark:text-[#6EE7B7] border border-[#4A6B56]/30 dark:border-[#059669]/30 flex items-center gap-1 uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ACCEPTED
          </span>
        );
      case 'DECLINED':
        return (
          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#F5EAEA] dark:bg-[#7F1D1D]/20 text-[#8A3A3A] dark:text-[#FCA5A5] border border-[#8A3A3A]/30 dark:border-[#EF4444]/30 flex items-center gap-1 uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5" />
            DECLINED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#FAF8F5] dark:bg-[#C8A578]/10 text-[#8C7355] dark:text-[#C8A578] border border-[#8C7355]/30 dark:border-[#C8A578]/30 flex items-center gap-1 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#8C7355] dark:text-[#C8A578]">
            TRANSMISSION LOG
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] tracking-tight">
            Join & Collaboration Requests
          </h1>
          <p className="text-sm text-[#4A463E] dark:text-[#B8B8C2] mt-1 font-sans">
            Review candidate applications for your missions and track outgoing transmissions.
          </p>
        </div>

        {/* Tab Toggle: Received vs Sent */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#EFE8DC]/80 dark:bg-white/[0.04] border border-[#1A1A1A]/10 dark:border-white/[0.08] self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('received')}
            className={`px-4 py-2 rounded-md text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'received'
                ? 'bg-[#1A1A1A] dark:bg-[#F3F3F5] text-[#F9F7F2] dark:text-[#0A0A0C] shadow-sm'
                : 'text-[#5C564C] dark:text-[#9E9EA8] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5]'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Received ({receivedRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sent')}
            className={`px-4 py-2 rounded-md text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'sent'
                ? 'bg-[#1A1A1A] dark:bg-[#F3F3F5] text-[#F9F7F2] dark:text-[#0A0A0C] shadow-sm'
                : 'text-[#5C564C] dark:text-[#9E9EA8] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Sent ({sentRequests.length})</span>
          </button>
        </div>
      </div>

      {/* Requests Timeline Cards List */}
      {currentList.length > 0 ? (
        <div className="space-y-4">
          {currentList.map((req) => (
            <div
              key={req.id}
              className="bg-[#FFFFFF] dark:bg-[#121216] rounded-xl p-6 border border-[#1A1A1A]/10 dark:border-white/[0.08] hover:border-[#8C7355]/40 dark:hover:border-[#C8A578]/40 shadow-sm transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Column: Avatar, User Details, Target Project */}
              <div className="flex items-start gap-4 min-w-0">
                <img
                  src={activeSubTab === 'received' ? req.senderAvatar : req.projectOwnerAvatar}
                  alt={activeSubTab === 'received' ? req.senderName : req.projectOwnerName}
                  className="w-12 h-12 rounded-lg object-cover border border-[#1A1A1A]/20 dark:border-white/20 shrink-0 mt-1"
                />

                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                      {activeSubTab === 'received' ? req.senderName : req.projectTitle}
                    </span>
                    <span className="text-xs font-mono text-[#767064] dark:text-[#82828F]">
                      • {activeSubTab === 'received' ? req.senderRoleTitle : `Lead: ${req.projectOwnerName}`}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFE8DC] dark:bg-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] font-semibold">
                      MISSION // {req.projectCode}
                    </span>
                  </div>

                  {/* Message Note */}
                  <div className="flex items-start gap-2 text-xs text-[#38352F] dark:text-[#D4D4D8] bg-[#FAF8F5] dark:bg-[#18181F] p-2.5 rounded-lg border border-[#1A1A1A]/10 dark:border-white/[0.06] max-w-xl font-sans">
                    <MessageSquare className="w-3.5 h-3.5 text-[#8C7355] dark:text-[#C8A578] shrink-0 mt-0.5" />
                    <p className="italic font-serif">"{req.message}"</p>
                  </div>

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {req.senderSkills.slice(0, 4).map((s) => (
                      <SkillTag key={s} name={s} size="xs" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Compatibility Signal, Status, Action Buttons */}
              <div className="flex flex-wrap items-center gap-6 self-end lg:self-center shrink-0">
                {/* Compatibility Signal Mini */}
                <div className="flex items-center gap-3">
                  <CompatibilitySignal
                    score={req.matchScore}
                    size="sm"
                    showLabel={false}
                    animate={false}
                  />
                  <div className="text-left font-mono">
                    <div className="text-[9px] text-[#767064] dark:text-[#82828F] uppercase tracking-wider">Alignment</div>
                    <div className="text-xs font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">{req.matchScore}% Score</div>
                  </div>
                </div>

                {/* Status Badge */}
                <div>{getStatusBadge(req.status)}</div>

                {/* Action Controls for Received */}
                {activeSubTab === 'received' && req.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusUpdate(req.id, 'ACCEPTED')}
                      className="btn-primary-action px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-[#F9F7F2] dark:text-[#0A0A0C] bg-[#1A1A1A] dark:bg-[#F3F3F5] hover:bg-[#8C7355] dark:hover:bg-[#C8A578] shadow-sm transition-all"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(req.id, 'DECLINED')}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-[#8A3A3A] dark:text-[#FCA5A5] hover:bg-[#F5EAEA] dark:hover:bg-[#7F1D1D]/20 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {/* Quick inspect link to project */}
                <button
                  onClick={() => setSelectedProjectId(req.projectId)}
                  className="p-2 rounded-lg bg-[#FAF8F5] dark:bg-white/[0.04] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] text-[#5C564C] dark:text-[#9E9EA8] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5] border border-[#1A1A1A]/10 dark:border-white/[0.08] transition-colors"
                  title="Inspect Project Details"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#FFFFFF] dark:bg-[#121216] rounded-2xl p-12 text-center space-y-4 max-w-xl mx-auto border border-[#1A1A1A]/15 dark:border-white/[0.08] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] dark:bg-white/[0.04] border border-[#1A1A1A]/10 dark:border-white/[0.08] flex items-center justify-center mx-auto text-[#8C7355] dark:text-[#C8A578]">
            <Inbox className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
              NO {activeSubTab.toUpperCase()} REQUESTS
            </h3>
            <p className="text-sm text-[#5C564C] dark:text-[#B8B8C2] max-w-md mx-auto leading-relaxed font-sans">
              {activeSubTab === 'received'
                ? 'Your project queue is clean. Initiate a new mission to attract high-compatibility builders.'
                : 'You have not submitted join requests to any external missions yet.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('projects')}
            className="btn-shimmer btn-primary-action px-5 py-2 rounded-lg text-xs font-serif font-semibold text-[#F9F7F2] dark:text-[#0A0A0C] bg-[#1A1A1A] dark:bg-[#F3F3F5] hover:bg-[#8C7355] dark:hover:bg-[#C8A578] shadow-sm inline-flex items-center gap-1.5"
          >
            Explore Missions
          </button>
        </div>
      )}
    </div>
  );
};
