import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  User,
  Project,
  JoinRequest,
  AlgorithmWeights,
  MatchResult,
  RequestStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_JOIN_REQUESTS,
} from '../data/mockData';
import {
  DEFAULT_WEIGHTS,
  calculateMatchScore,
} from '../engine/matching';

export type NavigationTab = 'overview' | 'projects' | 'requests' | 'profile' | 'create';
export type ThemeMode = 'dark' | 'light';

interface AppContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  currentUser: User;
  users: User[];
  projects: Project[];
  requests: JoinRequest[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  synthesisModalProjectId: string | null;
  setSynthesisModalProjectId: (id: string | null) => void;
  algorithmWeights: AlgorithmWeights;
  setAlgorithmWeights: (weights: AlgorithmWeights) => void;
  engineModalOpen: boolean;
  setEngineModalOpen: (open: boolean) => void;
  switchActiveUser: (userId: string) => void;
  updateCurrentUserProfile: (updatedData: Partial<User>) => void;
  createNewProject: (newProject: Omit<Project, 'id' | 'code' | 'ownerId' | 'ownerName' | 'ownerAvatar' | 'createdAt'>) => Project;
  sendJoinRequest: (projectId: string, message: string) => boolean;
  updateRequestStatus: (requestId: string, newStatus: RequestStatus) => void;
  getProjectMatch: (project: Project) => MatchResult;
  allMatches: { project: Project; match: MatchResult }[];
  pendingRequestsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('pm_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('pm_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('pm_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem('pm_current_user_id');
    return saved || INITIAL_USERS[0].id; // Maya Patel by default
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('pm_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [requests, setRequests] = useState<JoinRequest[]>(() => {
    const saved = localStorage.getItem('pm_requests');
    return saved ? JSON.parse(saved) : INITIAL_JOIN_REQUESTS;
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [synthesisModalProjectId, setSynthesisModalProjectId] = useState<string | null>(null);
  const [algorithmWeights, setAlgorithmWeights] = useState<AlgorithmWeights>(() => {
    const saved = localStorage.getItem('pm_weights');
    return saved ? JSON.parse(saved) : DEFAULT_WEIGHTS;
  });
  const [engineModalOpen, setEngineModalOpen] = useState(false);

  // Sync to local storage for persistence across turns
  useEffect(() => {
    localStorage.setItem('pm_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('pm_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('pm_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('pm_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('pm_weights', JSON.stringify(algorithmWeights));
  }, [algorithmWeights]);

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const switchActiveUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
    }
  };

  const updateCurrentUserProfile = (updatedData: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updatedData } : u))
    );
  };

  const getProjectMatch = (project: Project): MatchResult => {
    return calculateMatchScore(currentUser, project, algorithmWeights);
  };

  const allMatches = useMemo(() => {
    return projects
      .map((project) => ({
        project,
        match: calculateMatchScore(currentUser, project, algorithmWeights),
      }))
      .sort((a, b) => b.match.finalScore - a.match.finalScore);
  }, [projects, currentUser, algorithmWeights]);

  const createNewProject = (
    newProjectData: Omit<Project, 'id' | 'code' | 'ownerId' | 'ownerName' | 'ownerAvatar' | 'createdAt'>
  ): Project => {
    const nextCode = String(projects.length + 43).padStart(4, '0');
    const newProj: Project = {
      ...newProjectData,
      id: `proj-${Date.now()}`,
      code: nextCode,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatar,
      currentMembers: [currentUser],
      status: 'Recruiting',
      createdAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProj, ...prev]);
    return newProj;
  };

  const sendJoinRequest = (projectId: string, message: string): boolean => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return false;

    // Check if request already exists
    const existing = requests.find(
      (r) => r.projectId === projectId && r.senderId === currentUser.id
    );
    if (existing) return false;

    const match = getProjectMatch(project);

    const newReq: JoinRequest = {
      id: `req-${Date.now()}`,
      projectId: project.id,
      projectTitle: project.title,
      projectCode: project.code,
      projectOwnerId: project.ownerId,
      projectOwnerName: project.ownerName,
      projectOwnerAvatar: project.ownerAvatar,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRoleTitle: currentUser.roleTitle,
      senderAvatar: currentUser.avatar,
      senderSkills: currentUser.skills.map((s) => s.name),
      message: message || 'Would love to join the team and contribute to this mission.',
      matchScore: match.finalScore,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      type: 'sent',
    };

    setRequests((prev) => [newReq, ...prev]);
    return true;
  };

  const updateRequestStatus = (requestId: string, newStatus: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return { ...r, status: newStatus };
        }
        return r;
      })
    );

    // If accepted, add user to project members
    if (newStatus === 'ACCEPTED') {
      const req = requests.find((r) => r.id === requestId);
      if (req) {
        const sender = users.find((u) => u.id === req.senderId);
        if (sender) {
          setProjects((prev) =>
            prev.map((proj) => {
              if (proj.id === req.projectId) {
                const alreadyMember = proj.currentMembers.some((m) => m.id === sender.id);
                if (!alreadyMember) {
                  return {
                    ...proj,
                    currentMembers: [...proj.currentMembers, sender],
                  };
                }
              }
              return proj;
            })
          );
        }
      }
    }
  };

  // Count pending received requests for active user
  const pendingRequestsCount = useMemo(() => {
    return requests.filter(
      (r) =>
        r.status === 'PENDING' &&
        (r.projectOwnerId === currentUser.id || r.type === 'received')
    ).length;
  }, [requests, currentUser]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        currentUser,
        users,
        projects,
        requests,
        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        synthesisModalProjectId,
        setSynthesisModalProjectId,
        algorithmWeights,
        setAlgorithmWeights,
        engineModalOpen,
        setEngineModalOpen,
        switchActiveUser,
        updateCurrentUserProfile,
        createNewProject,
        sendJoinRequest,
        updateRequestStatus,
        getProjectMatch,
        allMatches,
        pendingRequestsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
