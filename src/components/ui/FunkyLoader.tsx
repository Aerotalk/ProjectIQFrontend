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

  // Map backward compatible fullScreen prop
  const activeVariant = fullScreen !== undefined 
    ? (fullScreen ? 'fullscreen' : 'section') 
    : variant;

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

  // ── FULLSCREEN VARIANT ──
  return (
    <div className={cn("fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f1115] overflow-hidden select-none transition-colors duration-300", className)}>
      
      {/* Background Ambient Glowing Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#792359]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Central Glass Card */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full mx-auto p-8 rounded-3xl bg-white/70 dark:bg-[#181a1f]/80 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300">
        
        {/* Animated Multi-Ring Spinner Box */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer Glowing Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#792359] via-purple-500 to-pink-500 opacity-20 blur-md animate-pulse" />
          {/* Outer Fast Spin Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#792359] border-r-pink-500 animate-spin duration-1000" />
          {/* Middle Reverse Spin Ring */}
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-500 border-l-amber-400 animate-spin-reverse duration-1500" />
          {/* Inner Pulsing Core */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#792359] to-pink-600 flex items-center justify-center text-white shadow-lg shadow-[#792359]/30 transform transition-transform duration-500 scale-105">
            <CurrentIcon size={24} className="animate-bounce" />
          </div>
        </div>

        {/* Brand Header */}
        <div className="space-y-1">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
            <span>Project</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#792359] via-purple-600 to-pink-500">IQ</span>
          </h2>

          {/* Dynamic Cycling Tagline */}
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 h-8 flex items-center justify-center transition-all duration-300">
            {message || FUNKY_TAGLINES[taglineIndex]}
          </p>
        </div>

        {/* Animated Progress Bar & Pulsing Dots */}
        <div className="w-full space-y-3 pt-1">
          <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-[#792359] via-pink-500 to-amber-400 rounded-full animate-progress-indeterminate" />
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#792359] animate-ping" />
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping delay-200" />
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping delay-400" />
          </div>
        </div>

      </div>

    </div>
  );
}
