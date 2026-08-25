import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AmbientBackground } from './components/AmbientBackground';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/views/DashboardView';
import { ProjectsView } from './components/views/ProjectsView';
import { RequestsView } from './components/views/RequestsView';
import { ProfileView } from './components/views/ProfileView';
import { CreateProjectWizard } from './components/views/CreateProjectWizard';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { TeamSynthesisView } from './components/TeamSynthesisView';
import { EngineSettingsModal } from './components/EngineSettingsModal';
import { X } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    selectedProjectId,
    setSelectedProjectId,
    synthesisModalProjectId,
    setSynthesisModalProjectId,
    projects,
  } = useApp();

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const synthesisProject = projects.find((p) => p.id === synthesisModalProjectId);

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-[#8C7355]/30 dark:selection:bg-[#C8A578]/30 selection:text-[#1A1A1A] dark:selection:text-[#F3F3F5]">
      {/* Ambient background lighting and fine paper grain */}
      <AmbientBackground />

      {/* Top Bar Navigation */}
      <TopBar />

      {/* Main Content Viewport */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'overview' && <DashboardView />}
        {activeTab === 'projects' && <ProjectsView />}
        {activeTab === 'requests' && <RequestsView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'create' && <CreateProjectWizard />}
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProjectId(null)}
        />
      )}

      {/* Dedicated Team Synthesis Modal */}
      {synthesisProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#FFFFFF] dark:bg-[#121216] rounded-2xl overflow-hidden shadow-2xl border border-[#1A1A1A]/15 dark:border-white/[0.1] my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]/10 dark:border-white/[0.08] bg-[#FAF8F5] dark:bg-[#18181F]">
              <span className="font-mono text-xs text-[#8C7355] dark:text-[#C8A578] font-bold uppercase tracking-wider">
                SQUAD SYNTHESIS MATRIX // {synthesisProject.title}
              </span>
              <button
                onClick={() => setSynthesisModalProjectId(null)}
                className="p-1.5 rounded-lg bg-[#FFFFFF] dark:bg-[#18181F] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] text-[#767064] dark:text-[#9E9EA8] hover:text-[#1A1A1A] dark:hover:text-white border border-[#1A1A1A]/10 dark:border-white/[0.08]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto bg-[#FFFFFF] dark:bg-[#121216]">
              <TeamSynthesisView
                project={synthesisProject}
                onClose={() => setSynthesisModalProjectId(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Algorithm Engine Inspector Modal */}
      <EngineSettingsModal />

      {/* Editorial Footer */}
      <footer className="relative z-10 border-t border-[#1A1A1A]/10 dark:border-white/[0.08] bg-[#FAF8F5] dark:bg-[#0E0E12] py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#5C564C] dark:text-[#82828F]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8C7355] dark:bg-[#C8A578]" />
            <span className="font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">ProjectMatch</span>
            <span>// Synthesis Intelligence Platform</span>
          </div>
          <div>
            Deterministic Multi-Vector Matching (Skills 45%, Interests 20%, Availability 20%, Seniority 15%)
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
