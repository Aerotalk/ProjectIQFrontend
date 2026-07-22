import { useState, useEffect } from 'react';
import { Sparkles, Layers, Zap, Rocket, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const FUNKY_TAGLINES = [
  "Powering up ProjectIQ engine...",
  "Assembling financial ledger & BI dashboards...",
  "Initializing quantum workspace modules...",
  "Polishing the premium pixels...",
  "Syncing clients, POs, and quotations...",
  "Preparing your ultimate productivity suite..."
];

interface FunkyLoaderProps {
  message?: string;
  fullScreen?: boolean; // Kept for backward compatibility
  variant?: 'fullscreen' | 'section' | 'inline';
  className?: string;
}

export default function FunkyLoader({ 
  message, 
  fullScreen, 
  variant = 'fullscreen', 
  className 
}: FunkyLoaderProps) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);
  const [fullscreenProgress, setFullscreenProgress] = useState(0);

  // Map backward compatible fullScreen prop
  const activeVariant = fullScreen !== undefined 
    ? (fullScreen ? 'fullscreen' : 'section') 
    : variant;

  // Auto-progress simulation for fullscreen mode
  useEffect(() => {
    if (activeVariant !== 'fullscreen') return;
    const interval = setInterval(() => {
      setFullscreenProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 70);
    return () => clearInterval(interval);
  }, [activeVariant]);

  useEffect(() => {
    if (activeVariant === 'inline') return;

    const taglineInterval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % FUNKY_TAGLINES.length);
    }, 2200);

    const iconInterval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % 5);
    }, 1500);

    return () => {
      clearInterval(taglineInterval);
      clearInterval(iconInterval);
    };
  }, [activeVariant]);

  const Icons = [Sparkles, Layers, Zap, Rocket, ShieldCheck];
  const CurrentIcon = Icons[iconIndex % Icons.length];

  // ── INLINE VARIANT ──
  if (activeVariant === 'inline') {
    return (
      <span className={cn("relative w-4 h-4 inline-flex items-center justify-center shrink-0 align-middle", className)}>
        {/* Outer Ring */}
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#792359] border-r-pink-500 animate-spin" />
        {/* Inner Ring */}
        <span className="absolute inset-[2px] rounded-full border border-transparent border-b-purple-500 border-l-amber-400 animate-spin-reverse" />
      </span>
    );
  }

  // ── SECTION VARIANT ──
  if (activeVariant === 'section') {
    return (
      <div className={cn("w-full py-12 flex flex-col items-center justify-center bg-transparent select-none", className)}>
        <div className="relative flex flex-col items-center p-6 rounded-2xl bg-white/70 dark:bg-[#181a1f]/85 backdrop-blur-md border border-gray-200/50 dark:border-white/10 shadow-lg space-y-4 text-center max-w-[280px] w-full animate-pulse-glow">
          {/* Animated Spinner Box */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Glowing Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#792359] via-purple-500 to-pink-500 opacity-20 blur-xs" />
            {/* Outer Spin */}
            <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-[#792359] border-r-pink-500 animate-spin duration-1000" />
            {/* Inner Reverse Spin */}
            <div className="absolute inset-1.5 rounded-full border-3 border-transparent border-b-purple-500 border-l-amber-400 animate-spin-reverse duration-1500" />
            {/* Core Icon */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#792359] to-pink-600 flex items-center justify-center text-white shadow-md">
              <CurrentIcon size={16} className="animate-bounce" />
            </div>
          </div>

          <div className="space-y-2 w-full">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">
              {message || "Loading information..."}
            </p>
            {/* Mini Progress Bar */}
            <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-[#792359] via-pink-500 to-amber-400 rounded-full animate-progress-indeterminate" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── FULLSCREEN WATER LOADER VARIANT ──
  return (
    <div className={cn("fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f1115] overflow-hidden select-none transition-colors duration-300", className)}>
      
      {/* Background Ambient Glowing Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-32 w-[450px] h-[450px] bg-[#792359]/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Central Glass Card */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full mx-auto p-8 rounded-3xl bg-white/70 dark:bg-[#181a1f]/80 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300">
        
        {/* Dynamic Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#792359] via-purple-600 to-pink-500 tracking-tight flex items-center justify-center gap-2">
            Loading...
          </h2>
        </div>

        {/* Circular Water Progress Vessel */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Outer Glowing Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/25 via-[#792359]/25 to-pink-500/25 p-[2px] shadow-lg animate-pulse-glow" />

          {/* Liquid Container */}
          <div className="relative w-[132px] h-[132px] rounded-full overflow-hidden bg-gray-100/40 dark:bg-black/50 border border-white/20 dark:border-white/5 shadow-inner">
            
            {/* Water Wave Fill */}
            <div 
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-400 transition-all duration-150 ease-out"
              style={{ height: `${fullscreenProgress}%` }}
            >
              {/* Back Wave */}
              <svg 
                className="absolute left-0 -top-4 w-[200%] h-5 animate-wave-1 fill-blue-700/50" 
                viewBox="0 0 200 20" 
                preserveAspectRatio="none"
              >
                <path d="M0 10 Q25 5, 50 10 T100 10 T150 10 T200 10 L200 20 L0 20 Z" />
              </svg>

              {/* Front Wave */}
              <svg 
                className="absolute left-0 -top-[14px] w-[200%] h-5 animate-wave-2 fill-cyan-300/80 dark:fill-cyan-400/90" 
                viewBox="0 0 200 20" 
                preserveAspectRatio="none"
              >
                <path d="M0 10 Q25 6, 50 10 T100 10 T150 10 T200 10 L200 20 L0 20 Z" />
              </svg>

              {/* Floating Bubbles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute bottom-0 left-[15%] w-1.5 h-1.5 rounded-full bg-white/40 animate-bubble-1" />
                <div className="absolute bottom-0 left-[50%] w-1 h-1 rounded-full bg-white/50 animate-bubble-2" />
                <div className="absolute bottom-0 left-[80%] w-2 h-2 rounded-full bg-white/30 animate-bubble-3" />
                <div className="absolute bottom-0 left-[35%] w-1 h-1 rounded-full bg-white/60 animate-bubble-1 delay-500" />
              </div>
            </div>

            {/* Inner Ring Spinning Core for futuristic hybrid look */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-transparent">
              <span className="text-2xl font-black tracking-tight text-gray-800 dark:text-white drop-shadow-md">
                {fullscreenProgress}%
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400 drop-shadow-xs flex items-center gap-1">
                <CurrentIcon size={10} className="animate-bounce" />
                <span>compiling</span>
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Tagline */}
        <div className="w-full pt-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 h-8 flex items-center justify-center transition-all duration-300">
            {message || FUNKY_TAGLINES[taglineIndex]}
          </p>
        </div>

        {/* Bottom capsule loader as a final premium layout detail */}
        <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-pink-500 rounded-full transition-all duration-150" style={{ width: `${fullscreenProgress}%` }} />
        </div>

      </div>

    </div>
  );
}
