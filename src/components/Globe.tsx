import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateFibonacciSphere } from '../utils/math';
import { GLOBE_RADIUS, TOTAL_CARDS } from '../data';
import { OfficeProject } from '../types';
import Card from './Card';

interface GlobeProps {
  portfolioPhoto?: string | null;
  customBadge?: string | null;
  rotationState: React.MutableRefObject<{ x: number, y: number }>;
  velocityState: React.MutableRefObject<{ x: number, y: number }>;
  isDragging: React.MutableRefObject<boolean>;
  lastInteraction: React.MutableRefObject<number>;
  onSelect: (project: OfficeProject) => void;
  onHover?: (project: OfficeProject) => void;
  onHoverOut?: () => void;
}

export default function Globe({ 
  portfolioPhoto, 
  customBadge,
  rotationState, 
  velocityState, 
  isDragging, 
  lastInteraction, 
  onSelect, 
  onHover, 
  onHoverOut 
}: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Precalculate the spherical positions on Fibonacci sphere
  const cardData = useMemo(() => {
    const rawPositions = generateFibonacciSphere(TOTAL_CARDS, GLOBE_RADIUS);
    return rawPositions.map((pos) => ({
      position: pos,
      // Subtle variations in card scale between 0.75x and 1.15x for dynamic architectural rhythm
      scale: 0.8 + (Math.sin(pos.x * 2.5 + pos.y * 3.1) + 1) * 0.17
    }));
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    
    // Continuously apply velocity to rotation
    rotationState.current.x += velocityState.current.x;
    rotationState.current.y += velocityState.current.y;

    // Limit X axis rotation (pitch) to prevent disorienting inversion
    rotationState.current.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, rotationState.current.x));

    if (!isDragging.current) {
      // Apply momentum decay (friction damping)
      velocityState.current.x *= 0.93;
      velocityState.current.y *= 0.93;

      // Ambient Idle Rotation
      if (Date.now() - lastInteraction.current > 1800) {
        // Smooth architectural spin
        velocityState.current.y += 0.00012; 
      }
    } else {
      // While grabbed, velocity decays faster unless actively moved
      velocityState.current.x *= 0.35;
      velocityState.current.y *= 0.35;
    }

    groupRef.current.rotation.x = rotationState.current.x;
    groupRef.current.rotation.y = rotationState.current.y;
  });

  return (
    <group ref={groupRef}>
      {cardData.map((data, i) => (
        <Card 
          key={i} 
          index={i} 
          position={data.position} 
          scale={data.scale} 
          portfolioPhoto={portfolioPhoto} 
          customBadge={customBadge}
          onSelect={(project) => {
            if (!isDragging.current) {
              onSelect(project);
            }
          }}
          onHover={onHover}
          onHoverOut={onHoverOut}
        />
      ))}
    </group>
  );
}
