import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';

interface SmartActionMenuProps {
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
  children: ReactNode;
}

export default function SmartActionMenu({ isOpen, onToggle, children }: SmartActionMenuProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<'down' | 'up'>('down');

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      
      // Default to window bounds
      let spaceBelow = window.innerHeight - buttonRect.bottom;
      let spaceAbove = buttonRect.top;
      
      // Check for clipping container
      const scrollContainer = buttonRef.current.closest('.overflow-x-auto, .overflow-y-auto, .overflow-auto, .overflow-hidden');
      if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        // Calculate space within the scroll container
        const spaceBelowContainer = containerRect.bottom - buttonRect.bottom;
        const spaceAboveContainer = buttonRect.top - containerRect.top;
        
        // Take the most restrictive bound
        spaceBelow = Math.min(spaceBelow, spaceBelowContainer);
        spaceAbove = Math.min(spaceAbove, spaceAboveContainer);
      }
      
      // Calculate based on typical dropdown height (around 120-150px for 3 items)
      // plus some safety padding. 180 safely covers at least the last 2-3 rows.
      const estimatedDropdownHeight = 180; 
      
      if (spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow) {
        setPosition('up');
      } else {
        setPosition('down');
      }
    }
  }, [isOpen]);

  return (
    <>
      <button 
        ref={buttonRef}
        onClick={onToggle}
        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors inline-flex"
      >
        <MoreVertical size={16} />
      </button>
      {isOpen && (
        <div 
          className={`absolute right-8 w-36 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-lg z-10 py-1 text-left ${
            position === 'up' 
              ? 'bottom-10 origin-bottom-right' 
              : 'top-10 origin-top-right'
          }`}
        >
          {children}
        </div>
      )}
    </>
  );
}
