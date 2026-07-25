interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <nav className="flex space-x-8 px-6" aria-label="Tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
            ${activeTab === tab.id
              ? 'border-[#792359] text-[#792359] dark:border-[#e6a8d0] dark:text-[#e6a8d0]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
