import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import { useShiftRosters, useShifts, useMutation } from '../hooks';
import { WorkforceService } from '../services';
import { Input as CustomInput } from '../../../../components/ui/input';
import { addDays, subDays, startOfWeek, endOfWeek, format } from 'date-fns';
import type { ShiftRoster } from '../types';

export default function ShiftRoster() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  // In a real app we'd fetch based on date range. Here we fetch all and filter client side.
  const { data: rosters, loading: rostersLoading, refresh: refreshRosters } = useShiftRosters({ search: searchTerm });
  const { data: shifts, loading: shiftsLoading } = useShifts();

  const prevWeek = () => setCurrentDate(subDays(currentDate, 7));
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));

  // Transform flat roster data into matrix: employee -> date -> shift
  const rosterMatrix = useMemo(() => {
    const matrix: Record<string, { emp: { name: string, dept: string, code: string }, shifts: Record<string, ShiftRoster> }> = {};
    
    (rosters as ShiftRoster[]).forEach((roster: ShiftRoster) => {
      if (!matrix[roster.employeeId]) {
        matrix[roster.employeeId] = {
          emp: { name: roster.employeeName, dept: roster.department, code: roster.employeeCode },
          shifts: {}
        };
      }
      matrix[roster.employeeId].shifts[roster.rosterDate] = roster;
    });

    return Object.values(matrix);
  }, [rosters]);

  const updateMutation = useMutation(
    (payload: { id: string, assignedShiftId: string }) => WorkforceService.updateShiftRoster(payload.id, { assignedShiftId: payload.assignedShiftId }),
    {
      successMessage: 'Roster updated successfully',
      onSuccess: () => refreshRosters()
    }
  );

  const getShiftName = (shiftId: string) => {
    if (shiftId === 'OFF') return 'OFF';
    const shift = (shifts as any[]).find((s: any) => s.id === shiftId);
    return shift ? shift.shiftCode : shiftId;
  };

  const getShiftColor = (shiftId: string) => {
    if (shiftId === 'OFF') return 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400';
    const shift = (shifts as any[]).find((s: any) => s.id === shiftId);
    if (shift?.nightShift) return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400';
    return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
  };

  const handleEditCell = (roster: ShiftRoster) => {
    // Basic interaction: Just toggle between a random shift and OFF for demonstration.
    // In reality this would open a dropdown or a modal.
    const currentShiftId = roster.assignedShiftId;
    let nextShiftId = 'OFF';
    if (currentShiftId === 'OFF' && (shifts as any[]).length > 0) {
      nextShiftId = (shifts as any[])[0].id;
    }
    updateMutation.mutate({ id: roster.id, assignedShiftId: nextShiftId });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shift Roster</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and assign shifts across the week</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-64">
            <CustomInput 
              placeholder="Search employee..." 
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-sm p-1">
            <button onClick={prevWeek} className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"><ChevronLeft size={16} /></button>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 px-2 flex items-center gap-2">
              <CalendarIcon size={14} /> {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
            </span>
            <button onClick={nextWeek} className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-[#181a1f]">
          {(rostersLoading || shiftsLoading) ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 text-[11px] font-semibold tracking-wider uppercase sticky top-0 z-10 border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-4 py-3 font-semibold border-r border-gray-200 dark:border-white/10 min-w-[200px] w-[200px] bg-gray-50 dark:bg-[#181a1f] z-20 sticky left-0 shadow-[1px_0_0_0_#e5e7eb] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.1)]">Employee</th>
                  {weekDays.map((day, idx) => (
                    <th key={idx} className="px-4 py-3 font-semibold text-center border-r border-gray-200 dark:border-white/10 last:border-r-0 min-w-[120px]">
                      {format(day, 'EEE, MMM d')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                {rosterMatrix.length > 0 ? rosterMatrix.map((empData, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-4 py-3 border-r border-gray-100 dark:border-white/5 bg-white dark:bg-[#181a1f] sticky left-0 z-10 shadow-[1px_0_0_0_#f3f4f6] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)] group-hover:bg-gray-50/50 dark:group-hover:bg-[#1f2229]">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{empData.emp.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{empData.emp.dept}</p>
                    </td>
                    {weekDays.map((day, idx) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const rosterRecord = empData.shifts[dateStr];
                      
                      return (
                        <td key={idx} className="px-4 py-3 border-r border-gray-100 dark:border-white/5 text-center relative group/cell">
                          {rosterRecord ? (
                            <>
                              <span className={`px-2 py-1 rounded-sm text-xs font-bold ${getShiftColor(rosterRecord.assignedShiftId)}`}>
                                {getShiftName(rosterRecord.assignedShiftId)}
                              </span>
                              <div onClick={() => handleEditCell(rosterRecord)} className="absolute inset-0 bg-black/5 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity rounded-sm m-1 cursor-pointer">
                                <Edit2 size={14} className="text-primary dark:text-secondary" />
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-700 text-xs">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                      No shift rosters found for the selected criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
