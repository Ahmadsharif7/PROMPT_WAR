export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'Design'
  | 'Data'
  | 'AI/ML'
  | 'Management'
  | 'Mobile'
  | 'DevOps'
  | 'Security';

export interface UserSkill {
  name: string;
  category: SkillCategory;
  proficiency: number; // 1-100
}

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Lead';

export interface User {
  id: string;
  name: string;
  roleTitle: string;
  avatar: string;
  bio: string;
  location: string;
  timezone: string;
  weeklyAvailability: number; // hours per week
  experienceLevel: ExperienceLevel;
  skills: UserSkill[];
  interests: string[];
  pastProjects: {
    title: string;
    description: string;
    role: string;
    link?: string;
  }[];
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface ProjectRole {
  roleName: string;
  skills: string[];
  assignedUser?: User;
}

export interface Project {
  id: string;
  code: string; // e.g. "0042"
  title: string;
  tagline: string;
  description: string;
  type: 'Hackathon' | 'Startup' | 'Research' | 'Open Source';
  requiredSkills: string[];
  interests: string[];
  teamSize: number;
  timeline: string;
  weeklyHoursNeeded: number;
  targetExperience: ExperienceLevel;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  currentMembers: User[];
  rolesNeeded: ProjectRole[];
  status: 'Recruiting' | 'Full' | 'In Progress';
  createdAt: string;
}

export interface ScoreBreakdown {
  skillsScore: number;       // 0-100 (weighted 45%)
  interestsScore: number;    // 0-100 (weighted 20%)
  availabilityScore: number; // 0-100 (weighted 20%)
  experienceScore: number;   // 0-100 (weighted 15%)
  overlappingSkills: string[];
  missingSkills: string[];
  complementarySkills: string[];
  sharedInterests: string[];
  availabilityOverlapHours: number;
}

export interface MatchResult {
  projectId: string;
  userId: string;
  finalScore: number; // 0-100
  breakdown: ScoreBreakdown;
  explanation: string;
  complementarityTag: string;
}

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface JoinRequest {
  id: string;
  projectId: string;
  projectTitle: string;
  projectCode: string;
  projectOwnerId: string;
  projectOwnerName: string;
  projectOwnerAvatar: string;
  senderId: string;
  senderName: string;
  senderRoleTitle: string;
  senderAvatar: string;
  senderSkills: string[];
  message: string;
  matchScore: number;
  status: RequestStatus;
  createdAt: string;
  type: 'sent' | 'received'; // relative to active user
}

export interface AlgorithmWeights {
  skills: number;       // 0.45
  interests: number;    // 0.20
  availability: number; // 0.20
  experience: number;   // 0.15
}
