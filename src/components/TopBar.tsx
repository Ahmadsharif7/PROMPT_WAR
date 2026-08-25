import React, { useState, useRef, useEffect } from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import { BrandMark } from './BrandMark';
import {
  LayoutDashboard,
  FolderGit2,
  Inbox,
  UserCircle2,
  Plus,
  Sliders,
  ChevronDown,
  Check,
  Sun,
  Moon,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    currentUser,
    users,
    switchActiveUser,
    pendingRequestsCount,
    setEngineModalOpen,
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'requests', label: 'Requests', icon: Inbox, badge: pendingRequestsCount },
    { id: 'profile', label: 'Profile', icon: UserCircle2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1A1A1A]/10 dark:border-white/[0.08] bg-[#F9F7F2]/90 dark:bg-[#0A0A0C]/90 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* ZONE 1: BRAND MARK */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355] dark:focus-visible:ring-[#C8A578] rounded-lg text-left"
            title="Return to Overview"
          >
            <BrandMark size={30} />
          </button>
        </div>

        {/* ZONE 2: NAVIGATION TABS */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-[#EFE8DC]/60 dark:bg-white/[0.04] border border-[#1A1A1A]/10 dark:border-white/[0.08]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-1.5 rounded-md text-xs uppercase font-mono tracking-wider transition-all duration-200 flex items-center gap-2 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355] dark:focus-visible:ring-[#C8A578] ${
                  isActive
                    ? 'text-[#1A1A1A] dark:text-[#F3F3F5] font-bold bg-[#FFFFFF] dark:bg-[#18181F] shadow-sm border border-[#1A1A1A]/10 dark:border-white/[0.12]'
                    : 'text-[#5C564C] dark:text-[#9E9EA8] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5] hover:bg-[#FFFFFF]/50 dark:hover:bg-white/[0.05]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#8C7355] dark:text-[#C8A578]' : 'text-[#767064] dark:text-[#72727D]'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full bg-[#8C7355] dark:bg-[#C8A578] text-white dark:text-[#0A0A0C] leading-tight">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#8C7355] dark:bg-[#C8A578] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* ZONE 3: ACTIONS, THEME TOGGLE & PROFILE SWITCHER */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Theme Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[#FFFFFF] dark:bg-[#141418] hover:bg-[#EFE8DC] dark:hover:bg-[#1E1E26] text-[#5C564C] dark:text-[#B8B8C2] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5] border border-[#1A1A1A]/15 dark:border-white/[0.1] shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355] dark:focus-visible:ring-[#C8A578]"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#C8A578]" />
            ) : (
              <Moon className="w-4 h-4 text-[#8C7355]" />
            )}
          </button>

          {/* Algorithm Engine Inspector Button */}
          <button
            onClick={() => setEngineModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-[#1A1A1A] dark:text-[#F3F3F5] bg-[#FFFFFF] dark:bg-[#141418] hover:bg-[#EFE8DC] dark:hover:bg-[#1E1E26] border border-[#1A1A1A]/15 dark:border-white/[0.1] shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355] dark:focus-visible:ring-[#C8A578]"
            title="Open Compatibility Engine Inspector"
          >
            <Sliders className="w-3.5 h-3.5 text-[#8C7355] dark:text-[#C8A578]" />
            <span className="hidden lg:inline">Engine Weights</span>
          </button>

          {/* New Project Primary CTA with Subtle Scale & Glow */}
          <button
            onClick={() => setActiveTab('create')}
            className={`btn-shimmer btn-primary-action flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-serif font-semibold tracking-wide text-[#F9F7F2] dark:text-[#0A0A0C] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355] dark:focus-visible:ring-[#C8A578] ${
              activeTab === 'create'
                ? 'bg-[#8C7355] dark:bg-[#C8A578] ring-2 ring-[#8C7355] dark:ring-[#C8A578]'
                : 'bg-[#1A1A1A] dark:bg-[#F3F3F5] hover:bg-[#8C7355] dark:hover:bg-[#C8A578] shadow-sm'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">New Mission</span>
          </button>

          {/* Interactive Persona Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-lg bg-[#FFFFFF] dark:bg-[#141418] hover:bg-[#F2ECE1] dark:hover:bg-[#1E1E26] border border-[#1A1A1A]/15 dark:border-white/[0.1] shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355] dark:focus-visible:ring-[#C8A578]"
              title="Switch demo persona to test live compatibility re-computation"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-md object-cover border border-[#1A1A1A]/20 dark:border-white/20"
              />
              <div className="hidden xl:flex flex-col text-left leading-tight">
                <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#F3F3F5] truncate max-w-[90px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-[#767064] dark:text-[#9E9EA8] truncate max-w-[90px] font-mono">
                  {currentUser.roleTitle.split('&')[0]}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#767064] dark:text-[#82828F] transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Persona Switcher Dropdown */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#FFFFFF] dark:bg-[#141418] border border-[#1A1A1A]/15 dark:border-white/[0.12] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#1A1A1A]/10 dark:border-white/[0.08] mb-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7355] dark:text-[#C8A578] font-bold">
                      Persona Registry
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#EFE8DC] dark:bg-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] font-mono font-bold">
                      Vol. 24
                    </span>
                  </div>
                  <p className="text-xs text-[#5C564C] dark:text-[#9E9EA8] mt-1">
                    Select a builder to recalculate compatibility vectors on the fly.
                  </p>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                  {users.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchActiveUser(u.id);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                          isSelected
                            ? 'bg-[#F2ECE1] dark:bg-[#C8A578]/15 border border-[#8C7355]/40 dark:border-[#C8A578]/40 text-[#1A1A1A] dark:text-[#F3F3F5]'
                            : 'hover:bg-[#FAF8F5] dark:hover:bg-white/[0.04] text-[#38352F] dark:text-[#B8B8C2]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-md object-cover border border-[#1A1A1A]/15 dark:border-white/10 shrink-0"
                          />
                          <div className="min-w-0 truncate">
                            <div className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F3F3F5] truncate flex items-center gap-1.5">
                              {u.name}
                              <span className="text-[9px] font-mono px-1 rounded bg-[#EFE8DC] dark:bg-white/[0.08] text-[#5C564C] dark:text-[#9E9EA8] font-normal">
                                {u.weeklyAvailability}h/w
                              </span>
                            </div>
                            <div className="text-[11px] text-[#767064] dark:text-[#82828F] truncate">
                              {u.roleTitle}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#8C7355] dark:text-[#C8A578] shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 border-t border-[#1A1A1A]/10 dark:border-white/[0.08] bg-[#F9F7F2] dark:bg-[#0A0A0C]">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
                isActive ? 'text-[#8C7355] dark:text-[#C8A578] font-bold' : 'text-[#767064] dark:text-[#82828F] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5]'
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 text-[8px] font-bold rounded-full bg-[#8C7355] dark:bg-[#C8A578] text-white dark:text-[#0A0A0C]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
