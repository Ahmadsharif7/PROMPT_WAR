import {
  User,
  Project,
  MatchResult,
  ScoreBreakdown,
  AlgorithmWeights,
  ExperienceLevel,
} from '../types';

export const DEFAULT_WEIGHTS: AlgorithmWeights = {
  skills: 0.45,
  interests: 0.20,
  availability: 0.20,
  experience: 0.15,
};

export const PRESET_WEIGHTS: Record<string, { label: string; weights: AlgorithmWeights; desc: string }> = {
  standard: {
    label: 'Standard Synthesis',
    weights: { skills: 0.45, interests: 0.20, availability: 0.20, experience: 0.15 },
    desc: 'Balanced for general hackathons and technical ventures.',
  },
  hackathon: {
    label: '48h Sprint Mode',
    weights: { skills: 0.35, interests: 0.15, availability: 0.40, experience: 0.10 },
    desc: 'Prioritizes maximum weekly availability and rapid skill overlap.',
  },
  deeptech: {
    label: 'Deep Tech & Research',
    weights: { skills: 0.50, interests: 0.20, availability: 0.10, experience: 0.20 },
    desc: 'Prioritizes specialized technical mastery and domain depth.',
  },
  startup: {
    label: 'Early-Stage Startup',
    weights: { skills: 0.40, interests: 0.30, availability: 0.15, experience: 0.15 },
    desc: 'Prioritizes vision alignment, shared domain interests, and execution skills.',
  },
};

const EXPERIENCE_MAP: Record<ExperienceLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Lead: 4,
};

/**
 * Normalizes skill strings for case-insensitive matching
 */
function normalizeStr(str: string): string {
  return str.trim().toLowerCase();
}

/**
 * Calculates deterministic multi-dimensional compatibility score
 */
