import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CustomTimePickerProps {
  value?: string; // HH:mm format expected (24h internally)
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function CustomTimePicker({ value, onChange, disabled, className }: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse initial value (HH:mm) to internal state
  const parseTime = (timeStr?: string) => {
    if (!timeStr) return { h: 9, m: 0, ampm: 'AM' };
    const [hh, mm] = timeStr.split(':').map(Number);
    if (isNaN(hh) || isNaN(mm)) return { h: 9, m: 0, ampm: 'AM' };
    const ampm = hh >= 12 ? 'PM' : 'AM';
    const h = hh % 12 || 12;
    return { h, m: mm, ampm };
  };

  const [time, setTime] = useState(parseTime(value));

  // Sync internal state if value prop changes
  useEffect(() => {
    setTime(parseTime(value));
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (updates: Partial<typeof time>) => {
    const newTime = { ...time, ...updates };
    setTime(newTime);
    if (onChange) {
      // Convert to 24h format HH:mm for standard input compliance
      let hours24 = newTime.h;
      if (newTime.ampm === 'PM' && hours24 !== 12) hours24 += 12;
      if (newTime.ampm === 'AM' && hours24 === 12) hours24 = 0;
      
      const formatted = `${hours24.toString().padStart(2, '0')}:${newTime.m.toString().padStart(2, '0')}`;
      onChange(formatted);
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10, ... 55
  const meridians = ['AM', 'PM'];

  const displayTime = `${time.h.toString().padStart(2, '0')}:${time.m.toString().padStart(2, '0')} ${time.ampm}`;

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div 
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-sm border rounded-sm transition-colors",
          disabled 
            ? "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 cursor-not-allowed" 
            : "bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:border-primary/50 cursor-pointer",
          isOpen && !disabled && "ring-1 ring-primary border-primary"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span>{value ? displayTime : 'Select time...'}</span>
        <Clock size={16} className="text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 rounded-sm shadow-lg overflow-hidden flex h-48 animate-in fade-in slide-in-from-top-2">
          {/* Hours */}
          <div className="flex-1 overflow-y-auto custom-scrollbar border-r border-gray-100 dark:border-white/5 snap-y">
            {hours.map(h => (
              <div 
                key={h}
                className={cn(
                  "px-4 py-2 text-sm text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 snap-center transition-colors",
                  time.h === h ? "bg-primary/10 text-primary dark:text-secondary font-semibold" : "text-gray-700 dark:text-gray-300"
                )}
                onClick={() => handleSelect({ h })}
              >
                {h.toString().padStart(2, '0')}
              </div>
            ))}
          </div>
          
          {/* Minutes */}
          <div className="flex-1 overflow-y-auto custom-scrollbar border-r border-gray-100 dark:border-white/5 snap-y">
            {minutes.map(m => (
              <div 
                key={m}
                className={cn(
                  "px-4 py-2 text-sm text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 snap-center transition-colors",
                  time.m === m ? "bg-primary/10 text-primary dark:text-secondary font-semibold" : "text-gray-700 dark:text-gray-300"
                )}
                onClick={() => handleSelect({ m })}
              >
                {m.toString().padStart(2, '0')}
              </div>
            ))}
          </div>

          {/* AM/PM */}
          <div className="flex-1 overflow-y-auto custom-scrollbar snap-y">
            {meridians.map(ampm => (
              <div 
                key={ampm}
                className={cn(
                  "px-4 py-3 text-sm text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 snap-center transition-colors h-1/2 flex items-center justify-center",
                  time.ampm === ampm ? "bg-primary/10 text-primary dark:text-secondary font-semibold" : "text-gray-700 dark:text-gray-300"
                )}
                onClick={() => {
                  handleSelect({ ampm });
                  setIsOpen(false); // Auto-close when AM/PM is selected
                }}
              >
                {ampm}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
