import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CapabilitySignature } from '../CapabilitySignature';
import { AvailabilitySlider } from '../AvailabilitySlider';
import { SkillTag } from '../SkillTag';
import { ExperienceLevel, SkillCategory, UserSkill } from '../../types';
import {
  UserCircle,
  Sparkles,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProfileView: React.FC = () => {
  const { currentUser, updateCurrentUserProfile, users, switchActiveUser } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [roleTitle, setRoleTitle] = useState(currentUser.roleTitle);
  const [bio, setBio] = useState(currentUser.bio);
  const [location, setLocation] = useState(currentUser.location);
  const [timezone, setTimezone] = useState(currentUser.timezone);
  const [weeklyAvailability, setWeeklyAvailability] = useState(currentUser.weeklyAvailability);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(currentUser.experienceLevel);
  const [skills, setSkills] = useState<UserSkill[]>(currentUser.skills);
  const [interests, setInterests] = useState<string[]>(currentUser.interests);

  // New Skill Input state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Frontend');
  const [newSkillProficiency, setNewSkillProficiency] = useState(85);

  // New Interest Input state
  const [newInterest, setNewInterest] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const experienceOptions: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Lead'];
  const categoryOptions: SkillCategory[] = [
    'Frontend',
    'Backend',
    'Design',
    'Data',
    'AI/ML',
    'Management',
    'Mobile',
    'DevOps',
    'Security',
  ];

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    if (skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return;

    setSkills([
      ...skills,
      {
        name: newSkillName.trim(),
        category: newSkillCategory,
        proficiency: newSkillProficiency,
      },
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter((s) => s.name !== skillName));
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    if (interests.some((i) => i.toLowerCase() === newInterest.trim().toLowerCase())) return;

    setInterests([...interests, newInterest.trim()]);
    setNewInterest('');
  };

  const handleRemoveInterest = (interestName: string) => {
    setInterests(interests.filter((i) => i !== interestName));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      name,
      roleTitle,
      bio,
      location,
      timezone,
      weeklyAvailability,
      experienceLevel,
      skills,
      interests,
    });

    setSavedSuccess(true);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#8C7355', '#C8A578', '#1A1A1A'],
    });

    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header with Persona Quick Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#8C7355] dark:text-[#C8A578]">
            CURRICULUM VITAE // DOSSIER
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] tracking-tight">
            Capability Signature & Profile
          </h1>
          <p className="text-sm text-[#4A463E] dark:text-[#B8B8C2] mt-1 font-sans">
            Your capability parameters dictate compatibility scoring across all live missions.
          </p>
        </div>

        {/* Persona Quick Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-mono text-[#767064] dark:text-[#82828F] shrink-0 mr-1 uppercase">Switch:</span>
          {users.slice(0, 5).map((u) => (
            <button
              key={u.id}
              onClick={() => {
                switchActiveUser(u.id);
                setName(u.name);
                setRoleTitle(u.roleTitle);
                setBio(u.bio);
                setLocation(u.location);
                setTimezone(u.timezone);
                setWeeklyAvailability(u.weeklyAvailability);
                setExperienceLevel(u.experienceLevel);
                setSkills(u.skills);
                setInterests(u.interests);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                u.id === currentUser.id
                  ? 'bg-[#1A1A1A] dark:bg-[#F3F3F5] text-[#F9F7F2] dark:text-[#0A0A0C] font-bold shadow-sm'
                  : 'bg-[#FAF8F5] dark:bg-white/[0.04] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] text-[#5C564C] dark:text-[#9E9EA8] border border-[#1A1A1A]/10 dark:border-white/[0.08]'
              }`}
            >
              <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover border border-[#1A1A1A]/15 dark:border-white/10" />
              <span>{u.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity Card */}
          <div className="bg-[#FFFFFF] dark:bg-[#121216] rounded-xl p-6 space-y-4 border border-[#1A1A1A]/10 dark:border-white/[0.08] shadow-sm">
            <h3 className="text-base font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-[#8C7355] dark:text-[#C8A578]" />
              <span>Identity & Focus</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-4 pb-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-xl object-cover border border-[#1A1A1A]/20 dark:border-white/20 shrink-0"
              />
              <div className="space-y-1 text-center sm:text-left min-w-0 w-full">
                <div className="text-xs font-mono font-bold text-[#8C7355] dark:text-[#C8A578] uppercase tracking-wider">
                  ARCHIVE ID: {currentUser.id}
                </div>
                <div className="text-xs text-[#767064] dark:text-[#82828F]">
                  Active in {currentUser.timezone} • {currentUser.experienceLevel} Tier
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">Primary Role Title</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">Bio & Craft Philosophy</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578] font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578]"
                />
              </div>
            </div>
          </div>

          {/* Availability & Experience Bandwidth */}
          <div className="bg-[#FFFFFF] dark:bg-[#121216] rounded-xl p-6 space-y-6 border border-[#1A1A1A]/10 dark:border-white/[0.08] shadow-sm">
            <h3 className="text-base font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8C7355] dark:text-[#C8A578]" />
              <span>Bandwidth & Seniority</span>
            </h3>

            {/* Availability Slider */}
            <AvailabilitySlider
              value={weeklyAvailability}
              onChange={setWeeklyAvailability}
              label="Sprint & Weekly Bandwidth"
            />

            {/* Experience Level */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#38352F] dark:text-[#D4D4D8]">Experience Tier</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {experienceOptions.map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setExperienceLevel(exp)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
                      experienceLevel === exp
                        ? 'bg-[#1A1A1A] dark:bg-[#F3F3F5] text-[#F9F7F2] dark:text-[#0A0A0C] shadow-sm'
                        : 'bg-[#FAF8F5] dark:bg-white/[0.04] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] text-[#5C564C] dark:text-[#9E9EA8] border border-[#1A1A1A]/10 dark:border-white/[0.08]'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Management */}
          <div className="bg-[#FFFFFF] dark:bg-[#121216] rounded-xl p-6 space-y-4 border border-[#1A1A1A]/10 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8C7355] dark:text-[#C8A578]" />
                <span>Technical Skills ({skills.length})</span>
              </h3>
              <span className="text-[10px] font-mono text-[#767064] dark:text-[#82828F] uppercase">
                45% of compatibility signal
              </span>
            </div>

            {/* Current Skills List */}
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="inline-flex items-center gap-1.5 p-1 pl-2.5 rounded-md bg-[#FAF8F5] dark:bg-white/[0.04] border border-[#1A1A1A]/10 dark:border-white/[0.08]"
                >
                  <SkillTag
                    name={skill.name}
                    category={skill.category}
                    proficiency={skill.proficiency}
                    size="xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.name)}
                    className="p-1 text-[#767064] dark:text-[#82828F] hover:text-[#8A3A3A] dark:hover:text-[#F87171] transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Skill Sub-form */}
            <div className="p-3.5 rounded-lg bg-[#FAF8F5] dark:bg-white/[0.03] border border-[#1A1A1A]/10 dark:border-white/[0.06] space-y-3 pt-3">
              <div className="text-[10px] font-mono text-[#8C7355] dark:text-[#C8A578] uppercase font-bold tracking-wider">Add Competency</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Skill name (e.g. PyTorch, Rust)"
                  className="text-xs px-3 py-2 rounded-lg bg-[#FFFFFF] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578]"
                />

                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                  className="text-xs font-mono px-3 py-2 rounded-lg bg-[#FFFFFF] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none focus:ring-1 focus:ring-[#8C7355] dark:focus:ring-[#C8A578]"
                >
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newSkillProficiency}
                    onChange={(e) => setNewSkillProficiency(Number(e.target.value))}
                    className="w-16 text-xs font-mono px-2 py-2 rounded-lg bg-[#FFFFFF] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#1A1A1A] dark:text-[#F3F3F5] focus:outline-none"
                    title="Proficiency (1-100)"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-[#F9F7F2] dark:text-[#0A0A0C] bg-[#1A1A1A] dark:bg-[#F3F3F5] hover:bg-[#8C7355] dark:hover:bg-[#C8A578] flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interests & Mission Domains */}
          <div className="bg-[#FFFFFF] dark:bg-[#121216] rounded-xl p-6 space-y-4 border border-[#1A1A1A]/10 dark:border-white/[0.08] shadow-sm">
            <h3 className="text-base font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8C7355] dark:text-[#C8A578]" />
              <span>Interests & Domains ({interests.length})</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {interests.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-[#F2ECE1] dark:bg-[#C8A578]/15 border border-[#8C7355]/30 dark:border-[#C8A578]/30 text-[#1A1A1A] dark:text-[#F3F3F5] font-medium"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(item)}
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
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Domain (e.g. Climate Intelligence, Spatial Computing)..."
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

          {/* Save Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs font-mono text-[#5C564C] dark:text-[#9E9EA8]">
              {savedSuccess ? (
                <span className="text-[#2D5A43] dark:text-[#6EE7B7] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Profile Synced & Matches Recalculated!
                </span>
              ) : (
                'Modifications automatically update match rankings across all active missions.'
              )}
            </div>

            <button
              type="submit"
              className="btn-shimmer btn-primary-action px-6 py-2.5 rounded-lg text-sm font-serif font-semibold text-[#F9F7F2] dark:text-[#0A0A0C] bg-[#1A1A1A] dark:bg-[#F3F3F5] hover:bg-[#8C7355] dark:hover:bg-[#C8A578] shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Telemetry</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Capability Signature Telemetry */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-4">
            <div className="text-[10px] font-mono text-[#8C7355] dark:text-[#C8A578] uppercase tracking-[0.2em] font-bold">
              LIVE SIGNATURE TELEMETRY
            </div>

            <CapabilitySignature
              user={{
                ...currentUser,
                name,
                roleTitle,
                bio,
                weeklyAvailability,
                experienceLevel,
                skills,
                interests,
              }}
              maxSkills={8}
            />

            {/* Past Projects List */}
            <div className="bg-[#FFFFFF] dark:bg-[#121216] rounded-xl p-5 space-y-3 border border-[#1A1A1A]/10 dark:border-white/[0.08] shadow-sm">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#8C7355] dark:text-[#C8A578] font-bold">
                Past Track Record ({currentUser.pastProjects.length})
              </h4>
              {currentUser.pastProjects.length > 0 ? (
                currentUser.pastProjects.map((p) => (
                  <div key={p.title} className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-white/[0.03] border border-[#1A1A1A]/10 dark:border-white/[0.06] space-y-1">
                    <div className="text-xs font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">{p.title}</div>
                    <div className="text-[11px] text-[#5C564C] dark:text-[#9E9EA8] font-sans">{p.description}</div>
                    <div className="text-[10px] font-mono text-[#8C7355] dark:text-[#C8A578] font-semibold">{p.role}</div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#767064] dark:text-[#82828F] font-mono italic">
                  No verified past projects logged.
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
