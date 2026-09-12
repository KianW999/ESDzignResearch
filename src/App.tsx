import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GalleryGlobe from './components/GalleryGlobe';
import IntroScreen from './components/IntroScreen';
import LocationDetailsScreen from './components/LocationDetailsScreen';
import LoadingOverlay from './components/LoadingOverlay';
import { OfficeProject } from './types';
import { OFFICE_PROJECTS } from './data';
import { RotateCcw, Layers, Compass } from 'lucide-react';

export default function App() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [portfolioPhoto, setPortfolioPhoto] = useState<string | null>(null);
  const [customBadge, setCustomBadge] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<OfficeProject | null>(null);
  const [isLoadingGlobe, setIsLoadingGlobe] = useState(false);

  const handleStart = (photo: string | null, badge: string | null) => {
    setPortfolioPhoto(photo);
    setCustomBadge(badge);
    setIsLaunched(true);
    setIsLoadingGlobe(true);
  };

  const handleReset = () => {
    setSelectedProject(null);
    setIsLaunched(false);
    setPortfolioPhoto(null);
    setCustomBadge(null);
  };

  const handleNextProject = useCallback(() => {
    if (!selectedProject) return;
    const currentIndex = OFFICE_PROJECTS.findIndex(p => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % OFFICE_PROJECTS.length;
    setSelectedProject(OFFICE_PROJECTS[nextIndex]);
  }, [selectedProject]);

  const handlePrevProject = useCallback(() => {
    if (!selectedProject) return;
    const currentIndex = OFFICE_PROJECTS.findIndex(p => p.id === selectedProject.id);
    const prevIndex = (currentIndex - 1 + OFFICE_PROJECTS.length) % OFFICE_PROJECTS.length;
    setSelectedProject(OFFICE_PROJECTS[prevIndex]);
  }, [selectedProject]);

  return (
    <div className="w-full h-full relative bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      {!isLaunched ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white text-slate-900 z-50">
          <IntroScreen onStart={handleStart} />
        </div>
      ) : (
        <>
          <AnimatePresence>
            {isLoadingGlobe && (
              <motion.div
                key="loading-overlay"
                className="absolute inset-0 z-40 bg-slate-950"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <LoadingOverlay onComplete={() => setIsLoadingGlobe(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D Spherical Gallery Globe */}
          <motion.div 
            initial={{ scale: 1, opacity: 0 }}
            animate={
              isLoadingGlobe 
                ? { scale: 1, opacity: 0 } 
                : { scale: selectedProject ? 0.85 : 1, opacity: selectedProject ? 0.35 : 1 }
            }
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-0 ${selectedProject ? 'pointer-events-none' : ''}`}
          >
            <GalleryGlobe 
              portfolioPhoto={portfolioPhoto}
              customBadge={customBadge}
              onSelect={(project) => setSelectedProject(project)} 
            />
          </motion.div>

          {/* Minimalist Top HUD Bar */}
          {!isLoadingGlobe && (
            <header className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-lg">
                <Compass className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold tracking-wider font-mono uppercase text-white">
                    WORKSPACE SPHERE
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    48 Interior Architecture Portfolios
                  </span>
                </div>
              </div>

              <div className="pointer-events-auto flex items-center gap-2">
                {customBadge && (
                  <div className="hidden sm:inline-flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-mono text-slate-300">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Stamp: {customBadge}</span>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md text-white px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium transition-colors shadow-lg cursor-pointer"
                  title="Return to setup"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Settings</span>
                </button>
              </div>
            </header>
          )}

          {/* Minimalist Bottom Interaction Hint */}
          {!isLoadingGlobe && !selectedProject && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-30 px-4"
            >
              <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[11px] font-mono text-slate-400 shadow-xl flex items-center gap-3">
                <span>Drag to rotate</span>
                <span>•</span>
                <span>Scroll to zoom</span>
                <span>•</span>
                <span className="text-white font-medium">Click card for dossier</span>
              </div>
            </motion.div>
          )}

          {/* Project Dossier Modal */}
          <AnimatePresence>
            {selectedProject && (
              <LocationDetailsScreen 
                key={selectedProject.id}
                project={selectedProject}
                portfolioPhoto={portfolioPhoto}
                customBadge={customBadge}
                onClose={() => setSelectedProject(null)}
                onNext={handleNextProject}
                onPrev={handlePrevProject}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
