import * as THREE from 'three';
import { useMemo, useRef, useState, useEffect } from 'react';
import { CARD_WIDTH, CARD_HEIGHT, GLOBE_RADIUS, getOfficeProject } from '../data';
import { OfficeProject } from '../types';

interface CardProps {
  index: number;
  position: THREE.Vector3;
  scale?: number;
  portfolioPhoto?: string | null;
  customBadge?: string | null;
  onSelect: (project: OfficeProject) => void;
  onHover?: (project: OfficeProject) => void;
  onHoverOut?: () => void;
}

export default function Card({ 
  index, 
  position, 
  scale = 1, 
  portfolioPhoto, 
  customBadge, 
  onSelect, 
  onHover, 
  onHoverOut 
}: CardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  const project: OfficeProject = useMemo(() => {
    return getOfficeProject(index);
  }, [index]);

  useEffect(() => {
    let active = true;

    // Create high-performance Canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initial placeholder background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 400, 500);

    const initialTex = new THREE.CanvasTexture(canvas);
    initialTex.minFilter = THREE.LinearMipmapLinearFilter;
    initialTex.generateMipmaps = true;
    setTexture(initialTex);

    const drawCard = (userImgElement?: HTMLImageElement) => {
      if (!active || !ctx) return;

      // Draw photo
      ctx.clearRect(0, 0, 400, 500);
      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, 400, 500);
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 400, 500);
      }

      // Top Header Badge 1: LinkedIN button box
      ctx.save();
      const isLinkedIn = project.badge === 'LinkedIN';
      ctx.fillStyle = isLinkedIn ? '#0A66C2' : 'rgba(15, 23, 42, 0.82)';
      const badgeText = project.badge;
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      const textMetrics = ctx.measureText(badgeText);
      const badgeW = Math.max(textMetrics.width + 24, 76);
      const badgeH = 26;
      
      // Draw rounded rectangle for LinkedIN badge
      ctx.beginPath();
      ctx.roundRect(16, 16, badgeW, badgeH, 5);
      ctx.fill();

      // LinkedIN Badge text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillText(badgeText, 25, 33);

      // Top Header Badge 2: contact button box
      const contactText = project.typology || 'contact';
      const contactMetrics = ctx.measureText(contactText);
      const contactW = Math.max(contactMetrics.width + 20, 64);
      const contactX = 16 + badgeW + 8;

      ctx.beginPath();
      ctx.fillStyle = '#25D366';
      ctx.roundRect(contactX, 16, contactW, badgeH, 5);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillText(contactText, contactX + 11, 33);

      ctx.restore();

      // Bottom Gradient vignette for contrast
      const grad = ctx.createLinearGradient(0, 310, 0, 500);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0)');
      grad.addColorStop(0.35, 'rgba(15, 23, 42, 0.65)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 310, 400, 190);

      // Thin architectural divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(18, 415);
      ctx.lineTo(382, 415);
      ctx.stroke();

      // Studio Firm / Sub-title
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 11px system-ui, -apple-system, sans-serif';
      ctx.fillText(project.firm, 18, 432, 360);

      // Project Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(project.name, 18, 458, 280);
      ctx.shadowBlur = 0;

      // Bottom-left boxed-up "contact" button
      ctx.beginPath();
      ctx.fillStyle = '#25D366';
      ctx.roundRect(18, 467, 58, 20, 4);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
      ctx.fillText('contact', 26, 481);

      // Year text next to boxed-up contact button
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 11px system-ui, -apple-system, sans-serif';
      ctx.fillText(`· ${project.year}`, 84, 481);

      // Render custom interior badge / portfolio stamp if user provided
      if (userImgElement && userImgElement.complete) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 12;
        
        // Circular stamp
        ctx.beginPath();
        ctx.arc(344, 448, 30, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();
        ctx.clip();

        ctx.drawImage(userImgElement, 314, 418, 60, 60);
        ctx.restore();
      } else if (customBadge) {
        // Render custom badge pill at bottom-right
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(290, 438, 94, 26, 13);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 9px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(customBadge.toUpperCase(), 337, 454, 86);
        ctx.restore();
      }

      // Update Three.js texture
      const newTex = new THREE.CanvasTexture(canvas);
      newTex.minFilter = THREE.LinearMipmapLinearFilter;
      newTex.generateMipmaps = true;
      setTexture(newTex);
    };

    // Load project image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = project.image;

    const fallbackTimer = setTimeout(() => {
      if (active && (!img.complete || img.naturalWidth === 0)) {
        drawCard();
      }
    }, 2500);

    img.onload = () => {
      if (!active) return;
      clearTimeout(fallbackTimer);
      if (portfolioPhoto) {
        const uImg = new Image();
        uImg.crossOrigin = 'anonymous';
        uImg.onload = () => {
          if (!active) return;
          drawCard(uImg);
        };
        uImg.onerror = () => {
          if (!active) return;
          drawCard();
        };
        uImg.src = portfolioPhoto;
      } else {
        drawCard();
      }
    };

    img.onerror = () => {
      if (!active) return;
      clearTimeout(fallbackTimer);
      // Fallback texture
      drawCard();
    };

    return () => {
      active = false;
      clearTimeout(fallbackTimer);
    };
  }, [project, portfolioPhoto, customBadge]);

  useEffect(() => {
    if (hovered && onHover) {
      onHover(project);
    }
  }, [hovered, project, onHover]);

  const rotationQuaternion = useMemo(() => {
    const dummy = new THREE.Object3D();
    dummy.position.copy(position);
    dummy.lookAt(position.clone().multiplyScalar(2));
    return dummy.quaternion.clone();
  }, [position]);

  const geometry = useMemo(() => {
    const width = CARD_WIDTH * scale;
    const height = CARD_HEIGHT * scale;
    const geo = new THREE.PlaneGeometry(width, height, 32, 32);
    const pos = geo.attributes.position;
    
    // Curve the plane to match the sphere's surface curvature
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      const theta = x / GLOBE_RADIUS;
      const phi = y / GLOBE_RADIUS;
      
      const newX = GLOBE_RADIUS * Math.sin(theta) * Math.cos(phi);
      const newY = GLOBE_RADIUS * Math.sin(phi);
      const newZ = GLOBE_RADIUS * Math.cos(theta) * Math.cos(phi) - GLOBE_RADIUS;
      
      pos.setXYZ(i, newX, newY, newZ);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, [scale]);

  return (
    <mesh 
      position={position} 
      quaternion={rotationQuaternion}
      ref={meshRef} 
      geometry={geometry} 
      onClick={(e) => {
        e.stopPropagation();
        if (e.uv && e.uv.y > 0.88) {
          if (e.uv.x < 0.28) {
            window.open(project.linkedInLink || "https://www.linkedin.com/company/ESGrp", "_blank", "noopener,noreferrer");
            return;
          }
          if (e.uv.x < 0.50) {
            window.open(project.contactLink || "https://wa.me/60126185866", "_blank", "noopener,noreferrer");
            return;
          }
        }
        // Bottom-left boxed-up contact button (UV y is in bottom 12%, x < 0.30)
        if (e.uv && e.uv.y < 0.12 && e.uv.x < 0.30) {
          window.open(project.contactLink || "https://wa.me/60126185866", "_blank", "noopener,noreferrer");
          return;
        }
        onSelect(project);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
        if (onHoverOut) {
          onHoverOut();
        }
      }}
    >
      {texture && (
        <meshBasicMaterial 
          map={texture} 
          side={THREE.DoubleSide} 
          toneMapped={false} 
        />
      )}
    </mesh>
  );
}
