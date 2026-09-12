import * as THREE from 'three';
import { useMemo, useRef, useState, useEffect } from 'react';
import { CARD_WIDTH, CARD_HEIGHT, GLOBE_RADIUS, LOCATIONS, getLandmarkImageUrl } from '../data';
import locationInfoData from '../locationInfo.json';

interface CardProps {
  index: number;
  position: THREE.Vector3;
  scale?: number;
  userPhoto: string;
  onSelect: (image: string, location: string, info: string) => void;
  onHover?: (info: string) => void;
  onHoverOut?: () => void;
}

export default function Card({ index, position, scale = 1, userPhoto, onSelect, onHover, onHoverOut }: CardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [cardInfo, setCardInfo] = useState<{ base64: string; location: string, info: string } | null>(null);
  
  // Create a default material
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let active = true;
    const location = LOCATIONS[index % LOCATIONS.length];
    const info = (locationInfoData as Record<string, string>)[location] || `# ${location}\n\nA breathtaking travel destination waiting to be explored.`;
    const destinationImg = getLandmarkImageUrl(location, index);

    // Initial canvas while loading
    const initialCanvas = document.createElement('canvas');
    initialCanvas.width = 400;
    initialCanvas.height = 500;
    const gCtx = initialCanvas.getContext('2d');
    if (gCtx) {
      gCtx.fillStyle = '#E5E5E5';
      gCtx.fillRect(0, 0, 400, 500);
    }
    const initialTex = new THREE.CanvasTexture(initialCanvas);
    initialTex.minFilter = THREE.LinearMipmapLinearFilter;
    initialTex.generateMipmaps = true;
    setTexture(initialTex);

    setCardInfo({ base64: destinationImg, location, info });

    // Load destination image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = destinationImg;

    img.onload = () => {
      if (!active) return;

      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background landmark photo
      ctx.drawImage(img, 0, 0, 400, 500);

      // Add a stylish gradient overlay at the bottom for readability
      const grad = ctx.createLinearGradient(0, 340, 0, 500);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.5)');
      grad.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 340, 400, 160);

      // Location title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 6;
      ctx.fillText(location.split(',')[0], 20, 470, 260);

      // If user provided a photo, render a sleek circular traveler badge on the card
      if (userPhoto) {
        const userImg = new Image();
        userImg.onload = () => {
          if (!active) return;
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(340, 440, 34, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#FFFFFF';
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(userImg, 306, 406, 68, 68);
          ctx.restore();

          let finalUrl = destinationImg;
          try {
            finalUrl = canvas.toDataURL('image/jpeg', 0.85);
          } catch {
            // cross-origin canvas taint fallback
          }
          setCardInfo({ base64: finalUrl, location, info });
          const newTex = new THREE.CanvasTexture(canvas);
          newTex.minFilter = THREE.LinearMipmapLinearFilter;
          newTex.generateMipmaps = true;
          setTexture(newTex);
        };
        userImg.src = userPhoto;
      } else {
        let finalUrl = destinationImg;
        try {
          finalUrl = canvas.toDataURL('image/jpeg', 0.85);
        } catch {
          // cross-origin canvas taint fallback
        }
        setCardInfo({ base64: finalUrl, location, info });
        const newTex = new THREE.CanvasTexture(canvas);
        newTex.minFilter = THREE.LinearMipmapLinearFilter;
        newTex.generateMipmaps = true;
        setTexture(newTex);
      }
    };

    img.onerror = () => {
      if (!active) return;
      new THREE.TextureLoader().setCrossOrigin('anonymous').load(destinationImg, (loadedTex) => {
        if (!active) return;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTex.generateMipmaps = true;
        setTexture(loadedTex);
      });
    };

    return () => {
      active = false;
    };
  }, [index, userPhoto]);

  useEffect(() => {
    if (hovered && cardInfo && onHover) {
      onHover(cardInfo.info);
    }
  }, [cardInfo, hovered, onHover]);

  const rotationQuaternion = useMemo(() => {
    const dummy = new THREE.Object3D();
    dummy.position.copy(position);
    // The local forward vector (+Z) points directly outward from center (0,0,0)
    dummy.lookAt(position.clone().multiplyScalar(2));
    return dummy.quaternion.clone();
  }, [position]);

  const geometry = useMemo(() => {
    // 32x32 segments for smooth curving
    // Scale the dimensions before applying the bend, so it sits perfectly curve-flush on the sphere
    const width = CARD_WIDTH * scale;
    const height = CARD_HEIGHT * scale;
    const geo = new THREE.PlaneGeometry(width, height, 32, 32);
    const pos = geo.attributes.position;
    
    // Curve the plane to match the sphere's surface
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      const theta = x / GLOBE_RADIUS;
      const phi = y / GLOBE_RADIUS;
      
      const newX = GLOBE_RADIUS * Math.sin(theta) * Math.cos(phi);
      const newY = GLOBE_RADIUS * Math.sin(phi);
      // Offset by GLOBE_RADIUS so its local center remains at (0,0,0)
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
        if (cardInfo) {
          onSelect(cardInfo.base64, cardInfo.location, cardInfo.info);
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
        if (cardInfo && onHover) {
          onHover(cardInfo.info);
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
        if (onHoverOut) {
          onHoverOut();
        }
      }}
    >
      {/* DoubleSide allows the interior views of the cards to be seen when passing through */}
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
