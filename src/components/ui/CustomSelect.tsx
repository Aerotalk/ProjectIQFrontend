import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

export type SelectOption = string | { label: string; value: string };

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  icon?: React.ReactNode;
}

export default function CustomSelect({ value, onChange, options, icon }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getOptionLabel = (opt: SelectOption) => typeof opt === 'string' ? opt : opt.label;
  const getOptionValue = (opt: SelectOption) => typeof opt === 'string' ? opt : opt.value;

  // Find the currently selected label based on the value
  const selectedLabel = options.find(opt => getOptionValue(opt) === value);
  const displayLabel = selectedLabel ? getOptionLabel(selectedLabel) : (value || "Select...");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
          {icon}
        </div>
      )}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 py-2 bg-gray-50 dark:bg-black/20 border ${isOpen ? 'border-[#792359]' : 'border-gray-200 dark:border-white/10'} rounded-sm text-sm text-gray-900 dark:text-white transition-all cursor-pointer flex items-center justify-between shadow-sm`}
      >
        <span className="truncate pr-4">{displayLabel}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[200] w-full mt-1.5 bg-white dark:bg-[#1f2228] border border-gray-100 dark:border-white/10 rounded-md shadow-2xl max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-2 duration-200 custom-scrollbar">
          {options.map((option, index) => {
            const optValue = getOptionValue(option);
            const optLabel = getOptionLabel(option);
            const isSelected = value === optValue;

            return (
              <div 
                key={`${optValue}-${index}`}
                onClick={() => {
                  onChange(optValue);
                  setIsOpen(false);
                }}
                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors flex items-center gap-2 ${
                  isSelected 
                    ? 'bg-[#792359]/10 text-[#792359] dark:text-[#e6a8d0] font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {optLabel}
                {isSelected && <CheckCircle2 size={14} className="ml-auto shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