export function calculateMatchScore(
  user: User,
  project: Project,
  weights: AlgorithmWeights = DEFAULT_WEIGHTS
): MatchResult {
  const userSkillNames = user.skills.map((s) => normalizeStr(s.name));
  const projectRequiredSkills = project.requiredSkills.map(normalizeStr);

  // 1. Skill Score (45% default)
  const overlappingSkillsNormalized = projectRequiredSkills.filter((req) =>
    userSkillNames.some((uSkill) => uSkill === req || uSkill.includes(req) || req.includes(uSkill))
  );

  // Find actual original skill names for display
  const overlappingSkills = project.requiredSkills.filter((req) =>
    user.skills.some((u) => normalizeStr(u.name) === normalizeStr(req) || normalizeStr(u.name).includes(normalizeStr(req)))
  );

  const missingSkills = project.requiredSkills.filter(
    (req) => !overlappingSkills.includes(req)
  );

  // Complementary skills: skills the user has that aren't strictly required but add high synergy
  const complementarySkills = user.skills
    .filter((s) => !overlappingSkills.includes(s.name))
    .map((s) => s.name)
    .slice(0, 3);

  // Base skill ratio
  const rawSkillRatio = project.requiredSkills.length > 0
    ? overlappingSkillsNormalized.length / project.requiredSkills.length
    : 1;

  // Average proficiency of overlapping skills
  const overlappingProficiencies = user.skills
    .filter((s) => overlappingSkills.includes(s.name))
    .map((s) => s.proficiency);

  const avgProficiency = overlappingProficiencies.length > 0
    ? overlappingProficiencies.reduce((a, b) => a + b, 0) / overlappingProficiencies.length
    : 70;

  // Skills score combines coverage (70%) and proficiency quality (30%)
  const skillsScore = Math.min(
    100,
    Math.round((rawSkillRatio * 0.7 + (avgProficiency / 100) * 0.3) * 100)
  );

  // 2. Interest Score (20% default)
  const userInterests = user.interests.map(normalizeStr);
  const projectInterests = project.interests.map(normalizeStr);

  const sharedInterestsNormalized = projectInterests.filter((pInt) =>
    userInterests.some((uInt) => uInt === pInt || uInt.includes(pInt) || pInt.includes(uInt))
  );

  const sharedInterests = project.interests.filter((pInt) =>
    user.interests.some((uInt) => normalizeStr(uInt) === normalizeStr(pInt) || normalizeStr(uInt).includes(normalizeStr(pInt)))
  );

  const interestRatio = project.interests.length > 0
    ? sharedInterestsNormalized.length / project.interests.length
    : 0.7;

  // Scale gracefully: at least partial baseline credit if user has active interests
  const interestsScore = Math.min(
    100,
    Math.round((interestRatio * 0.8 + 0.2 * (user.interests.length > 0 ? 1 : 0)) * 100)
  );

  // 3. Availability Score (20% default)
  const targetHours = project.weeklyHoursNeeded || 15;
  const userHours = user.weeklyAvailability || 10;
  const availabilityOverlapHours = Math.min(userHours, targetHours);
  
  // Ratio of user hours vs target needed
  let availabilityRatio = userHours >= targetHours ? 1.0 : userHours / targetHours;
  if (userHours > targetHours * 1.5) {
    // bonus for abundant availability
    availabilityRatio = Math.min(1.15, availabilityRatio);
  }
  const availabilityScore = Math.min(100, Math.round(availabilityRatio * 100));

  // 4. Experience Score (15% default)
  const userExpVal = EXPERIENCE_MAP[user.experienceLevel] || 2;
  const targetExpVal = EXPERIENCE_MAP[project.targetExperience] || 2;
  
  // Closeness calculation
  const expDiff = Math.abs(userExpVal - targetExpVal);
  let expRatio = 1.0;
  if (expDiff === 1) expRatio = 0.85;
  else if (expDiff === 2) expRatio = 0.65;
  else if (expDiff >= 3) expRatio = 0.45;
  // If user is higher experience than target, give bonus
  if (userExpVal > targetExpVal) {
    expRatio = Math.min(1.0, expRatio + 0.1);
  }
  const experienceScore = Math.round(expRatio * 100);

  // Final Weighted Calculation
  const finalScore = Math.min(
    99,
    Math.max(
      28,
      Math.round(
        skillsScore * weights.skills +
        interestsScore * weights.interests +
        availabilityScore * weights.availability +
        experienceScore * weights.experience
      )
    )
  );

  const breakdown: ScoreBreakdown = {
    skillsScore,
    interestsScore,
    availabilityScore,
    experienceScore,
    overlappingSkills,
    missingSkills,
    complementarySkills,
    sharedInterests,
    availabilityOverlapHours,
  };

  // Generate dynamic human-readable explanation
  const explanation = generateMatchExplanation(user, project, breakdown, finalScore);
  const complementarityTag = getComplementarityTag(breakdown, user, project);

  return {
    projectId: project.id,
    userId: user.id,
    finalScore,
    breakdown,
    explanation,
    complementarityTag,
  };
}

/**
 * Generates transparent, human-readable reasons from actual score components
 */
function generateMatchExplanation(
  _user: User,
  _project: Project,
  breakdown: ScoreBreakdown,
  score: number
): string {
  const parts: string[] = [];

  // Skill phrase
  if (breakdown.overlappingSkills.length >= 2) {
    parts.push(`Strong overlap in ${breakdown.overlappingSkills.slice(0, 3).join(', ')}`);
  } else if (breakdown.overlappingSkills.length === 1) {
    parts.push(`Direct coverage for ${breakdown.overlappingSkills[0]}`);
  } else if (breakdown.complementarySkills.length > 0) {
    parts.push(`High secondary synergy with ${breakdown.complementarySkills.slice(0, 2).join(' & ')}`);
  } else {
    parts.push('Foundational technical capability match');
  }

  // Availability phrase
  if (breakdown.availabilityOverlapHours >= 15) {
    parts.push(`${breakdown.availabilityOverlapHours}h/wk dedicated sprint capacity`);
  } else if (breakdown.availabilityOverlapHours >= 8) {
    parts.push(`${breakdown.availabilityOverlapHours}h/wk availability alignment`);
  }

  // Interest phrase
  if (breakdown.sharedInterests.length > 0) {
    parts.push(`shared focus on ${breakdown.sharedInterests.slice(0, 2).join(' & ')}`);
  }

  if (parts.length === 0) {
    return 'Balanced core capability alignment across project requirements.';
  }

  const mainReason = parts.join(' + ');
  if (score >= 88) {
    return `Prime synergy: ${mainReason}.`;
  } else if (score >= 75) {
    return `Strong match: ${mainReason}.`;
  } else {
    return `Viable match: ${mainReason}.`;
  }
}

