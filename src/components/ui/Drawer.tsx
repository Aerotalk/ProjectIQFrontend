import { X } from 'lucide-react';

export default function Drawer({ isOpen, onClose, title, size = 'md', children, footer, className }: any) {
  if (!isOpen) return null;

  const widthClass = size === 'xl' ? 'w-[800px]' : size === 'lg' ? 'w-[600px]' : 'w-[500px]';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      <div className={`relative ${widthClass} bg-white dark:bg-[#181a1f] h-full shadow-2xl flex flex-col animate-in slide-in-from-right transform transition-transform duration-300 border-l border-gray-200 dark:border-white/10 ${className || ''}`}>
        <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10 border-t-[6px] border-t-[#792359] flex items-center justify-between bg-gradient-to-b from-gray-50/80 to-white dark:from-white/5 dark:to-transparent">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {children}
        </div>
        {footer && (
          <div className="px-8 py-5 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
