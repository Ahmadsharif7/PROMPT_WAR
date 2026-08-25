import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ExperienceLevel, ProjectRole } from '../../types';
import { SkillTag } from '../SkillTag';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Rocket,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CreateProjectWizard: React.FC = () => {
  const { createNewProject, setActiveTab, setSelectedProjectId } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Project['type']>('Hackathon');

  const [requiredSkills, setRequiredSkills] = useState<string[]>([
    'React',
    'TypeScript',
    'Python',
    'UI/UX Design',
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [interests, setInterests] = useState<string[]>([
    'AI Interfaces',
    'Spatial Computing',
  ]);
  const [newInterestInput, setNewInterestInput] = useState('');

  const [teamSize, setTeamSize] = useState<number>(4);
  const [rolesNeeded, setRolesNeeded] = useState<ProjectRole[]>([
    {
      roleName: 'Frontend & UI Lead',
      skills: ['React', 'TypeScript', 'UI/UX Design'],
    },
    {
      roleName: 'ML & Data Systems',
      skills: ['Python', 'Machine Learning'],
    },
    {
      roleName: 'Backend & Systems Architect',
      skills: ['Node.js', 'PostgreSQL'],
    },
    {
      roleName: 'Product & Go-To-Market Lead',
      skills: ['User Research', 'Product Strategy'],
    },
  ]);
  const [newRoleName, setNewRoleName] = useState('');

  const [timeline, setTimeline] = useState('48-hour hackathon sprint');
  const [weeklyHoursNeeded, setWeeklyHoursNeeded] = useState<number>(18);
  const [targetExperience, setTargetExperience] = useState<ExperienceLevel>('Advanced');

  // Common quick-pick skills
  const suggestedSkills = [
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Python',
    'FastAPI',
    'PyTorch',
    'Machine Learning',
    'Computer Vision',
    'UI/UX Design',
    'Figma',
    'PostgreSQL',
    'Node.js',
    'Go',
    'React Native',
    'Docker',
  ];

  const toggleSkill = (skill: string) => {
    if (requiredSkills.includes(skill)) {
      setRequiredSkills(requiredSkills.filter((s) => s !== skill));
    } else {
      setRequiredSkills([...requiredSkills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!requiredSkills.includes(newSkillInput.trim())) {
      setRequiredSkills([...requiredSkills, newSkillInput.trim()]);
    }
    setNewSkillInput('');
  };

  const handleAddInterest = () => {
    if (!newInterestInput.trim()) return;
    if (!interests.includes(newInterestInput.trim())) {
      setInterests([...interests, newInterestInput.trim()]);
    }
    setNewInterestInput('');
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) return;
    setRolesNeeded([
      ...rolesNeeded,
      {
        roleName: newRoleName.trim(),
        skills: requiredSkills.slice(0, 2),
      },
    ]);
    setNewRoleName('');
  };

  const handleRemoveRole = (index: number) => {
    setRolesNeeded(rolesNeeded.filter((_, i) => i !== index));
  };

  // Calculate real Project Readiness Score (0-100%)
  const calculateReadiness = () => {
    let score = 0;
    if (title.trim().length >= 4) score += 20;
    if (tagline.trim().length >= 10) score += 15;
    if (description.trim().length >= 20) score += 20;
    if (requiredSkills.length >= 3) score += 20;
    if (interests.length >= 1) score += 10;
    if (rolesNeeded.length >= 2) score += 15;
    return Math.min(100, score);
  };

  const readinessScore = calculateReadiness();

  const handleLaunch = () => {
    if (!title.trim() || !tagline.trim()) return;

    const newProj = createNewProject({
      title,
      tagline,
      description: description || tagline,
      type,
      requiredSkills,
      interests,
      teamSize,
      timeline,
      weeklyHoursNeeded,
      targetExperience,
      currentMembers: [],
      rolesNeeded,
      status: 'Recruiting',
    });

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#8C7355', '#C8A578', '#1A1A1A'],
    });

    setSelectedProjectId(newProj.id);
    setActiveTab('projects');
  };

  const stepsList = [
    { num: 1, label: '01 Identity' },
    { num: 2, label: '02 Stack' },
    { num: 3, label: '03 Roles' },
    { num: 4, label: '04 Timeline' },
    { num: 5, label: '05 Review' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FAF8F5] dark:bg-white/[0.04] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#8C7355] dark:text-[#C8A578] text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PROJECT INITIATION WIZARD</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] tracking-tight">
          Launch a High-Synergy Mission
        </h1>
        <p className="text-sm text-[#4A463E] dark:text-[#B8B8C2] max-w-lg mx-auto font-sans">
          Specify mission objectives, competencies, and squad slots so the compatibility engine can match high-potential collaborators.
        </p>
      </div>

      {/* 5-Step Progress Indicators */}
      <div className="flex items-center justify-between p-1.5 rounded-xl bg-[#EFE8DC]/80 dark:bg-white/[0.04] border border-[#1A1A1A]/10 dark:border-white/[0.08]">
        {stepsList.map((s) => {
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-mono text-center transition-all uppercase tracking-wider ${
                isActive
                  ? 'bg-[#1A1A1A] dark:bg-[#F3F3F5] text-[#F9F7F2] dark:text-[#0A0A0C] font-bold shadow-sm'
                  : isDone
                  ? 'text-[#1A1A1A] dark:text-[#F3F3F5] hover:bg-[#FAF8F5] dark:hover:bg-white/[0.06]'
                  : 'text-[#767064] dark:text-[#82828F] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5]'
              }`}
            >
              <div className="hidden sm:inline">{s.label}</div>
              <div className="sm:hidden">{s.num}</div>
            </button>
          );
        })}
      </div>

      {/* Main Step Container */}
      <div className="bg-[#FFFFFF] dark:bg-[#121216] rounded-2xl p-6 sm:p-8 space-y-6 border border-[#1A1A1A]/15 dark:border-white/[0.08] shadow-sm">
        {/* STEP 1: PROJECT ESSENTIALS */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-[#1A1A1A]/10 dark:border-white/[0.08] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C7355] dark:text-[#C8A578] font-bold">
                01 // PROJECT IDENTITY
              </span>
              <h2 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] mt-0.5">
                Core Mission & Scope
              </h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Campus Navigator, Climate Intelligence Engine"
                className="w-full text-base px-4 py-3 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">Tagline / Pitch (1 sentence)</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Zero-latency indoor wayfinding assistant using spatial embeddings."
                className="w-full text-sm px-4 py-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">Mission Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Hackathon', 'Startup', 'Research', 'Open Source'] as Project['type'][]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
                      type === t
                        ? 'bg-[#1A1A1A] dark:bg-[#F3F3F5] text-[#F9F7F2] dark:text-[#0A0A0C] shadow-sm'
                        : 'bg-[#FAF8F5] dark:bg-white/[0.04] text-[#5C564C] dark:text-[#9E9EA8] border border-[#1A1A1A]/10 dark:border-white/[0.08] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">Detailed Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the architectural challenge, problem statement, and goals..."
                className="w-full text-sm px-4 py-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578] font-sans"
              />
            </div>
          </div>
        )}

        {/* STEP 2: REQUIREMENTS & STACK */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-[#1A1A1A]/10 dark:border-white/[0.08] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C7355] dark:text-[#C8A578] font-bold">
                02 // TECHNICAL REQUIREMENTS
              </span>
              <h2 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] mt-0.5">
                Required Stack & Domains
              </h2>
            </div>

            {/* Selected Skills */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">
                Selected Required Technologies ({requiredSkills.length})
              </label>
              <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/10 dark:border-white/[0.08] min-h-[52px]">
                {requiredSkills.map((s) => (
                  <span
                    key={s}
                    onClick={() => toggleSkill(s)}
                    className="cursor-pointer"
                    title="Click to remove"
                  >
                    <SkillTag name={s} selected={true} size="sm" />
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Skill Chips */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-[#767064] dark:text-[#82828F] font-bold tracking-wider">
                Quick-Select Recommended Skills
              </label>
              <div className="flex flex-wrap gap-1.5">
                {suggestedSkills.map((skill) => {
                  const isSelected = requiredSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                        isSelected
                          ? 'bg-[#1A1A1A] dark:bg-[#F3F3F5] text-[#F9F7F2] dark:text-[#0A0A0C] font-bold shadow-sm'
                          : 'bg-[#FAF8F5] dark:bg-white/[0.04] text-[#5C564C] dark:text-[#9E9EA8] border border-[#1A1A1A]/10 dark:border-white/[0.08] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08]'
                      }`}
                    >
                      {skill} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Skill Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Add other skill (e.g. WebGL, Solana, Kafka)..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578]"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F3F3F5] bg-[#FAF8F5] dark:bg-white/[0.04] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] border border-[#1A1A1A]/15 dark:border-white/[0.08]"
              >
                Add Skill
              </button>
            </div>

            {/* Domain Interests */}
            <div className="space-y-2 pt-3 border-t border-[#1A1A1A]/10 dark:border-white/[0.08]">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">
                Project Domain Interests ({interests.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {interests.map((int) => (
                  <span
                    key={int}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-mono bg-[#F2ECE1] dark:bg-[#C8A578]/15 border border-[#8C7355]/30 dark:border-[#C8A578]/30 text-[#1A1A1A] dark:text-[#F3F3F5] font-medium"
                  >
                    <span>{int}</span>
                    <button
                      type="button"
                      onClick={() => setInterests(interests.filter((i) => i !== int))}
                      className="text-[#767064] dark:text-[#82828F] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newInterestInput}
                  onChange={(e) => setNewInterestInput(e.target.value)}
                  placeholder="Domain (e.g. Healthcare, LLMs, Clean Energy)..."
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578]"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F3F3F5] bg-[#FAF8F5] dark:bg-white/[0.04] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] border border-[#1A1A1A]/15 dark:border-white/[0.08]"
                >
                  Add Domain
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: TEAM COMPOSITION */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-[#1A1A1A]/10 dark:border-white/[0.08] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C7355] dark:text-[#C8A578] font-bold">
                03 // TEAM ARCHITECTURE
              </span>
              <h2 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] mt-0.5">
                Target Squad Roles
              </h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">Squad Target Size</label>
              <div className="flex items-center gap-3">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTeamSize(num)}
                    className={`w-12 h-10 rounded-lg text-sm font-mono font-bold transition-all ${
                      teamSize === num
                        ? 'bg-[#1A1A1A] dark:bg-[#F3F3F5] text-[#F9F7F2] dark:text-[#0A0A0C] shadow-sm'
                        : 'bg-[#FAF8F5] dark:bg-white/[0.04] text-[#5C564C] dark:text-[#9E9EA8] border border-[#1A1A1A]/10 dark:border-white/[0.08] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <span className="text-xs font-mono text-[#767064] dark:text-[#82828F] ml-2">
                  Builders total
                </span>
              </div>
            </div>

            {/* Role Slots */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">
                Defined Domain Roles ({rolesNeeded.length})
              </label>

              <div className="space-y-2">
                {rolesNeeded.map((role, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/10 dark:border-white/[0.08] flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                        {role.roleName}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {role.skills.map((s) => (
                          <SkillTag key={s} name={s} size="xs" />
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveRole(idx)}
                      className="p-1.5 text-[#767064] dark:text-[#82828F] hover:text-[#8A3A3A] dark:hover:text-[#F87171] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Role */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="New Role title (e.g. Lead Spatial Architect)..."
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578]"
                />
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F3F3F5] bg-[#FAF8F5] dark:bg-white/[0.04] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] border border-[#1A1A1A]/15 dark:border-white/[0.08]"
                >
                  Add Role
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: TIMELINE & EXPERIENCE */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-[#1A1A1A]/10 dark:border-white/[0.08] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C7355] dark:text-[#C8A578] font-bold">
                04 // SPRINT PARAMETERS
              </span>
              <h2 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] mt-0.5">
                Timeline & Bandwidth
              </h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">Sprint Horizon / Timeline</label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g. 48-hour sprint, 6-week incubator MVP..."
                className="w-full text-sm px-4 py-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#38352F] dark:text-[#D4D4D8] font-semibold">Weekly Commitment Expected</span>
                <span className="font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">{weeklyHoursNeeded} hours/week</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                value={weeklyHoursNeeded}
                onChange={(e) => setWeeklyHoursNeeded(Number(e.target.value))}
                className="w-full accent-[#8C7355] dark:accent-[#C8A578] cursor-pointer"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">Target Experience Tier</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced', 'Lead'] as ExperienceLevel[]).map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setTargetExperience(exp)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
                      targetExperience === exp
                        ? 'bg-[#1A1A1A] dark:bg-[#F3F3F5] text-[#F9F7F2] dark:text-[#0A0A0C] shadow-sm'
                        : 'bg-[#FAF8F5] dark:bg-white/[0.04] text-[#5C564C] dark:text-[#9E9EA8] border border-[#1A1A1A]/10 dark:border-white/[0.08] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08]'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & READINESS TELEMETRY */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-[#1A1A1A]/10 dark:border-white/[0.08] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C7355] dark:text-[#C8A578] font-bold">
                05 // FINAL SYNTHESIS REVIEW
              </span>
              <h2 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] mt-0.5">
                Mission Readiness Telemetry
              </h2>
            </div>

            {/* Readiness Gauge */}
            <div className="bg-[#FAF8F5] dark:bg-[#18181F] p-5 rounded-xl border border-[#8C7355]/40 dark:border-[#C8A578]/40 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase text-[#8C7355] dark:text-[#C8A578] font-bold tracking-wider">
                  MISSION READINESS INDEX
                </div>
                <p className="text-xs text-[#4A463E] dark:text-[#B8B8C2] font-sans">
                  Calculated from completeness of stack definition, role taxonomy, and sprint parameters.
                </p>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-3xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                  {readinessScore}%
                </div>
                <span className="text-[10px] font-mono text-[#2D5A43] dark:text-[#6EE7B7] font-bold">
                  Ready for Matching
                </span>
              </div>
            </div>

            {/* Summary Review Card */}
            <div className="bg-[#FAF8F5] dark:bg-[#18181F] p-5 rounded-xl space-y-4 border border-[#1A1A1A]/10 dark:border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#767064] dark:text-[#82828F]">
                  {type} Mission
                </span>
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                  {title || 'Untitled Mission'}
                </h3>
                <p className="text-xs text-[#5C564C] dark:text-[#9E9EA8] mt-0.5 font-sans">
                  {tagline || 'No tagline specified.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-[#767064] dark:text-[#82828F] font-bold">
                  Required Stack
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {requiredSkills.map((s) => (
                    <SkillTag key={s} name={s} size="xs" />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#5C564C] dark:text-[#9E9EA8] pt-2 border-t border-[#1A1A1A]/10 dark:border-white/[0.08]">
                <span>Timeline: {timeline}</span>
                <span>{weeklyHoursNeeded}h/wk</span>
                <span>{teamSize} Builders</span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1A1A1A]/10 dark:border-white/[0.08]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-[#1A1A1A] dark:text-[#F3F3F5] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] bg-[#FAF8F5] dark:bg-white/[0.04] border border-[#1A1A1A]/15 dark:border-white/[0.08] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="btn-shimmer btn-primary-action px-5 py-2.5 rounded-lg text-xs font-serif font-semibold text-[#F9F7F2] dark:text-[#0A0A0C] bg-[#1A1A1A] dark:bg-[#F3F3F5] hover:bg-[#8C7355] dark:hover:bg-[#C8A578] shadow-sm flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLaunch}
              disabled={!title.trim()}
              className="btn-shimmer btn-primary-action px-6 py-2.5 rounded-lg text-xs font-serif font-semibold text-[#F9F7F2] dark:text-[#0A0A0C] bg-[#1A1A1A] dark:bg-[#F3F3F5] hover:bg-[#8C7355] dark:hover:bg-[#C8A578] shadow-sm flex items-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              <span>Launch Mission</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
