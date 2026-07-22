import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface WaterLoaderProps {
  progress?: number; // 0 to 100. If omitted, auto-simulates filling.
  variant?: 'circle' | 'bar';
  message?: string;
  className?: string;
}

export default function WaterLoader({
  progress,
  variant = 'circle',
  message,
  className
}: WaterLoaderProps) {
  const [autoProgress, setAutoProgress] = useState(0);

  // If no progress prop is provided, simulate a looping fill
  useEffect(() => {
    if (progress !== undefined) return;
    const interval = setInterval(() => {
      setAutoProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, [progress]);

  const activeProgress = progress !== undefined ? progress : autoProgress;

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4 select-none", className)}>
      
      {variant === 'circle' ? (
        /* ── CIRCULAR LIQUID VESSEL ── */
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Outer Glowing Glass Border */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-[#792359]/20 to-pink-500/20 p-[3px] shadow-lg animate-pulse-glow">
            <div className="w-full h-full rounded-full bg-white/40 dark:bg-[#0f1115]/40 backdrop-blur-md" />
          </div>

          {/* Internal Vessel */}
          <div className="relative w-[130px] h-[130px] rounded-full overflow-hidden bg-gray-100/30 dark:bg-black/40 border border-white/20 dark:border-white/5 shadow-inner">
            
            {/* Water / Liquid Level Container */}
            <div 
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-400 transition-all duration-300 ease-out"
              style={{ height: `${activeProgress}%` }}
            >
              
              {/* Wave 1 (Back wave, slightly darker/slower) */}
              <svg 
                className="absolute left-0 -top-4 w-[200%] h-5 animate-wave-1 fill-blue-700/50" 
                viewBox="0 0 200 20" 
                preserveAspectRatio="none"
              >
                <path d="M0 10 Q25 5, 50 10 T100 10 T150 10 T200 10 L200 20 L0 20 Z" />
              </svg>

              {/* Wave 2 (Front wave, bright cyan/faster) */}
              <svg 
                className="absolute left-0 -top-[14px] w-[200%] h-5 animate-wave-2 fill-cyan-300/80 dark:fill-cyan-400/90" 
                viewBox="0 0 200 20" 
                preserveAspectRatio="none"
              >
                <path d="M0 10 Q25 6, 50 10 T100 10 T150 10 T200 10 L200 20 L0 20 Z" />
              </svg>

              {/* Rising Bubbles inside the liquid */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute bottom-0 left-[15%] w-2 h-2 rounded-full bg-white/40 animate-bubble-1" />
                <div className="absolute bottom-0 left-[45%] w-1.5 h-1.5 rounded-full bg-white/50 animate-bubble-2" />
                <div className="absolute bottom-0 left-[75%] w-2.5 h-2.5 rounded-full bg-white/30 animate-bubble-3" />
                <div className="absolute bottom-0 left-[30%] w-1 h-1 rounded-full bg-white/60 animate-bubble-1 delay-700" />
                <div className="absolute bottom-0 left-[60%] w-2 h-2 rounded-full bg-white/45 animate-bubble-2 delay-500" />
              </div>
            </div>

            {/* Central Progress Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <span className="text-2xl font-black tracking-tight text-gray-800 dark:text-white drop-shadow-md">
                {activeProgress}%
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400 drop-shadow-xs">
                loading
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ── HORIZONTAL LIQUID PROGRESS BAR ── */
        <div className="w-full max-w-sm flex flex-col space-y-2">
          {/* Progress Label */}
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              {message || "Processing request"}
            </span>
            <span className="text-sm font-black text-cyan-600 dark:text-cyan-400">
              {activeProgress}%
            </span>
          </div>

          {/* Liquid Tube Container */}
          <div className="relative w-full h-8 rounded-full p-[2px] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 shadow-md">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-100/40 dark:bg-black/50 border border-white/15 dark:border-white/5 shadow-inner">
              
              {/* Liquid Progress Block */}
              <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${activeProgress}%` }}
              >
                
                {/* Horizontal Waves overlapping at the top of the filling level */}
                <div className="absolute right-0 top-0 bottom-0 w-24 overflow-hidden pointer-events-none">
                  {/* Wave overlay 1 */}
                  <svg 
                    className="absolute right-0 -top-2 w-[200px] h-6 animate-wave-1 fill-blue-700/40" 
                    viewBox="0 0 200 20" 
                    preserveAspectRatio="none"
                  >
                    <path d="M0 10 Q25 5, 50 10 T100 10 T150 10 T200 10 L200 20 L0 20 Z" />
                  </svg>
                  
                  {/* Wave overlay 2 */}
                  <svg 
                    className="absolute right-0 -top-[9px] w-[200px] h-6 animate-wave-2 fill-cyan-300/60 dark:fill-cyan-400/60" 
                    viewBox="0 0 200 20" 
                    preserveAspectRatio="none"
                  >
                    <path d="M0 10 Q25 6, 50 10 T100 10 T150 10 T200 10 L200 20 L0 20 Z" />
                  </svg>
                </div>

                {/* Micro Bubbles in the bar */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-80">
                  <div className="absolute bottom-0 left-[20%] w-1 h-1 rounded-full bg-white/40 animate-bubble-1" />
                  <div className="absolute bottom-0 left-[50%] w-1.5 h-1.5 rounded-full bg-white/50 animate-bubble-2" />
                  <div className="absolute bottom-0 left-[80%] w-1 h-1 rounded-full bg-white/30 animate-bubble-3" />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Subtext description under circular loader */}
      {variant === 'circle' && message && (
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-center max-w-xs leading-relaxed animate-pulse">
          {message}
        </p>
      )}

    </div>
  );
}
