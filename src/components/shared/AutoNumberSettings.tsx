import { useState, useRef, useEffect } from 'react';
import { Settings, X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

interface AutoNumberInputProps {
  name: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  defaultPrefix?: string;
}

export function AutoNumberInput({ name, disabled, placeholder, className, defaultPrefix = '' }: AutoNumberInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { register, setValue } = useFormContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState({
    prefix: defaultPrefix,
    suffix: '',
    padding: 4,
    nextNumber: 1
  });

  const generatePreview = () => {
    const numStr = String(settings.nextNumber).padStart(settings.padding, '0');
    return `${settings.prefix}${numStr}${settings.suffix}`;
  };

  const applySettings = () => {
    setValue(name, generatePreview(), { shouldValidate: true, shouldDirty: true });
    setIsOpen(false);
  };

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
    <div className="relative flex items-center gap-2">
      <input 
        type="text" 
        {...register(name)} 
        disabled={disabled}
        placeholder={placeholder}
        className={`flex-1 ${className}`} 
      />
      
      {!disabled && (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-400 hover:text-[#792359] dark:hover:text-[#e6a8d0] hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors"
            title="Auto Numbering Settings"
          >
            <Settings size={16} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#1f2228] border border-gray-200 dark:border-white/10 rounded-md shadow-2xl z-[100] p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/5 pb-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Auto Numbering</h4>
                <button type="button" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={16}/></button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Prefix</label>
                  <input type="text" value={settings.prefix} onChange={e => setSettings({...settings, prefix: e.target.value})} className="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:outline-none focus:border-[#792359] dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Suffix</label>
                  <input type="text" value={settings.suffix} onChange={e => setSettings({...settings, suffix: e.target.value})} className="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:outline-none focus:border-[#792359] dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Next Number</label>
                  <input type="number" min="1" value={settings.nextNumber} onChange={e => setSettings({...settings, nextNumber: parseInt(e.target.value) || 1})} className="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:outline-none focus:border-[#792359] dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Padding</label>
                  <input type="number" min="1" max="10" value={settings.padding} onChange={e => setSettings({...settings, padding: parseInt(e.target.value) || 1})} className="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:outline-none focus:border-[#792359] dark:text-white" />
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-black/20 p-2 rounded-sm border border-gray-200 dark:border-white/5 text-center">
                <span className="text-xs text-gray-500 block mb-1">Preview</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{generatePreview()}</span>
              </div>

              <button type="button" onClick={applySettings} className="w-full py-1.5 bg-[#792359] text-white text-sm rounded-sm hover:bg-[#52173c] transition-colors">Apply</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
