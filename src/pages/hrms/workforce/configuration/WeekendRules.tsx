import { useState } from 'react';

const DAYS = [
  { id: 'mon', label: 'Monday' },
  { id: 'tue', label: 'Tuesday' },
  { id: 'wed', label: 'Wednesday' },
  { id: 'thu', label: 'Thursday' },
  { id: 'fri', label: 'Friday' },
  { id: 'sat', label: 'Saturday' },
  { id: 'sun', label: 'Sunday' },
];

export default function WeekendRules() {
  const [selectedDays, setSelectedDays] = useState<string[]>(['sat', 'sun']);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekend Configuration</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Select the default non-working days for the organization.</p>
      </div>
      
      <div className="p-6 border border-gray-200 dark:border-white/10 rounded-sm max-w-2xl">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Select Weekend Days</h3>
        <div className="flex gap-2 mb-6">
          {DAYS.map(day => (
            <button
              key={day.id}
              onClick={() => toggleDay(day.id)}
              className={`flex-1 py-3 px-2 text-center rounded-sm text-sm font-semibold transition-all border ${
                selectedDays.includes(day.id) 
                  ? 'bg-[#792359] text-white border-[#792359] shadow-sm scale-[1.02]' 
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-sm border border-blue-100 dark:border-blue-800/30">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Note:</strong> Employees assigned to a shift roster will follow the rostered week offs instead of this global weekend rule.
          </p>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button className="px-6 py-2 bg-[#792359] hover:bg-[#52173c] text-white rounded-sm text-sm font-medium shadow-sm transition-colors">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
