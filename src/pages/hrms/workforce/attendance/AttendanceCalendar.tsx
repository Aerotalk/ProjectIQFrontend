import { useMemo, useState } from 'react';
import { format, parse, isValid } from 'date-fns';
import { Calendar } from '../../../../components/ui/calendar';
import type { AttendanceRecord } from '../types';
import { AttendanceStatus } from '../types';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import { Eye, Edit2, AlertCircle, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../../../components/ui/hover-card';

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

  const getStatusConfig = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.Present: return { bg: 'bg-emerald-50/70 dark:bg-emerald-900/10', text: 'text-emerald-700 dark:text-emerald-400' };
      case AttendanceStatus.Absent: return { bg: 'bg-red-50/70 dark:bg-red-900/10', text: 'text-red-700 dark:text-red-400' };
      case AttendanceStatus.Leave: return { bg: 'bg-blue-50/70 dark:bg-blue-900/10', text: 'text-blue-700 dark:text-blue-400' };
      case AttendanceStatus.Holiday: return { bg: 'bg-purple-50/70 dark:bg-purple-900/10', text: 'text-purple-700 dark:text-purple-400' };
      case AttendanceStatus.HalfDay: return { bg: 'bg-orange-50/70 dark:bg-orange-900/10', text: 'text-orange-700 dark:text-orange-400' };
      default: return { bg: 'bg-transparent', text: 'text-gray-900 dark:text-white' };
    }
  };

  const renderDayContent = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const record = data.find(d => d.attendanceDate === dateString || d.date === dateString);

    if (!record) return null;

    const isLate = record.lateBy && record.lateBy > 0;
    const isOT = record.overtimeHours && record.overtimeHours > 0;

    return (
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div 
            className="flex flex-col h-full w-full justify-between items-start text-left p-1.5 cursor-pointer outline-none focus:ring-2 focus:ring-[#792359]/30 rounded-sm"
            onClick={() => onAction && onAction(record, 'view')}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onAction && onAction(record, 'view');
            }}
          >
            <div className="flex w-full justify-between items-start mb-1">
               <span className="font-semibold text-xs text-gray-900 dark:text-gray-100">{date.getDate()}</span>
               <ActionMenu record={record} onAction={onAction} />
            </div>

            <div className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider ${getStatusConfig(record.status).text}`}>
              {record.status}
            </div>

            <div className="mt-auto w-full space-y-0.5 pb-0.5">
               {(record.checkIn || record.checkOut) && (
                 <div className="text-[10px] font-medium text-gray-700 dark:text-gray-300 truncate">
                   {record.checkIn || '--:--'} - {record.checkOut || '--:--'}
                 </div>
               )}
               {record.workingHours !== undefined && (
                 <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                   {record.workingHours} hrs
                 </div>
               )}
               
               <div className="flex flex-wrap gap-1 mt-1">
                  {isLate && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title={`Late by ${record.lateBy}m`} />}
                  {isOT && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" title={`OT ${record.overtimeHours}h`} />}
               </div>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent side="right" className="w-64 p-4 shadow-xl border border-gray-200 dark:border-white/10 z-[110]">
           <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold">{record.employeeName}</h4>
                <p className="text-xs text-gray-500">{record.shiftName}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                 <div>
                    <span className="text-gray-500 block mb-0.5">Check In</span>
                    <span className="font-medium">{record.checkIn || '--:--'}</span>
                 </div>
                 <div>
                    <span className="text-gray-500 block mb-0.5">Check Out</span>
                    <span className="font-medium">{record.checkOut || '--:--'}</span>
                 </div>
                 <div>
                    <span className="text-gray-500 block mb-0.5">Hours</span>
                    <span className="font-medium">{record.workingHours || 0}h</span>
                 </div>
                 <div>
                    <span className="text-gray-500 block mb-0.5">Late By</span>
                    <span className="font-medium text-amber-600">{record.lateBy || 0}m</span>
                 </div>
                 <div>
                    <span className="text-gray-500 block mb-0.5">Overtime</span>
                    <span className="font-medium text-indigo-600">{record.overtimeHours || 0}h</span>
                 </div>
                 <div>
                    <span className="text-gray-500 block mb-0.5">Source</span>
                    <span className="font-medium">{record.attendanceSource}</span>
                 </div>
              </div>
              {record.remarks && (
                <div className="text-xs pt-2 border-t border-gray-100 dark:border-white/5">
                   <span className="text-gray-500 block mb-0.5">Remarks</span>
                   <span className="italic">"{record.remarks}"</span>
                </div>
              )}
           </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 items-center overflow-auto custom-scrollbar relative">
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
             months: "w-full",
             month: "w-full",
             month_caption: "hidden", // Hide native month/year label
             nav: "hidden", // Hide native < > arrows
             month_grid: "w-full border-collapse",
             weekdays: "grid grid-cols-7 w-full mb-2",
             weekday: "text-muted-foreground font-semibold text-[11px] uppercase tracking-wider text-center py-2",
             week: "grid grid-cols-7 w-full gap-2 mb-2",
             day: "min-h-[120px] h-full w-full p-0 relative focus-within:relative focus-within:z-20",
             today: "", // Remove calendar.tsx defaults (like bg-muted) to avoid the black box
             outside: "opacity-40",
          }}
          components={{
             DayButton: ({ day, modifiers, ...props }) => {
                // Delete className from props to avoid inheriting defaults from calendar.tsx
                const { className: _discard, ...restProps } = props as any;
                
                const dateString = format(day.date, 'yyyy-MM-dd');
                const record = data.find(d => d.attendanceDate === dateString || d.date === dateString);
                
                // Color the cell background based on status
                let cellBgClass = 'bg-white dark:bg-[#1f2229]/30';
                let borderClass = 'border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20';
                
                if (record) {
                   cellBgClass = getStatusConfig(record.status).bg;
                   // Use status specific borders if needed, otherwise fallback to standard
                } else if (modifiers.weekend) {
                   cellBgClass = 'bg-gray-50/80 dark:bg-[#1f2229]/50';
                }

                if (modifiers.today) {
                   borderClass = 'border-[#792359]/60 dark:border-[#e6a8d0]/60 ring-1 ring-[#792359]/20 shadow-sm';
                }

                // If no record, just render the date
                if (!record) {
                   return (
                     <div {...restProps} className={`h-full w-full p-2 border rounded-xl flex flex-col items-start transition-all ${cellBgClass} ${borderClass}`}>
                        <span className={`font-semibold text-xs ${modifiers.today ? 'text-[#792359] dark:text-[#e6a8d0]' : 'text-gray-400 dark:text-gray-500'}`}>{day.date.getDate()}</span>
                     </div>
                   );
                }

                // Normal render with content
                return (
                  <div {...restProps} className={`h-full w-full border rounded-xl transition-all ${cellBgClass} ${borderClass}`}>
                     {renderDayContent(day.date)}
                  </div>
                );
             }
          }}
        />
      </div>
    </div>
  );
}
