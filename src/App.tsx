import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GalleryGlobe from './components/GalleryGlobe';
import LocationDetailsScreen from './components/LocationDetailsScreen';
import { OfficeProject } from './types';
import { OFFICE_PROJECTS } from './data';
import { 
  Compass, 
  RotateCcw, 
  Play, 
  Pause, 
  Search, 
  ListFilter, 
  Maximize2, 
  Minimize2, 
  X, 
  Building2, 
  MapPin,
  ChevronRight,
  Layers
} from 'lucide-react';

const CATEGORIES = [
  "All",
  "Biophilic",
  "Headquarters",
  "Adaptive Reuse",
  "Timber & Craft",
  "High ESG / Net Zero"
];

export default function App() {
  const [selectedProject, setSelectedProject] = useState<OfficeProject | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Search & Directory Drawer State
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const handleResetView = () => {
    setResetSignal(prev => prev + 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Filtered projects for the directory search
  const filteredProjects = useMemo(() => {
    return OFFICE_PROJECTS.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.firm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.typology.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.badge.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === "All") return true;
      if (selectedCategory === "Biophilic") {
        return p.typology.toLowerCase().includes("biophilic") || 
               p.overview.toLowerCase().includes("biophilic") ||
               p.overview.toLowerCase().includes("garden") ||
               p.badge.toLowerCase().includes("biophilic");
      }
      if (selectedCategory === "Headquarters") {
        return p.typology.toLowerCase().includes("hq") || 
               p.typology.toLowerCase().includes("headquarters") ||
               p.name.toLowerCase().includes("hq");
      }
      if (selectedCategory === "Adaptive Reuse") {
        return p.typology.toLowerCase().includes("reuse") || 
               p.typology.toLowerCase().includes("adaptive") ||
               p.overview.toLowerCase().includes("adaptive") ||
               p.overview.toLowerCase().includes("industrial");
      }
      if (selectedCategory === "Timber & Craft") {
        return p.typology.toLowerCase().includes("timber") || 
               p.materials.some(m => m.toLowerCase().includes("timber") || m.toLowerCase().includes("oak") || m.toLowerCase().includes("wood"));
      }
      if (selectedCategory === "High ESG / Net Zero") {
        return p.esgRating.includes("Outstanding") || 
               p.esgRating.includes("Platinum") || 
               p.esgRating.includes("Zero") ||
               p.badge.includes("LEED") ||
               p.badge.includes("BREEAM");
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="fixed inset-0 w-full h-full min-h-screen bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      {/* 3D Spherical Gallery Globe - Loaded straight away */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ 
          opacity: selectedProject ? 0.3 : 1, 
          scale: selectedProject ? 0.88 : 1 
        }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute inset-0 ${selectedProject ? 'pointer-events-none' : ''}`}
      >
        <GalleryGlobe 
          autoRotate={autoRotate}
          resetSignal={resetSignal}
          onSelect={(project) => setSelectedProject(project)} 
        />
      </motion.div>

      {/* Top Architectural HUD Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-5 flex items-center justify-between pointer-events-none">
        {/* Left: Branding & Core Meta */}
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-xl">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider font-mono uppercase text-white">
                WORKSPACE SPHERE
              </span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 font-mono rounded">
                48 WORKS
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              Interactive 3D Interior Architecture Gallery
            </span>
          </div>
        </div>

        {/* Right: Quick Tools & Directory Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Open Directory Button */}
          <button
            onClick={() => setIsDirectoryOpen(true)}
            className="flex items-center gap-2 bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md text-white px-3.5 py-2 rounded-xl border border-white/10 text-xs font-medium transition-colors shadow-xl cursor-pointer"
            title="Browse all 48 office portfolios"
          >
            <ListFilter className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Directory</span>
            <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono text-slate-300">
              48
            </span>
          </button>

          {/* Toggle Auto Rotation */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl backdrop-blur-md border transition-colors shadow-xl cursor-pointer ${
              autoRotate 
                ? 'bg-slate-900/85 hover:bg-slate-800 border-white/10 text-emerald-400' 
                : 'bg-slate-900/85 hover:bg-slate-800 border-white/10 text-slate-400'
            }`}
            title={autoRotate ? "Pause rotation" : "Resume auto-rotation"}
          >
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Reset Orbit View */}
          <button
            onClick={handleResetView}
            className="p-2 bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md text-slate-300 hover:text-white rounded-xl border border-white/10 transition-colors shadow-xl cursor-pointer"
            title="Recenter camera view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex p-2 bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md text-slate-300 hover:text-white rounded-xl border border-white/10 transition-colors shadow-xl cursor-pointer"
            title="Toggle fullscreen view"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Bottom Floating Interaction Guide */}
      {!selectedProject && !isDirectoryOpen && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute bottom-5 left-0 right-0 flex justify-center pointer-events-none z-20 px-4"
        >
          <div className="bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[11px] font-mono text-slate-300 shadow-2xl flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Drag to rotate
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Scroll to zoom</span>
            <span className="text-slate-600">•</span>
            <span className="text-white font-medium">Click any card to inspect design dossier</span>
          </div>
        </motion.div>
      )}

      {/* Searchable Directory Drawer */}
      <AnimatePresence>
        {isDirectoryOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm"
          >
            <div 
              className="absolute inset-0 cursor-pointer" 
              onClick={() => setIsDirectoryOpen(false)} 
            />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-full max-w-md h-full bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    Interior Portfolios Directory
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    48 Curated Workplace Architectures
                  </p>
                </div>
                <button
                  onClick={() => setIsDirectoryOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search & Filter Controls */}
              <div className="p-4 border-b border-white/10 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search office, firm, city, or ESG..."
                    className="w-full bg-slate-800/90 text-white pl-9 pr-4 py-2 rounded-lg border border-white/10 text-xs focus:outline-none focus:border-emerald-500 transition-colors font-sans placeholder:text-slate-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Results List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredProjects.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 font-mono text-xs">
                    No portfolios match your query.
                  </div>
                ) : (
                  filteredProjects.map((project, idx) => (
                    <div
                      key={project.id}
                      onClick={() => {
                        setSelectedProject(project);
                        setIsDirectoryOpen(false);
                      }}
                      className="group p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={project.image} 
                          alt={project.name} 
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-white/10 group-hover:scale-105 transition-transform" 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono text-emerald-400">
                              #{String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="text-xs font-semibold text-white truncate">
                              {project.name}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {project.firm} · {project.city}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">
                            {project.badge}
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer Summary */}
              <div className="p-3 border-t border-white/10 text-center text-[10px] font-mono text-slate-500 bg-slate-900/90">
                Showing {filteredProjects.length} of {OFFICE_PROJECTS.length} iconic architectural portfolios
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Dossier Modal */}
      <AnimatePresence>
        {selectedProject && (
          <LocationDetailsScreen 
            key={selectedProject.id}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onNext={handleNextProject}
            onPrev={handlePrevProject}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
