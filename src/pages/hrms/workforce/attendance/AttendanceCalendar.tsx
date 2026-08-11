import { useMemo, useState } from 'react';
import { 
  format, 
  parse, 
  isValid, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  isWeekend 
} from 'date-fns';
import type { AttendanceRecord } from '../types';
import { AttendanceStatus } from '../types';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import { Eye, Edit2, AlertCircle, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

interface AttendanceCalendarProps {
  data: AttendanceRecord[];
  monthYear?: string;
}

const ActionMenu = ({ record }: { record: AttendanceRecord }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <SmartActionMenu isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
         <div className="w-48 bg-white dark:bg-[#181a1f] rounded-sm shadow-lg border border-gray-200 dark:border-white/10 py-1 z-50 relative">
            <button onClick={() => { setIsOpen(false); navigate(`${basePath}/hrms/workforce/attendance/record/${record.id}?mode=view`); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"><Eye size={14} /> View Details</button>
            <button onClick={() => { setIsOpen(false); navigate(`${basePath}/hrms/workforce/attendance/record/${record.id}`); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"><Edit2 size={14} /> Edit Attendance</button>
            <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
            <button onClick={() => setIsOpen(false)} className="w-full text-left px-4 py-2 text-sm text-primary dark:text-secondary hover:bg-primary/5 dark:hover:bg-secondary/10 flex items-center gap-2"><AlertCircle size={14} /> Regularize</button>
            <button onClick={() => setIsOpen(false)} className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 flex items-center gap-2"><CheckCircle size={14} /> Mark Present</button>
            <button onClick={() => setIsOpen(false)} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"><XCircle size={14} /> Mark Absent</button>
            <button onClick={() => setIsOpen(false)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"><MessageSquare size={14} /> Add Remark</button>
         </div>
      </SmartActionMenu>
    </div>
  );
};

export default function AttendanceCalendar({ data, monthYear }: AttendanceCalendarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  
  const currentMonth = useMemo(() => {
    if (!monthYear) return new Date();
    const parsed = parse(monthYear, 'MMMM yyyy', new Date());
    return isValid(parsed) ? parsed : new Date();
  }, [monthYear]);

  // Generate calendar grid days
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getStatusIcon = (status: AttendanceStatus | 'Weekend' | 'Late' | 'Regularized') => {
    switch (status) {
      case AttendanceStatus.Present: return <span className="text-emerald-500 text-[10px]">🟢</span>;
      case AttendanceStatus.Absent: return <span className="text-red-500 text-[10px]">🔴</span>;
      case AttendanceStatus.Leave: return <span className="text-blue-500 text-[10px]">🔵</span>;
      case AttendanceStatus.HalfDay: return <span className="text-orange-500 text-[10px]">🟠</span>;
      case AttendanceStatus.Holiday: return <span className="text-purple-500 text-[10px]">🟣</span>;
      case 'Regularized': return <span className="text-yellow-500 text-[10px]">🟡</span>;
      case AttendanceStatus.Weekend: return <span className="text-gray-300 text-[10px]">⚪</span>;
      default: return null;
    }
  };

  const renderDayContent = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const record = data.find(d => d.attendanceDate === dateString || d.date === dateString);

    if (!record) return null;

    const isLate = record.lateBy && record.lateBy > 0;
    const isOT = record.overtimeHours && record.overtimeHours > 0;

    return (
      <div className="flex flex-col h-full w-full outline-none">
        <div className="flex w-full justify-between items-start mb-1">
           <span className="font-semibold text-xs text-gray-900 dark:text-gray-100">{date.getDate()}</span>
           {/* Add empty div to keep spacing if no action menu is active */}
           {record.status !== AttendanceStatus.Weekend ? <ActionMenu record={record} /> : <div className="w-5" />}
        </div>

        <div className="flex items-center gap-1.5 mb-1.5">
          {getStatusIcon(record.status)}
          <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 truncate">
            {record.status}
          </span>
        </div>

        <div className="mt-auto w-full space-y-1">
           {(record.checkIn || record.checkOut) && (
             <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
               {record.checkIn || '--:--'} - {record.checkOut || '--:--'}
             </div>
           )}
           
           <div className="flex items-center justify-between flex-wrap gap-1">
             {record.workingHours !== undefined && (
               <div className="text-[10px] font-bold text-gray-600 dark:text-gray-400">
                 {record.workingHours}h
               </div>
             )}
             <div className="flex items-center gap-1 ml-auto">
                {isLate && <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/20 px-1 py-0.5 rounded-sm" title={`Late by ${record.lateBy}m`}>⚠ Late</span>}
                {isOT && <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-1 py-0.5 rounded-sm" title={`OT ${record.overtimeHours}h`}>⏰ OT</span>}
             </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-4">
       {/* Mobile Fallback */}
       <div className="w-full lg:hidden flex flex-col items-center justify-center py-12 text-gray-500">
         <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
         <p className="text-sm">Please switch to Table View on mobile devices.</p>
       </div>

      <div className="hidden lg:flex flex-col h-full w-full min-h-[600px] border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden bg-white dark:bg-[#181a1f] shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/10 flex-shrink-0">
          {WEEKDAYS.map((day, idx) => (
            <div 
              key={day} 
              className={cn(
                "py-3 text-center text-xs font-semibold uppercase tracking-wider",
                idx === 0 || idx === 6 ? "text-gray-400" : "text-gray-500 dark:text-gray-400",
                idx !== 6 && "border-r border-gray-200 dark:border-white/10"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {days.map((day, idx) => {
            const isSame = isSameMonth(day, currentMonth);
            const today = isToday(day);
            const weekend = isWeekend(day);
            const dateString = format(day, 'yyyy-MM-dd');
            const record = data.find(d => d.attendanceDate === dateString || d.date === dateString);
            
            // Grid borders:
            // Don't draw right border for last column
            // Don't draw bottom border for last row (handled by container overflow/border)
            const isLastCol = (idx + 1) % 7 === 0;
            const isLastRow = Math.floor(idx / 7) === Math.floor((days.length - 1) / 7);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-2 relative group transition-colors duration-200 cursor-pointer",
                  !isLastCol && "border-r border-gray-200 dark:border-white/10",
                  !isLastRow && "border-b border-gray-200 dark:border-white/10",
                  !isSame && "opacity-40 bg-gray-50/30 dark:bg-black/20",
                  isSame && weekend && "bg-[#f8f9fa] dark:bg-[#1a1c21]",
                  isSame && !weekend && "bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5",
                  today && "bg-primary/5 dark:bg-secondary/5 ring-1 ring-inset ring-primary/30 dark:ring-secondary/30 z-10 rounded-[1px]"
                )}
                onClick={() => {
                  if (record) {
                    navigate(`${basePath}/hrms/workforce/attendance/record/${record.id}?mode=view`);
                  }
                }}
              >
                {!record || !isSame ? (
                  <div className="flex w-full justify-between items-start">
                    <span className={cn(
                      "font-semibold text-xs",
                      today ? "text-primary dark:text-secondary" : "text-gray-400 dark:text-gray-500"
                    )}>
                      {day.getDate()}
                    </span>
                  </div>
                ) : (
                  renderDayContent(day)
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
