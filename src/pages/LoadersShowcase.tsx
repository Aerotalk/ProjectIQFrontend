import { useState, useEffect } from 'react';
import WaterLoader from '../components/ui/WaterLoader';
import FunkyLoader from '../components/ui/FunkyLoader';
import { FunkySkeleton } from '../components/ui/FunkySkeleton';
import { Play, Pause, RefreshCw, Layers, Droplet, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoadersShowcase() {
  const [waterProgress, setWaterProgress] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Auto-fill animation effect
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setWaterProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTriggerFullscreen = () => {
    setShowFullscreen(true);
    setTimeout(() => {
      setShowFullscreen(false);
    }, 4500); // Automatically turn off after 4.5 seconds
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-16">
      
      {/* Head banner */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="text-[#792359] dark:text-[#c44997] animate-pulse" />
            <span>Funky Loading Showcase</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Explore premium visual indicators, liquid wave progress bars, and shimmer skeletons designed for ProjectIQ.
          </p>
        </div>
        <button 
          onClick={handleTriggerFullscreen}
          className="bg-gradient-to-r from-[#792359] via-pink-600 to-pink-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transform active:scale-95 transition-all flex items-center gap-2"
        >
          <Layers size={16} className="animate-spin" />
          Test Fullscreen Loader (4.5s)
        </button>
      </div>

      {/* Fullscreen loader portal simulation */}
      {showFullscreen && (
        <FunkyLoader message="Running showcase simulation mode..." />
      )}

      {/* Grid of loader categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LIQUID WATER LOADERS DEMO CARD */}
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl shadow-[#792359]/2 relative overflow-hidden flex flex-col justify-between">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Droplet size={20} className="animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Water Progress Bars</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Interactive liquid fluid physics simulation</p>
              </div>
            </div>

            {/* Showcase Containers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center py-6">
              
              {/* Circular Vessel variant */}
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Circular Vessel</span>
                <WaterLoader 
                  progress={waterProgress} 
                  variant="circle" 
                  message="Calibrating fluid levels..."
                />
              </div>

              {/* Horizontal Bar variant */}
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl h-full">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Horizontal Capsule</span>
                <WaterLoader 
                  progress={waterProgress} 
                  variant="bar" 
                  message="Downloading quantum ledger"
                  className="w-full"
                />
              </div>

            </div>
          </div>

          {/* Interactive Controls Panel */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 space-y-4">
            <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Vessel Control Dashboard</span>
            
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={waterProgress} 
                onChange={(e) => {
                  setWaterProgress(Number(e.target.value));
                  setIsPlaying(false); // Stop auto playing on manual scrub
                }}
                className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="text-sm font-black text-cyan-600 dark:text-cyan-400 w-12 text-right">
                {waterProgress}%
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95",
                  isPlaying 
                    ? "bg-amber-500 hover:bg-amber-600 text-white" 
                    : "bg-cyan-600 hover:bg-cyan-700 text-white"
                )}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                {isPlaying ? 'Pause Filling' : 'Auto Fill'}
              </button>

              <button 
                onClick={() => {
                  setWaterProgress(0);
                  setIsPlaying(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
              >
                <RefreshCw size={14} />
                Reset
              </button>

              {/* Set specific levels */}
              {['20', '50', '80', '100'].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setWaterProgress(Number(level));
                    setIsPlaying(false);
                  }}
                  className="px-3 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 rounded-xl transition-all active:scale-95"
                >
                  {level}%
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* SECTION & INLINE LOADERS CARD */}
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl shadow-[#792359]/2 relative overflow-hidden flex flex-col justify-between">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#792359]/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#792359]/10 dark:bg-[#792359]/25 text-[#792359] dark:text-[#e6a8d0] flex items-center justify-center">
                <Layers size={20} className="animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Section & Inline Loaders</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Contextual micro loaders for lists and actions</p>
              </div>
            </div>

            {/* Showcase Containers */}
            <div className="space-y-6">
              
              {/* Section-level loader preview */}
              <div className="p-4 bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 align-self-start w-full text-left">Section Block Loader</span>
                <FunkyLoader variant="section" message="Loading transaction data ledger..." className="py-2" />
              </div>

              {/* Inline / Button indicators preview */}
              <div className="p-4 bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl space-y-4">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest w-full text-left block">Inline & Button Feedbacks</span>
                
                <div className="flex flex-wrap gap-3 items-center">
                  <button className="bg-[#792359] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center">
                    <FunkyLoader variant="inline" className="mr-2" />
                    Saving changes...
                  </button>

                  <button className="bg-[#10b981] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center">
                    <FunkyLoader variant="inline" className="mr-2" />
                    Sending approval...
                  </button>

                  <button className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs flex items-center">
                    <FunkyLoader variant="inline" className="mr-2" />
                    Connecting API...
                  </button>
                  
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 font-bold px-2 py-1">
                    <FunkyLoader variant="inline" className="text-pink-500" />
                    <span>Sync status: updating</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-8 pt-4 text-xs text-gray-400 dark:text-gray-500 leading-relaxed border-t border-gray-100 dark:border-white/5">
            💡 Inline indicators match the exact font size and alignment of their surrounding texts and button structures, preventing layout shifts.
          </div>

        </div>

      </div>

      {/* SHIMMER SKELETON DEMO PANEL */}
      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl shadow-[#792359]/2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Layers size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Premium Shimmer Skeletons</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Content loading placeholders using animated gradients</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          
          {/* Card placeholders */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Card Placeholders</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FunkySkeleton variant="card" />
              <FunkySkeleton variant="card" />
            </div>
          </div>

          {/* Table placeholder rows */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Table Shimmer Layout</span>
            <div className="p-4 bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl space-y-1">
              <FunkySkeleton variant="tableRow" count={3} />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
