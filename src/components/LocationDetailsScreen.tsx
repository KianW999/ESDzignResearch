import { useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Leaf, 
  Building2, 
  Calendar, 
  Maximize2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { OfficeProject } from '../types';

interface LocationDetailsProps {
  project: OfficeProject;
  portfolioPhoto?: string | null;
  customBadge?: string | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function LocationDetailsScreen({ 
  project, 
  portfolioPhoto,
  customBadge,
  onClose,
  onNext,
  onPrev
}: LocationDetailsProps) {
  // Support keyboard navigation: Esc to close, Arrow keys to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10"
    >
      {/* Dimmed backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md cursor-pointer" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white text-slate-900 shadow-2xl flex flex-col md:flex-row w-full max-w-5xl h-full max-h-[85vh] relative rounded-2xl z-10 overflow-hidden border border-slate-200"
      >
        {/* Navigation & Close Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {onPrev && (
            <button
              onClick={onPrev}
              title="Previous project"
              aria-label="Previous project"
              className="p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 rounded-full shadow-md border border-slate-200 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              title="Next project"
              aria-label="Next project"
              className="p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 rounded-full shadow-md border border-slate-200 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose} 
            title="Close dossier"
            aria-label="Close dossier"
            className="p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 rounded-full shadow-md border border-slate-200 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Hero & Badge Column */}
        <div className="w-full md:w-[46%] h-[32vh] md:h-full bg-slate-900 flex-shrink-0 relative overflow-hidden group flex flex-col justify-end">
          <img 
            src={project.image} 
            alt={project.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Top Architectural Badge */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-medium tracking-wide rounded-md border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {project.badge}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-medium tracking-wide rounded-md shadow-sm">
              <Building2 className="w-3 h-3 text-slate-600" />
              {project.typology}
            </span>
          </div>

          {/* Bottom Card Image Overlay with User's Interior Visualization Stamp */}
          <div className="relative z-10 p-6 text-white">
            {(portfolioPhoto || customBadge) && (
              <div className="mb-3 inline-flex items-center gap-2.5 px-3 py-1.5 bg-slate-950/90 backdrop-blur-md rounded-full border border-white/20">
                {portfolioPhoto ? (
                  <img 
                    src={portfolioPhoto} 
                    alt="Custom badge" 
                    className="w-5 h-5 rounded-full object-cover border border-white"
                  />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-200">
                  {customBadge || "Visualized in Portfolio Collection"}
                </span>
              </div>
            )}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
              {project.name}
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              {project.firm} · {project.city}, {project.country}
            </p>
          </div>
        </div>

        {/* Editorial Dossier Content Column */}
        <div className="w-full h-full md:w-[54%] flex flex-col p-6 sm:p-8 overflow-y-auto bg-white justify-between">
          <div className="space-y-6">
            
            {/* Header Identity */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-semibold">
                  Interior Design Dossier
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-600 font-semibold">
                  Portfolio Verified
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                {project.name}
              </h1>
              <p className="text-sm font-medium text-slate-600 mt-1">
                Architecture & Interiors by <span className="text-slate-900 font-semibold">{project.firm}</span>
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <div className="flex items-center gap-1 text-[10px] uppercase font-mono text-slate-500 mb-0.5">
                  <Maximize2 className="w-3 h-3 text-slate-400" />
                  Area
                </div>
                <div className="font-semibold text-slate-900">{project.area}</div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-[10px] uppercase font-mono text-slate-500 mb-0.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Completed
                </div>
                <div className="font-semibold text-slate-900">{project.year}</div>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-1 text-[10px] uppercase font-mono text-emerald-700 mb-0.5 font-medium">
                  <Leaf className="w-3 h-3 text-emerald-600" />
                  ESG Certification
                </div>
                <div className="font-semibold text-slate-900 truncate" title={project.esgRating}>
                  {project.esgRating}
                </div>
              </div>
            </div>

            {/* Overview & Spatial Strategy */}
            <div>
              <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-700" />
                Spatial Architecture & Renovation Overview
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {project.overview}
              </p>
            </div>

            {/* ESG & Sustainability Context */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-emerald-950 mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                ESG & Environmental Performance Context
              </h3>
              <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                {project.esgContext}
              </p>
            </div>

            {/* Key Design Highlights */}
            <div>
              <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                Key Workplace & Interior Highlights
              </h3>
              <ul className="space-y-2">
                {project.designHighlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Material & Acoustic Finishes */}
            <div>
              <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-700" />
                Material Palette & Acoustic Finishes
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.materials.map((mat, i) => (
                  <span 
                    key={i} 
                    className="text-[11px] px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium border border-slate-200/60"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Action Footer with Web Links */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <a 
                href={project.webLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                <span>Visit Firm Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                {project.city}, {project.country}
              </span>
            </div>

            <button 
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer"
            >
              Back to 3D Globe
            </button>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
