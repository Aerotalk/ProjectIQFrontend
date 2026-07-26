import { useState } from 'react';
import SmartActionMenu from './SmartActionMenu';

interface Action {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export default function TableRowActionMenu({ actions }: { actions: Action[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SmartActionMenu isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
            action.onClick();
          }}
          className={`block w-full text-left px-4 py-2 text-sm ${action.danger ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10'}`}
        >
          {action.label}
        </button>
      ))}
    </SmartActionMenu>
  );
}
