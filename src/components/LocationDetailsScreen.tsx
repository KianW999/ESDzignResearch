import { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';

interface LocationDetailsProps {
  data: { image: string; location: string; info: string };
  onClose: () => void;
}

export default function LocationDetailsScreen({ data, onClose }: LocationDetailsProps) {
  const info = data.info;
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let pollInterval: any = null;

    const generateVideo = async () => {
      setIsVideoLoading(true);
      setVideoError(false);
      try {
        const response = await fetch('/api/generate-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            imageBase64: data.image,
            prompt: `A beautiful cinematic panning video of ${data.location}`
          })
        });
        const result = await response.json();
        
        if (!result.success || !result.fileId) {
          throw new Error('Failed to start video generation');
        }

        const fileId = result.fileId;

        pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch('/api/video-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fileId })
            });
            const statusResult = await statusRes.json();

            if (statusResult.done && isMounted) {
              clearInterval(pollInterval);
              setVideoUrl(`/api/video-download?fileId=${encodeURIComponent(fileId)}`);
              setIsVideoLoading(false);
            }
          } catch(e) {
            console.error("Polling error", e);
            if (isMounted) {
               setVideoError(true);
               setIsVideoLoading(false);
               clearInterval(pollInterval);
            }
          }
        }, 5000);
      } catch (e) {
        console.error("Video generation error:", e);
        if (isMounted) {
          setVideoError(true);
          setIsVideoLoading(false);
        }
      }
    };

    if (data.image && data.image.startsWith('data:image')) {
      // Optional background video enhancement if supported
      generateVideo();
    }

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [data.image, data.location]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 z-50 flex items-center justify-center p-6 sm:p-12"
    >
      {/* Background click listener */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white shadow-2xl flex flex-col md:flex-row w-full max-w-5xl h-full max-h-[750px] relative rounded-2xl z-10 overflow-hidden"
      >
        
        <button 
          onClick={onClose} 
          aria-label="Close details"
          className="absolute top-5 right-5 p-2.5 bg-white/90 hover:bg-white transition-colors z-20 shadow-md border border-gray-200/80 rounded-full flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-800" />
        </button>

        <div className="w-full md:w-[45%] h-[35vh] md:h-full bg-gray-100 flex-shrink-0 relative overflow-hidden group">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover" 
            />
          ) : (
            <img 
              src={data.image} 
              alt={data.location} 
              className="w-full h-full object-cover transition-transform duration-[15s] ease-linear hover:scale-105" 
            />
          )}

          {isVideoLoading && (
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-white text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Generating video...</span>
            </div>
          )}
        </div>

        <div className="w-full h-full md:w-[55%] flex flex-col p-6 sm:p-8 md:p-12 overflow-y-auto bg-white justify-between">
          <div className="font-sans text-gray-700 text-base leading-relaxed space-y-4 [&>h1]:text-2xl [&>h1]:md:text-4xl [&>h1]:font-bold [&>h1]:tracking-tight [&>h1]:text-gray-900 [&>h1]:mb-6 [&>p]:leading-relaxed [&>p]:mb-4">
            <Markdown>{info.split('\n').find(l => l.trim().startsWith('#')) || `# ${data.location}`}</Markdown>
            
            <Markdown>{info.split('\n').filter(l => !l.trim().startsWith('#')).join('\n') || "A remarkable destination to explore."}</Markdown>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>Anywhere Travel Explorer</span>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Return to Globe
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
