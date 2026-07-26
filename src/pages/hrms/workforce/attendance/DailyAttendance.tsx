import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutList, Calendar as CalendarIcon, Eye, Edit2, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import CustomTable from '../../../../components/ui/CustomTable';
import AttendanceCalendar from './AttendanceCalendar';
import CustomSelect from '../../../../components/ui/CustomSelect';
import CustomMonthPicker from '../../../../components/ui/CustomMonthPicker';
import EmployeeSelector from '../../../../components/hrms/EmployeeSelector';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import AttendanceDrawer from './AttendanceDrawer';
import { useAttendanceRecords } from '../hooks';
import { AttendanceStatus, ApprovalStatus } from '../types';
import type { AttendanceRecord } from '../types';

export default function DailyAttendance() {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<'table' | 'calendar'>('table');
  const [filters, setFilters] = useState({ 
    employeeId: '',
    department: '',
    location: '',
    shift: '',
    status: searchParams.get('status') || '', 
    monthYear: format(new Date(), 'MMMM yyyy')
  });

  const handleResetFilters = () => {
    setFilters({
      employeeId: '',
      department: '',
      location: '',
      shift: '',
      status: '',
      monthYear: format(new Date(), 'MMMM yyyy')
    });
  };

  // Update filter if URL changes
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && statusParam !== filters.status) {
      setFilters(prev => ({ ...prev, status: statusParam }));
    }
  }, [searchParams]);
  const [drawerState, setDrawerState] = useState<{ isOpen: boolean; record: AttendanceRecord | null; mode: 'view' | 'edit' }>({
    isOpen: false,
    record: null,
    mode: 'view'
  });

  const { data, loading } = useAttendanceRecords(filters);

  const handleAction = (record: AttendanceRecord, mode: 'view' | 'edit') => {
    setDrawerState({ isOpen: true, record, mode });
  };

  const columns = useMemo(() => [
    { 
      key: 'employeeName', 
      label: 'Employee', 
      sortable: true,
      render: (_: any, row: AttendanceRecord) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.employeeName}</div>
          <div className="text-xs text-gray-500">{row.employeeCode}</div>
        </div>
      )
    },
    { key: 'shiftName', label: 'Shift', sortable: true },
    { key: 'checkIn', label: 'Check In', sortable: true },
    { key: 'checkOut', label: 'Check Out', sortable: true },
    { key: 'workingHours', label: 'Hours', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val: AttendanceStatus) => (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${
          val === AttendanceStatus.Present ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 
          val === AttendanceStatus.Absent ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
        }`}>
          {val}
        </span>
      )
    },
    { key: 'exceptionType', label: 'Exception', sortable: true, render: (val: string) => val || '-' },
    { 
      key: 'regularizationStatus', 
      label: 'Regularized', 
      sortable: true,
      render: (val: ApprovalStatus) => val === ApprovalStatus.Approved ? <span className="text-blue-500 font-medium text-xs">Yes</span> : <span className="text-gray-400 text-xs">No</span>
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: AttendanceRecord) => (
        <SmartActionMenu 
          isOpen={false} // State handled internally or via mapping, CustomTable might need a slight tweak to support SmartActionMenu if it requires external state, but typically we wrap it in a local component. Let's make a wrapper below.
          onToggle={() => {}}
        >
          <div className="w-48 bg-white dark:bg-[#181a1f] rounded-sm shadow-lg border border-gray-200 dark:border-white/10 py-1">
             <button onClick={() => handleAction(row, 'view')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
               <Eye size={14} /> View Details
             </button>
             <button onClick={() => handleAction(row, 'edit')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
               <Edit2 size={14} /> Edit Attendance
             </button>
             <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
             <button className="w-full text-left px-4 py-2 text-sm text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/5 dark:hover:bg-[#e6a8d0]/10 flex items-center gap-2">
               <AlertCircle size={14} /> Regularize
             </button>
          </div>
        </SmartActionMenu>
      )
    }
  ], []);

  // Wrapper for SmartActionMenu to handle its own local state per row
  const ActionCell = ({ row }: { row: AttendanceRecord }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <SmartActionMenu isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
         <button onClick={() => { setIsOpen(false); handleAction(row, 'view'); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
           <Eye size={14} /> View Details
         </button>
         <button onClick={() => { setIsOpen(false); handleAction(row, 'edit'); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
           <Edit2 size={14} /> Edit Attendance
         </button>
         <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
         <button onClick={() => setIsOpen(false)} className="w-full text-left px-4 py-2 text-sm text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/5 dark:hover:bg-[#e6a8d0]/10 flex items-center gap-2">
           <AlertCircle size={14} /> Regularize
         </button>
      </SmartActionMenu>
    );
  };

  // Re-assign actions column to use ActionCell
  columns[columns.length - 1].render = (_: any, row: AttendanceRecord) => <ActionCell row={row} />;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      {/* Summary Metrics Bar */}
      {view === 'calendar' && (
        <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-9 gap-3 mb-6">
          {[
            { label: 'Present', count: data.filter(d => d.status === AttendanceStatus.Present).length, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-500/10' },
            { label: 'Absent', count: data.filter(d => d.status === AttendanceStatus.Absent).length, color: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-500/10' },
            { label: 'Leave', count: data.filter(d => d.status === AttendanceStatus.Leave).length, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-500/10' },
            { label: 'Half Day', count: data.filter(d => d.status === AttendanceStatus.HalfDay).length, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-500/10' },
            { label: 'Holidays', count: data.filter(d => d.status === AttendanceStatus.Holiday).length, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-500/10' },
            { label: 'Weekends', count: data.filter(d => d.status === AttendanceStatus.Weekend).length, color: 'text-gray-600 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-white/5' },
            { label: 'Late Entries', count: data.filter(d => d.lateBy && d.lateBy > 0).length, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-500/10' },
            { label: 'Overtime', count: data.filter(d => d.overtimeHours && d.overtimeHours > 0).length, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-500/10' },
            { label: 'Payable', count: data.filter(d => d.status === AttendanceStatus.Present || d.status === AttendanceStatus.Leave || d.status === AttendanceStatus.Holiday || d.status === AttendanceStatus.Weekend).length, color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-500/10' }
          ].map((metric, i) => (
            <div key={i} className={`p-3 rounded-xl border flex flex-col justify-center items-center text-center shadow-sm ${metric.color}`}>
              <div className="text-xl font-bold">{metric.count}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-80 mt-1">{metric.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Attendance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and manage daily employee attendance</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <div className="w-48">
            <EmployeeSelector 
              value={filters.employeeId}
              onChange={(val) => setFilters(prev => ({ ...prev, employeeId: val }))}
              placeholder="Employee"
            />
          </div>
          <div className="w-36">
            <CustomSelect 
              options={[
                { value: '', label: 'Department' },
                { value: 'Engineering', label: 'Engineering' },
                { value: 'HR', label: 'HR' },
              ]}
              value={filters.department}
              onChange={(val) => setFilters(prev => ({ ...prev, department: val }))}
            />
          </div>
          <div className="w-36">
            <CustomSelect 
              options={[
                { value: '', label: 'Location' },
                { value: 'New York', label: 'New York' },
                { value: 'London', label: 'London' },
              ]}
              value={filters.location}
              onChange={(val) => setFilters(prev => ({ ...prev, location: val }))}
            />
          </div>
          <div className="w-32">
            <CustomSelect 
              options={[
                { value: '', label: 'Shift' },
                { value: 'General', label: 'General' },
                { value: 'Night', label: 'Night' },
              ]}
              value={filters.shift}
              onChange={(val) => setFilters(prev => ({ ...prev, shift: val }))}
            />
          </div>
          <div className="w-32">
            <CustomSelect 
              options={[
                { value: '', label: 'Status' },
                { value: AttendanceStatus.Present, label: 'Present' },
                { value: AttendanceStatus.Absent, label: 'Absent' },
                { value: AttendanceStatus.Leave, label: 'On Leave' },
                { value: AttendanceStatus.HalfDay, label: 'Half Day' },
                { value: 'Late', label: 'Late Arrivals' },
              ]}
              value={filters.status}
              onChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
            />
          </div>
          <div className="w-40">
             <CustomMonthPicker 
               value={filters.monthYear}
               onChange={(val) => setFilters(prev => ({ ...prev, monthYear: val }))}
               placeholder="Month/Year"
             />
          </div>
          <button 
            onClick={handleResetFilters}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-sm transition-colors tooltip-trigger"
            title="Reset Filters"
          >
            <RefreshCw size={18} />
          </button>

          {/* Segmented View Toggle */}
          <div className="flex p-0.5 bg-gray-100 dark:bg-[#1f2229] rounded-sm border border-gray-200 dark:border-gray-800 ml-auto xl:ml-0">
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
        </div>
      </div>

      {/* Content View */}
      <div className="flex-1 min-h-0 relative border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden flex flex-col bg-gray-50/30 dark:bg-[#181a1f]">
        {loading ? (
           <div className="absolute inset-0 z-10 bg-white/50 dark:bg-[#181a1f]/50 backdrop-blur-[2px] flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#792359]/30 border-t-[#792359] rounded-full animate-spin" />
           </div>
        ) : null}
        
        {view === 'table' ? (
          <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-[#181a1f]">
            {data.length > 0 ? (
              <CustomTable columns={columns} data={data} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 py-12">
                <Clock size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">No attendance records found for this date.</p>
              </div>
            )}
          </div>
        ) : (
          <AttendanceCalendar 
            data={data} 
            monthYear={filters.monthYear} 
            onAction={handleAction} 
          />
        )}
      </div>

      <AttendanceDrawer 
        isOpen={drawerState.isOpen}
        onClose={() => setDrawerState(prev => ({ ...prev, isOpen: false }))}
        record={drawerState.record}
        mode={drawerState.mode}
      />
    </div>
  );
}
