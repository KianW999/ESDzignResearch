import { useState, useRef } from 'react';
import { 
  Building2, 
  ArrowRight, 
  Camera, 
  Upload, 
  Sparkles, 
  Compass, 
  CheckCircle2,
  Layers
} from 'lucide-react';
import { PRESET_BADGES, BadgeOption } from '../data';

interface IntroScreenProps {
  onStart: (photo: string | null, badge: string | null) => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [selectedPreset, setSelectedPreset] = useState<BadgeOption>(PRESET_BADGES[0]);
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [useCamera, setUseCamera] = useState(false);
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setUseCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (e) {
      console.error("Camera access denied", e);
      setUseCamera(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const w = videoRef.current.videoWidth;
      const h = videoRef.current.videoHeight;
      canvasRef.current.width = w;
      canvasRef.current.height = h;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, w, h);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCustomPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setUseCamera(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLaunch = () => {
    if (activeTab === 'custom' && customPhoto) {
      onStart(customPhoto, 'CUSTOM STUDIO STAMP');
    } else {
      onStart(null, selectedPreset.label);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-2xl mx-auto px-6 py-8 font-sans overflow-y-auto">
      
      {/* Brand Identity */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-medium tracking-wider uppercase border border-slate-200">
          <Building2 className="w-3.5 h-3.5 text-slate-700" />
          <span>Architectural Portfolio Exhibition</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 font-display mb-3">
          WORKSPACE SPHERE
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
          An interactive 3D spherical gallery featuring <span className="text-slate-900 font-semibold">48 iconic office interior architectures</span>, workplace renovations, and in-depth ESG design dossiers.
        </p>
      </div>

      {/* Office Visualization Configurator */}
      <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 mb-6">
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Office Visualization
            </div>
            <div className="text-sm font-semibold text-slate-900">
              Select Interior Portfolio Badge Stamp
            </div>
          </div>

          {/* Toggle between Curated Preset & Custom Photo Stamp */}
          <div className="flex bg-slate-200/70 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => { setActiveTab('preset'); stopCamera(); }}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'preset' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Curated Badges
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'custom' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upload Stamp
            </button>
          </div>
        </div>

        {activeTab === 'preset' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_BADGES.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={`flex items-start gap-3 p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-white border-slate-900 ring-1 ring-slate-900 shadow-sm' 
                      : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-800 mt-0.5">
                    {preset.iconType === 'leed' && <Sparkles className="w-4 h-4 text-emerald-600" />}
                    {preset.iconType === 'biophilic' && <Building2 className="w-4 h-4 text-teal-600" />}
                    {preset.iconType === 'acoustic' && <Layers className="w-4 h-4 text-indigo-600" />}
                    {preset.iconType === 'minimal' && <Compass className="w-4 h-4 text-slate-600" />}
                    {preset.iconType === 'studio' && <CheckCircle2 className="w-4 h-4 text-slate-900" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 tracking-wide font-mono">
                      {preset.label}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {preset.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200">
            {customPhoto ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-900 shadow-md">
                  <img src={customPhoto} alt="Studio Stamp Preview" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs font-mono font-medium text-slate-700">
                  Custom Studio Stamp Ready
                </div>
                <button
                  onClick={() => setCustomPhoto(null)}
                  className="text-[11px] text-slate-500 hover:text-red-600 underline cursor-pointer"
                >
                  Remove / Change Photo
                </button>
              </div>
            ) : useCamera ? (
              <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                <div className="w-full aspect-video bg-slate-900 rounded-lg overflow-hidden">
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                </div>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={takePhoto}
                    className="flex-1 py-2 bg-slate-900 hover:bg-black text-white text-xs font-medium rounded-lg"
                  >
                    Capture Stamp
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-3 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-xs font-medium rounded-lg transition-colors cursor-pointer w-full sm:w-auto"
                >
                  <Upload className="w-4 h-4 text-slate-600" />
                  Upload Studio Logo / Photo
                </button>
                <button
                  onClick={startCamera}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-xs font-medium rounded-lg transition-colors cursor-pointer w-full sm:w-auto"
                >
                  <Camera className="w-4 h-4 text-slate-600" />
                  Capture Webcam Stamp
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
            <p className="text-[11px] text-slate-400 text-center mt-3">
              Your photo or studio mark will be stamped across all 48 interior cards in the 3D sphere.
            </p>
          </div>
        )}
      </div>

      {/* Primary Enter Button */}
      <div className="w-full flex flex-col items-center gap-3">
        <button
          onClick={handleLaunch}
          className="w-full py-4 px-6 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-medium tracking-wide text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span>Explore 48 Curated Workspaces in 3D</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 text-slate-400 text-[11px] font-mono">
          <span>48 Workspaces</span>
          <span>•</span>
          <span>Smooth Orbit Controls</span>
          <span>•</span>
          <span>Design Dossiers & ESG</span>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
