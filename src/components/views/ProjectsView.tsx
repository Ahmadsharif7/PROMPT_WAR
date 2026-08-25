import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectCard } from '../ProjectCard';
import { Search, SlidersHorizontal, Plus, FolderGit2 } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    allMatches,
    setSelectedProjectId,
    setSynthesisModalProjectId,
    setActiveTab,
    setEngineModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'compatibility' | 'newest' | 'hours'>('compatibility');

  const filteredMatches = useMemo(() => {
    return allMatches.filter(({ project, match }) => {
      // Type filter
      if (selectedType !== 'all' && project.type.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = project.title.toLowerCase().includes(q);
        const matchTagline = project.tagline.toLowerCase().includes(q);
        const matchSkills = project.requiredSkills.some((s) => s.toLowerCase().includes(q));
        const matchInterests = project.interests.some((i) => i.toLowerCase().includes(q));
        const matchExplanation = match.explanation.toLowerCase().includes(q);

        if (!matchTitle && !matchTagline && !matchSkills && !matchInterests && !matchExplanation) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'compatibility') {
        return b.match.finalScore - a.match.finalScore;
      }
      if (sortBy === 'newest') {
        return new Date(b.project.createdAt).getTime() - new Date(a.project.createdAt).getTime();
      }
      if (sortBy === 'hours') {
        return b.project.weeklyHoursNeeded - a.project.weeklyHoursNeeded;
      }
      return 0;
    });
  }, [allMatches, selectedType, searchQuery, sortBy]);

  const typeOptions = [
    { id: 'all', label: 'All Domains' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'startup', label: 'Startups' },
    { id: 'research', label: 'Research' },
    { id: 'open source', label: 'Open Source' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#8C7355] dark:text-[#C8A578]">
            FIELD DIRECTORY
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] tracking-tight">
            Discover Missions
          </h1>
          <p className="text-sm text-[#4A463E] dark:text-[#B8B8C2] mt-1 font-sans">
            Missions indexed and ranked by multi-vector compatibility with your capability profile.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setEngineModalOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#F3F3F5] bg-[#FFFFFF] dark:bg-[#141418] hover:bg-[#EFE8DC] dark:hover:bg-[#1E1E26] border border-[#1A1A1A]/15 dark:border-white/[0.1] shadow-sm flex items-center gap-1.5 transition-colors uppercase tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355] dark:focus-visible:ring-[#C8A578]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C7355] dark:text-[#C8A578]" />
            <span>Calibrate Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className="btn-shimmer btn-primary-action px-4 py-2 rounded-lg text-xs font-serif font-semibold text-[#F9F7F2] dark:text-[#0A0A0C] bg-[#1A1A1A] dark:bg-[#F3F3F5] hover:bg-[#8C7355] dark:hover:bg-[#C8A578] shadow-sm flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355] dark:focus-visible:ring-[#C8A578]"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate Mission</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="bg-[#FFFFFF] dark:bg-[#121216] p-4 rounded-xl space-y-4 border border-[#1A1A1A]/10 dark:border-white/[0.08] shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767064] dark:text-[#82828F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill, domain, technology (e.g. React, Vision, PyTorch)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-sm text-[#1A1A1A] dark:text-[#F3F3F5] placeholder-[#767064] dark:placeholder-[#72727D] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578] focus:border-[#8C7355] dark:focus:border-[#C8A578]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#767064] dark:text-[#9E9EA8] hover:text-[#1A1A1A] dark:hover:text-white uppercase tracking-wider"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-[#5C564C] dark:text-[#9E9EA8] uppercase tracking-wider">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-mono px-3 py-2 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578]"
            >
              <option value="compatibility">Compatibility Index</option>
              <option value="newest">Latest Added</option>
              <option value="hours">Hours Required</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {typeOptions.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${
                selectedType === type.id
                  ? 'bg-[#1A1A1A] dark:bg-[#F3F3F5] text-[#F9F7F2] dark:text-[#0A0A0C] font-bold shadow-sm'
                  : 'bg-[#FAF8F5] dark:bg-white/[0.04] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] text-[#5C564C] dark:text-[#9E9EA8] border border-[#1A1A1A]/10 dark:border-white/[0.06]'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid with Staggered Entrance Animation */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map(({ project, match }, idx) => (
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
      ) : (
        /* Empty State */
        <div className="bg-[#FFFFFF] dark:bg-[#121216] rounded-2xl p-12 text-center space-y-4 max-w-xl mx-auto border border-[#1A1A1A]/15 dark:border-white/[0.08] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] dark:bg-white/[0.04] border border-[#1A1A1A]/10 dark:border-white/[0.08] flex items-center justify-center mx-auto text-[#8C7355] dark:text-[#C8A578]">
            <FolderGit2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
              YOUR MATCH FIELD IS QUIET
            </h3>
            <p className="text-sm text-[#5C564C] dark:text-[#B8B8C2] max-w-md mx-auto leading-relaxed font-sans">
              No active projects matched your exact query. Try broadening your filter or initiate a new mission to attract complementary builders.
            </p>
          </div>

          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
              }}
              className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-[#1A1A1A] dark:text-[#F3F3F5] bg-[#FAF8F5] dark:bg-white/[0.04] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] border border-[#1A1A1A]/15 dark:border-white/[0.08]"
            >
              Reset Filters
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className="btn-shimmer btn-primary-action px-5 py-2 rounded-lg text-xs font-serif font-semibold text-[#F9F7F2] dark:text-[#0A0A0C] bg-[#1A1A1A] dark:bg-[#F3F3F5] hover:bg-[#8C7355] dark:hover:bg-[#C8A578] shadow-sm"
            >
              Create New Mission
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
