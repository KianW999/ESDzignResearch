import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '../data';
import { OfficeProject } from '../types';
import Globe from './Globe';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const DEFAULT_CAMERA_Z = isMobile ? 26.0 : 18.5;

function CameraController({ targetZ }: { targetZ: React.MutableRefObject<number> }) {
  useFrame((state) => {
    // Smooth camera Z damping
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z, 
      targetZ.current, 
      0.06
    );
  });
  return null;
}

interface GalleryGlobeProps {
  portfolioPhoto?: string | null;
  customBadge?: string | null;
  autoRotate?: boolean;
  resetSignal?: number;
  onSelect: (project: OfficeProject) => void;
}

export default function GalleryGlobe({ 
  portfolioPhoto, 
  customBadge, 
  autoRotate = true,
  resetSignal,
  onSelect 
}: GalleryGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction State Maps
  const targetZ = useRef(DEFAULT_CAMERA_Z);
  const rotationState = useRef({ x: 0, y: 0 });
  const velocityState = useRef({ x: 0, y: 0.002 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const lastInteractionTime = useRef(Date.now() - 3000);
  const pointerPos = useRef({ x: 0, y: 0 });

  // Reset orbit handler when resetSignal increments
  useEffect(() => {
    if (resetSignal) {
      targetZ.current = DEFAULT_CAMERA_Z;
      rotationState.current = { x: 0, y: 0 };
      velocityState.current = { x: 0, y: 0.002 };
      lastInteractionTime.current = Date.now();
    }
  }, [resetSignal]);

  // Cursor UI state
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<OfficeProject | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      lastInteractionTime.current = Date.now();
      
      const delta = e.deltaY;
      targetZ.current += delta * 0.015;
      
      // Clamp zoom range
      targetZ.current = Math.max(-GLOBE_RADIUS * 0.7, Math.min(isMobile ? 36 : 28, targetZ.current));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    setIsMouseDown(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
    lastInteractionTime.current = Date.now();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    pointerPos.current = { x: e.clientX, y: e.clientY };
    if (tooltipRef.current) {
      tooltipRef.current.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 16}px)`;
    }

    if (!isDragging.current) return;
    
    const deltaX = e.clientX - lastMouse.current.x;
    const deltaY = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    
    velocityState.current.y += deltaX * 0.004;
    velocityState.current.x += deltaY * 0.004;
    
    lastInteractionTime.current = Date.now();
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    setIsMouseDown(false);
    lastInteractionTime.current = Date.now();
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full relative select-none ${isMouseDown ? 'cursor-grabbing' : 'cursor-grab'}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas camera={{ position: [0, 0, DEFAULT_CAMERA_Z], fov: 45, near: 0.1 }}>
        <CameraController targetZ={targetZ} />
        <Suspense fallback={null}>
          <Globe 
            portfolioPhoto={portfolioPhoto}
            customBadge={customBadge}
            autoRotate={autoRotate}
            rotationState={rotationState}
            velocityState={velocityState}
            isDragging={isDragging}
            lastInteraction={lastInteractionTime}
            onSelect={onSelect}
            onHover={(proj) => setHoveredProject(proj)}
            onHoverOut={() => setHoveredProject(null)}
          />
        </Suspense>
      </Canvas>

      {/* Sleek Minimalist Architectural Tooltip */}
      {hoveredProject && (
        <div
          ref={tooltipRef}
          className="pointer-events-none fixed top-0 left-0 z-50 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-lg font-sans text-xs border border-white/10 shadow-2xl transition-opacity duration-150"
          style={{ 
            willChange: 'transform',
            transform: `translate(${pointerPos.current.x + 16}px, ${pointerPos.current.y + 16}px)`
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm tracking-tight text-white">{hoveredProject.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-medium">
              {hoveredProject.badge}
            </span>
          </div>
          <div className="text-slate-400 text-[11px]">
            {hoveredProject.firm} · {hoveredProject.city}, {hoveredProject.country}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Click to view interior design dossier
          </div>
        </div>
      )}
    </div>
  );
}
