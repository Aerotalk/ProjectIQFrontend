import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AttendanceCalendarProps {
  data: any[]; // Expecting an array of attendance records mapped to dates, for now we will randomize mock status per day if not provided
}

export default function AttendanceCalendar({ data: _data }: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToday = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Mock status generator for visual demonstration
  const getMockStatus = (day: Date) => {
    if (day.getDay() === 0 || day.getDay() === 6) return 'Weekend';
    const rand = Math.random();
    if (rand > 0.9) return 'Absent';
    if (rand > 0.8) return 'Leave';
    if (rand > 0.75) return 'Holiday';
    return 'Present';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Absent': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'Leave': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Holiday': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'Weekend': return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
      default: return 'bg-transparent text-gray-900 dark:text-white border-transparent';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f]">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {format(currentDate, dateFormat)}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={goToday} className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            Today
          </button>
          <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-sm bg-gray-50 dark:bg-white/5">
            <button onClick={prevMonth} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border-r border-gray-200 dark:border-white/10">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextMonth} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1f2229]">
        {weekDays.map((day, i) => (
          <div key={i} className="py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-[minmax(100px,_1fr)] overflow-y-auto custom-scrollbar">
        {days.map((day, idx) => {
          const status = getMockStatus(day);
          return (
            <div 
              key={day.toString()} 
              className={`border-b border-r border-gray-100 dark:border-white/5 p-2 flex flex-col gap-1 transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.02] ${
                !isSameMonth(day, monthStart) ? 'bg-gray-50/50 dark:bg-[#1a1c23] opacity-60' : ''
              } ${idx % 7 === 6 ? 'border-r-0' : ''}`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday(day) ? 'bg-[#792359] text-white' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className={`mt-1 flex-1 rounded-sm border p-1.5 flex flex-col justify-center items-center text-center ${getStatusColor(status)}`}>
                <span className="text-xs font-semibold tracking-wide uppercase">{status}</span>
                {status === 'Present' && (
                  <span className="text-[10px] opacity-80 mt-0.5">09:00 - 18:00</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
