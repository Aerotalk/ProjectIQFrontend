import { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, CheckCircle2, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formStyles } from './form-styles';

export type SelectOption = string | { label: string; value: string; subtitle?: React.ReactNode; description?: React.ReactNode; subLabel?: React.ReactNode };

interface CustomSelectProps {
  value: string | string[];
  onChange: (val: any) => void;
  options: SelectOption[];
  icon?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  emptyText?: string;
  placeholder?: string;
  className?: string;
  isMulti?: boolean;
}

export default function CustomSelect({ value, onChange, options, icon, disabled, isLoading, loadingText, emptyText, placeholder, className, isMulti }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const getOptionLabel = (opt: SelectOption) => typeof opt === 'string' ? opt : opt.label;
  const getOptionValue = (opt: SelectOption) => typeof opt === 'string' ? opt : opt.value;

  // Find the currently selected label(s) based on the value
  const displayLabel = useMemo(() => {
    if (isMulti) {
      const arr = (value as string[]) || [];
      if (arr.length === 0) return placeholder || "Select...";
      const labels = options.filter(opt => arr.includes(getOptionValue(opt))).map(getOptionLabel);
      if (labels.length > 0) return labels.join(', ');
      return options.length === 0 ? "Loading options..." : (placeholder || "Select...");
    } else {
      const selectedOpt = options.find(opt => getOptionValue(opt) === (value as string));
      return selectedOpt 
        ? getOptionLabel(selectedOpt) 
        : (isLoading ? (loadingText || "Loading...") : ((value as string) || placeholder || "Select..."));
    }
  }, [value, isMulti, options, isLoading, loadingText, placeholder]);



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
        className={cn(
          formStyles.field(false, disabled),
          "cursor-pointer flex items-center justify-between",
          icon ? "pl-9" : "",
          className,
          isOpen ? "border-[#792359] ring-2 ring-[#792359]/20" : ""
        )}
      >
        <span className="truncate pr-4">{displayLabel}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#792359]' : ''}`} />
      </div>

      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute left-0 top-[calc(100%+4px)] w-full bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl max-h-64 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 z-[99999]"
        >
          <div className="p-2 border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white dark:bg-[#181a1f] z-10 rounded-t-lg">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 rounded-md focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="overflow-y-auto custom-scrollbar py-1 flex-1">
            {isLoading ? (
              <div className="px-3 py-3 text-sm text-gray-500 text-center flex flex-col items-center gap-2">
                <Loader2 size={16} className="animate-spin text-[#792359]" />
                <span>{loadingText || 'Loading...'}</span>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">{emptyText || 'No results found'}</div>
            ) : (
              filteredOptions.map((option, index) => {
                const optValue = getOptionValue(option);
                const optLabel = getOptionLabel(option);
                const isSelected = isMulti ? ((value as string[]) || []).includes(optValue) : (value as string) === optValue;
                const isObj = typeof option !== 'string';
                const subLabel = isObj && 'subLabel' in option ? option.subLabel : undefined;

                return (
                  <div 
                    key={`${optValue}-${index}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isMulti) {
                        const arr = (value as string[]) || [];
                        if (arr.includes(optValue)) {
                          onChange(arr.filter(v => v !== optValue));
                        } else {
                          onChange([...arr, optValue]);
                        }
                      } else {
                        onChange(optValue);
                        setSearchQuery('');
                        setIsOpen(false);
                        setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 0);
                      }
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between gap-2 mx-1 rounded-md ${
                      isSelected 
                        ? 'bg-[#792359]/10 text-[#792359] dark:bg-[#792359]/20 dark:text-[#e6a8d0] font-medium' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className={isSelected ? 'font-semibold truncate' : 'truncate'}>{optLabel}</span>
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
                    {isSelected && <CheckCircle2 size={15} className="shrink-0 text-[#792359] dark:text-[#e6a8d0]" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
