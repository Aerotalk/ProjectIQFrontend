import { X } from 'lucide-react';

export default function Drawer({ isOpen, onClose, title, size = 'md', children, footer, className }: any) {
  if (!isOpen) return null;

  const widthClass = size === 'xl' ? 'w-[800px]' : size === 'lg' ? 'w-[600px]' : 'w-[500px]';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      <div className={`relative ${widthClass} bg-white dark:bg-[#181a1f] h-full shadow-2xl flex flex-col animate-in slide-in-from-right transform transition-transform duration-300 ${className || ''}`}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
