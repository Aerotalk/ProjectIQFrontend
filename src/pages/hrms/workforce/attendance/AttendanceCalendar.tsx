import { useMemo, useState } from 'react';
import { format, parse, isValid } from 'date-fns';
import { Calendar } from '../../../../components/ui/calendar';
import type { AttendanceRecord } from '../types';
import { AttendanceStatus } from '../types';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import { Eye, Edit2, AlertCircle, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

interface AttendanceCalendarProps {
  data: AttendanceRecord[];
  monthYear?: string;
  onAction?: (record: AttendanceRecord, mode: 'view' | 'edit') => void;
}

const ActionMenu = ({ record, onAction }: { record: AttendanceRecord, onAction?: (record: AttendanceRecord, mode: 'view'|'edit') => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <SmartActionMenu isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
         <div className="w-48 bg-white dark:bg-[#181a1f] rounded-sm shadow-lg border border-gray-200 dark:border-white/10 py-1">
            <button onClick={() => { setIsOpen(false); onAction && onAction(record, 'view')}} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"><Eye size={14} /> View Details</button>
            <button onClick={() => { setIsOpen(false); onAction && onAction(record, 'edit')}} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"><Edit2 size={14} /> Edit Attendance</button>
            <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
            <button onClick={() => setIsOpen(false)} className="w-full text-left px-4 py-2 text-sm text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/5 dark:hover:bg-[#e6a8d0]/10 flex items-center gap-2"><AlertCircle size={14} /> Regularize</button>
            <button onClick={() => setIsOpen(false)} className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 flex items-center gap-2"><CheckCircle size={14} /> Mark Present</button>
            <button onClick={() => setIsOpen(false)} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"><XCircle size={14} /> Mark Absent</button>
            <button onClick={() => setIsOpen(false)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"><MessageSquare size={14} /> Add Remark</button>
         </div>
      </SmartActionMenu>
    </div>
  );
};

export default function AttendanceCalendar({ data, monthYear, onAction }: AttendanceCalendarProps) {
  const currentMonth = useMemo(() => {
    if (!monthYear) return new Date();
    const parsed = parse(monthYear, 'MMMM yyyy', new Date());
    return isValid(parsed) ? parsed : new Date();
  }, [monthYear]);

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
      <div 
        className="flex flex-col h-full w-full p-2 outline-none"
        tabIndex={0}
      >
        <div className="flex w-full justify-between items-start mb-1">
           <span className="font-semibold text-xs text-gray-900 dark:text-gray-100">{date.getDate()}</span>
           {/* Add empty div to keep spacing if no action menu is active */}
           {record.status !== AttendanceStatus.Weekend ? <ActionMenu record={record} onAction={onAction} /> : <div className="w-5" />}
        </div>

        <div className="flex items-center gap-1.5 mb-1.5">
          {getStatusIcon(record.status)}
          <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
            {record.status}
          </span>
        </div>

        <div className="mt-auto w-full space-y-1">
           {(record.checkIn || record.checkOut) && (
             <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
               {record.checkIn || '--:--'} - {record.checkOut || '--:--'}
             </div>
           )}
           
           <div className="flex items-center justify-between">
             {record.workingHours !== undefined && (
               <div className="text-[10px] font-bold text-gray-600 dark:text-gray-400">
                 {record.workingHours}h
               </div>
             )}
             <div className="flex items-center gap-1 ml-auto">
                {isLate && <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/20 px-1 py-0.5 rounded-sm" title={`Late by ${record.lateBy}m`}>⚠ Late</span>}
                {isOT && <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-1 py-0.5 rounded-sm" title={`OT ${record.overtimeHours}h`}>⏰ OT</span>}
             </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full items-center overflow-auto custom-scrollbar relative p-4">
       {/* Mobile Fallback */}
       <div className="w-full lg:hidden flex flex-col items-center justify-center py-12 text-gray-500">
         <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
         <p className="text-sm">Please switch to Table View on mobile devices.</p>
       </div>

      <div className="hidden lg:block w-full">
        <Calendar
          mode="single"
          month={currentMonth}
          disableNavigation
          showOutsideDays={true}
          className="w-full bg-transparent p-0"
          modifiers={{
            weekend: (date) => date.getDay() === 0 || date.getDay() === 6
          }}
          classNames={{
             root: "w-full",
             months: "w-full",
             month: "w-full",
             month_caption: "hidden", // Hide native month/year label
             nav: "hidden", // Hide native < > arrows
             month_grid: "w-full border-collapse",
             weekdays: "grid grid-cols-7 w-full mb-1",
             weekday: "text-gray-500 font-semibold text-[11px] uppercase tracking-wider text-center py-2 border-b border-gray-100 dark:border-white/5",
             week: "grid grid-cols-7 w-full border-b border-gray-100 dark:border-white/5 last:border-b-0",
             day: "min-h-[90px] h-full w-full p-0 relative border-r border-gray-100 dark:border-white/5 last:border-r-0",
             today: "", // Remove calendar.tsx defaults
             outside: "opacity-40",
          }}
          components={{
             DayButton: ({ day, modifiers, ...props }) => {
                const { className: _discard, ...restProps } = props as any;
                
                const dateString = format(day.date, 'yyyy-MM-dd');
                const record = data.find(d => d.attendanceDate === dateString || d.date === dateString);
                
                // Color the cell background based on status
                let cellBgClass = 'bg-white dark:bg-transparent';
                let borderClass = 'border-transparent';
                
                // Shaded weekends that fill the cell
                if (modifiers.weekend) {
                   cellBgClass = 'bg-[#f8f9fa] dark:bg-[#1a1c21]';
                }

                if (modifiers.today) {
                   cellBgClass = 'bg-[#792359]/5 dark:bg-[#e6a8d0]/5';
                   borderClass = 'border-[#792359]/30 dark:border-[#e6a8d0]/30 shadow-sm rounded-md ring-1 ring-[#792359]/20 z-10';
                }

                return (
                  <div 
                    {...restProps} 
                    className={`h-full w-full transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 border ${cellBgClass} ${borderClass}`}
                    onClick={(e) => {
                      if (record && onAction) {
                        onAction(record, 'view');
                      }
                      if (props.onClick) props.onClick(e as any);
                    }}
                  >
                     {!record ? (
                       <div className="h-full w-full p-2 flex flex-col items-start">
                          <span className={`font-semibold text-xs ${modifiers.today ? 'text-[#792359] dark:text-[#e6a8d0]' : 'text-gray-400 dark:text-gray-500'}`}>{day.date.getDate()}</span>
                       </div>
                     ) : (
                       renderDayContent(day.date)
                     )}
                  </div>
                );
             }
          }}
        />
      </div>
    </div>
  );
}