/**
 * Assigns a technical synergy badge
 */
function getComplementarityTag(
  breakdown: ScoreBreakdown,
  user: User,
  _project: Project
): string {
  if (breakdown.skillsScore >= 85 && breakdown.availabilityScore >= 85) {
    return 'Core Execution Anchor';
  }
  if (breakdown.skillsScore >= 80) {
    return 'Direct Technical Match';
  }
  if (breakdown.availabilityScore >= 90) {
    return 'High-Bandwidth Collaborator';
  }
  if (breakdown.interestsScore >= 85) {
    return 'Domain Vision Alignment';
  }
  if (user.experienceLevel === 'Lead' || user.experienceLevel === 'Advanced') {
    return 'Senior Architectural Depth';
  }
  return 'Complementary Builder';
}

/**
 * Team Synthesis Engine:
 * Analyzes how a group of users covers the complete role spectrum of a project
 */
export interface TeamSynthesisAnalysis {
  projectTitle: string;
  totalRolesNeeded: number;
  rolesCovered: number;
  coveragePercentage: number;
  roleCoverage: {
    roleName: string;
    targetSkills: string[];
    assignedBuilder?: User;
    fitScore: number;
    recommendedCandidates: { user: User; fitScore: number }[];
  }[];
  overallTeamSynergy: number;
  synthesisSummary: string;
}

export function analyzeTeamSynthesis(
  project: Project,
  availableUsers: User[]
): TeamSynthesisAnalysis {
  const roleCoverage = project.rolesNeeded.map((role) => {
    // If someone is already assigned
    const assigned = role.assignedUser;

    // Find best candidates for this role from available pool
    const candidates = availableUsers
      .filter((u) => !project.currentMembers.some((m) => m.id === u.id))
      .map((user) => {
        const userSkills = user.skills.map((s) => normalizeStr(s.name));
        const matched = role.skills.filter((rs) =>
          userSkills.some((us) => us.includes(normalizeStr(rs)) || normalizeStr(rs).includes(us))
        );
        const ratio = role.skills.length > 0 ? matched.length / role.skills.length : 0.5;
        const fitScore = Math.min(98, Math.round(ratio * 70 + (user.weeklyAvailability / 20) * 30));
        return { user, fitScore };
      })
      .sort((a, b) => b.fitScore - a.fitScore);

    const fitScore = assigned
      ? 95
      : candidates.length > 0
      ? candidates[0].fitScore
      : 50;

    return {
      roleName: role.roleName,
      targetSkills: role.skills,
      assignedBuilder: assigned,
      fitScore,
      recommendedCandidates: candidates.slice(0, 3),
    };
  });

  const rolesCovered = roleCoverage.filter((r) => r.assignedBuilder !== undefined).length;
  const coveragePercentage = Math.round((rolesCovered / Math.max(1, roleCoverage.length)) * 100);

  const avgRoleFit =
    roleCoverage.reduce((sum, r) => sum + r.fitScore, 0) / Math.max(1, roleCoverage.length);
  const overallTeamSynergy = Math.round(avgRoleFit * 0.6 + coveragePercentage * 0.4);

  let synthesisSummary = '';
  if (rolesCovered === roleCoverage.length) {
    synthesisSummary = 'Full-spectrum squad assembled with complete domain coverage.';
  } else {
    const missing = roleCoverage.filter((r) => !r.assignedBuilder).map((r) => r.roleName);
    synthesisSummary = `High potential squad: missing key execution leads for ${missing.slice(0, 2).join(' & ')}.`;
  }

  return {
    projectTitle: project.title,
    totalRolesNeeded: project.rolesNeeded.length,
    rolesCovered,
    coveragePercentage,
    roleCoverage,
    overallTeamSynergy,
    synthesisSummary,
  };
}
