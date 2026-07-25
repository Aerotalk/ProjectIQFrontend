import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';

export default function ShiftRoster() {
  
  const currentWeek = ['Mon, Jul 20', 'Tue, Jul 21', 'Wed, Jul 22', 'Thu, Jul 23', 'Fri, Jul 24', 'Sat, Jul 25', 'Sun, Jul 26'];
  const employees = [
    { name: 'John Doe', dept: 'Engineering', roster: ['GS', 'GS', 'GS', 'GS', 'GS', 'OFF', 'OFF'] },
    { name: 'Jane Smith', dept: 'Support', roster: ['NS', 'NS', 'NS', 'NS', 'NS', 'OFF', 'OFF'] },
    { name: 'Mike Ross', dept: 'Sales', roster: ['GS', 'GS', 'GS', 'GS', 'GS', 'GS', 'OFF'] },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shift Roster</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and assign shifts across the week</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-sm p-1">
            <button className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white"><ChevronLeft size={16} /></button>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 px-2 flex items-center gap-2">
              <CalendarIcon size={14} /> Jul 20 - Jul 26, 2026
            </span>
            <button className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-[#181a1f]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 text-[11px] font-semibold tracking-wider uppercase sticky top-0 z-10 border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="px-4 py-3 font-semibold border-r border-gray-200 dark:border-white/10 min-w-[200px] w-[200px]">Employee</th>
                {currentWeek.map((day, idx) => (
                  <th key={idx} className="px-4 py-3 font-semibold text-center border-r border-gray-200 dark:border-white/10 last:border-r-0 min-w-[100px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
              {employees.map((emp, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3 border-r border-gray-100 dark:border-white/5">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{emp.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{emp.dept}</p>
                  </td>
                  {emp.roster.map((shift, idx) => (
                    <td key={idx} className="px-4 py-3 border-r border-gray-100 dark:border-white/5 text-center relative group/cell cursor-pointer">
                      <span className={`px-2 py-1 rounded-sm text-xs font-bold ${
                        shift === 'OFF' ? 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400' :
                        shift === 'NS' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {shift}
                      </span>
                      {/* Hover Edit Icon */}
                      <div className="absolute inset-0 bg-black/5 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity rounded-sm m-1 border border-[#792359]/30">
                        <Edit2 size={14} className="text-[#792359] dark:text-[#e6a8d0]" />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
