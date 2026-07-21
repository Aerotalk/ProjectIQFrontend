import { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, CheckCircle2, Search } from 'lucide-react';

export type SelectOption = string | { label: string; value: string; subLabel?: React.ReactNode };

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  icon?: React.ReactNode;
  disabled?: boolean;
}

export default function CustomSelect({ value, onChange, options, icon, disabled }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getOptionLabel = (opt: SelectOption) => typeof opt === 'string' ? opt : opt.label;
  const getOptionValue = (opt: SelectOption) => typeof opt === 'string' ? opt : opt.value;

  // Find the currently selected label based on the value
  const selectedLabel = options.find(opt => getOptionValue(opt) === value);
  const displayLabel = selectedLabel ? getOptionLabel(selectedLabel) : (value || "Select...");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const lowerQuery = searchQuery.toLowerCase();
    return options.filter(opt => getOptionLabel(opt).toLowerCase().includes(lowerQuery));
  }, [options, searchQuery]);

  return (
    <div className="relative" ref={dropdownRef}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
          {icon}
        </div>
      )}
      <div 
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 py-2 bg-gray-50 dark:bg-black/20 border ${isOpen ? 'border-[#792359]' : 'border-gray-200 dark:border-white/10'} rounded-sm text-sm text-gray-900 dark:text-white transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} flex items-center justify-between shadow-sm`}
      >
        <span className="truncate pr-4">{displayLabel}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[200] w-full mt-1.5 bg-white dark:bg-[#1f2228] border border-gray-100 dark:border-white/10 rounded-md shadow-2xl max-h-60 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white dark:bg-[#1f2228] z-10">
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
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">No results found</div>
            ) : (
              filteredOptions.map((option, index) => {
                const optValue = getOptionValue(option);
                const optLabel = getOptionLabel(option);
                const isSelected = value === optValue;
                const subLabel = typeof option === 'object' && 'subLabel' in option ? option.subLabel : undefined;

                return (
                  <div 
                    key={`${optValue}-${index}`}
                    onClick={() => {
                      onChange(optValue);
                      setSearchQuery('');
                      setIsOpen(false);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                      isSelected 
                        ? 'bg-[#792359]/10 text-[#792359] dark:text-[#e6a8d0] font-medium' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="truncate">{optLabel}</span>
                      {subLabel && (
                        <span className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-[#792359]/80 dark:text-[#e6a8d0]/80' : 'text-gray-500 dark:text-gray-400'}`}>
                          {subLabel}
                        </span>
                      )}
                    </div>
                    {isSelected && <CheckCircle2 size={14} className="shrink-0" />}
                  </div>
                );
              }))}
          </div>
        </div>
      )}
    </div>
  );
}
