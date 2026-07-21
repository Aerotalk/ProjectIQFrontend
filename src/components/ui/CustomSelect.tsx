import { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, CheckCircle2, Search, Loader2 } from 'lucide-react';

export type SelectOption = string | { label: string; value: string; subtitle?: React.ReactNode; description?: React.ReactNode; subLabel?: React.ReactNode };

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  icon?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  emptyText?: string;
}

export default function CustomSelect({ value, onChange, options, icon, disabled, isLoading, loadingText, emptyText }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const getOptionLabel = (opt: SelectOption) => typeof opt === 'string' ? opt : opt.label;
  const getOptionValue = (opt: SelectOption) => typeof opt === 'string' ? opt : opt.value;

  // Find the currently selected label based on the value
  const selectedLabel = options.find(opt => getOptionValue(opt) === value);
  const displayLabel = selectedLabel 
    ? getOptionLabel(selectedLabel) 
    : (isLoading ? (loadingText || "Loading...") : (value || "Select..."));

  const updatePosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 6, // 6px mt-1.5 equivalent
        left: rect.left,
        width: rect.width,
        zIndex: 999999
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleScroll = (e: Event) => {
        if (menuRef.current && menuRef.current.contains(e.target as Node)) {
          return;
        }
        updatePosition();
      };
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const lowerQuery = searchQuery.toLowerCase();
    return options.filter(opt => {
      const labelMatch = getOptionLabel(opt).toLowerCase().includes(lowerQuery);
      let subtitleMatch = false;
      let descMatch = false;
      if (typeof opt !== 'string') {
         subtitleMatch = typeof opt.subtitle === 'string' && opt.subtitle.toLowerCase().includes(lowerQuery);
         descMatch = typeof opt.description === 'string' && opt.description.toLowerCase().includes(lowerQuery);
      }
      return labelMatch || subtitleMatch || descMatch;
    });
  }, [options, searchQuery]);

  return (
    <div className="relative" ref={dropdownRef}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
          {icon}
        </div>
      )}
      <div
        ref={triggerRef}
        tabIndex={disabled ? -1 : 0}
        onClick={(e) => {
          if (!disabled) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 py-2 bg-gray-50 dark:bg-black/20 border ${isOpen ? 'border-[#792359]' : 'border-gray-200 dark:border-white/10'} rounded-sm text-sm text-gray-900 dark:text-white transition-all ${disabled ? 'opacity-50 cursor-not-allowed outline-none' : 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#792359]/50'} flex items-center justify-between shadow-sm`}
      >
        <span className="truncate pr-4">{displayLabel}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && createPortal(
        <div 
          ref={menuRef}
          style={dropdownStyle}
          className="bg-white dark:bg-[#1f2228] border border-gray-100 dark:border-white/10 rounded-md shadow-2xl max-h-60 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="p-2 border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white dark:bg-[#1f2228] z-10 rounded-t-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:outline-none focus:border-[#792359] dark:focus:border-[#792359] text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="overflow-y-auto custom-scrollbar py-1 flex-1">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center flex flex-col items-center gap-2">
                <Loader2 size={16} className="animate-spin text-[#792359]" />
                <span>{loadingText || 'Loading...'}</span>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">{emptyText || 'No results found'}</div>
            ) : (
              filteredOptions.map((option, index) => {
                const optValue = getOptionValue(option);
                const optLabel = getOptionLabel(option);
                const isSelected = value === optValue;
                const isObj = typeof option !== 'string';
                const subLabel = isObj && 'subLabel' in option ? option.subLabel : undefined;

                return (
                  <div 
                    key={`${optValue}-${index}`}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevents focus loss from input before click fires
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onChange(optValue);
                      setSearchQuery('');
                      setIsOpen(false);
                      // Restore focus to trigger to prevent scroll jump
                      setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 0);
                    }}
                    className={`px-3 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                      isSelected 
                        ? 'bg-[#792359]/10 text-[#792359] dark:text-[#e6a8d0]' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className={isSelected ? 'font-medium truncate' : 'truncate'}>{optLabel}</span>
                      {subLabel && (
                        <span className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-[#792359]/80 dark:text-[#e6a8d0]/80' : 'text-gray-500 dark:text-gray-400'}`}>
                          {subLabel}
                        </span>
                      )}
                      {isObj && (option as any).subtitle && !subLabel && (
                        <span className="text-xs opacity-75 mt-0.5 block truncate">{(option as any).subtitle}</span>
                      )}
                      {isObj && (option as any).description && !subLabel && (
                        <span className="text-xs opacity-50 mt-0.5 block line-clamp-2">{(option as any).description}</span>
                      )}
                    </div>
                    {isSelected && <CheckCircle2 size={14} className="shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
