import { useState, useMemo } from 'react';
import { Filter, LayoutList, Calendar as CalendarIcon } from 'lucide-react';
import CustomTable from '../../../../components/ui/CustomTable';
import AttendanceCalendar from './AttendanceCalendar';

export default function DailyAttendance() {
  const [view, setView] = useState<'table' | 'calendar'>('table');

  const data = [
    { employee: 'John Doe', shift: 'General Shift', in: '09:00 AM', out: '06:00 PM', hours: 9, status: 'Present', exception: '-', regularized: false },
    { employee: 'Jane Smith', shift: 'General Shift', in: '09:30 AM', out: '06:00 PM', hours: 8.5, status: 'Present', exception: 'Late In', regularized: true },
  ];

  const columns = useMemo(() => [
    { key: 'employee', label: 'Employee', sortable: true },
    { key: 'shift', label: 'Shift', sortable: true },
    { key: 'in', label: 'Check In', sortable: true },
    { key: 'out', label: 'Check Out', sortable: true },
    { key: 'hours', label: 'Hours', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val: string) => (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${
          val === 'Present' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {val}
        </span>
      )
    },
    { key: 'exception', label: 'Exception', sortable: true },
    { 
      key: 'regularized', 
      label: 'Regularized', 
      sortable: true,
      render: (val: boolean) => val ? <span className="text-blue-500">Yes</span> : <span className="text-gray-400">No</span>
    },
  ], []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Attendance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and manage daily employee attendance</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Segmented View Toggle */}
          <div className="flex p-0.5 bg-gray-100 dark:bg-[#1f2229] rounded-sm border border-gray-200 dark:border-gray-800">
            <button 
              onClick={() => setView('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                view === 'table' ? 'bg-white dark:bg-black/20 text-[#792359] dark:text-[#e6a8d0] shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LayoutList size={14} /> Table View
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                view === 'calendar' ? 'bg-white dark:bg-black/20 text-[#792359] dark:text-[#e6a8d0] shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon size={14} /> Calendar View
            </button>
          </div>

          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-sm font-medium">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Content View */}
      <div className="flex-1 min-h-0 relative border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden flex flex-col bg-gray-50/30 dark:bg-[#181a1f]">
        {view === 'table' ? (
          <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-[#181a1f]">
            <CustomTable columns={columns} data={data} />
          </div>
        ) : (
          <AttendanceCalendar data={data} />
        )}
      </div>
    </div>
  );
}
