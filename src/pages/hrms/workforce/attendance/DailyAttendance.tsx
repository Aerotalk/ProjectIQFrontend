import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { LayoutList, Calendar as CalendarIcon, Eye, Edit2, AlertCircle, Clock, RefreshCw, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { format, addMonths, subMonths, parse } from 'date-fns';
import CustomTable from '../../../../components/ui/CustomTable';
import AttendanceCalendar from './AttendanceCalendar';
import CustomSelect from '../../../../components/ui/CustomSelect';
import EmployeeSelector from '../../../../components/hrms/EmployeeSelector';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import { useAttendanceRecords } from '../hooks';
import { AttendanceStatus, ApprovalStatus } from '../types';
import type { AttendanceRecord } from '../types';

export default function DailyAttendance() {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<'table' | 'calendar'>('calendar');
  const [filters, setFilters] = useState({ 
    employeeId: '',
    department: '',
    location: '',
    shift: '',
    status: searchParams.get('status') || '', 
    monthYear: format(new Date(), 'MMMM yyyy')
  });

  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';

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

  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && statusParam !== filters.status) {
      setFilters(prev => ({ ...prev, status: statusParam }));
    }
  }, [searchParams]);

  const { data, loading, refresh } = useAttendanceRecords(filters);

  const currentMonthDate = useMemo(() => {
    return parse(filters.monthYear, 'MMMM yyyy', new Date());
  }, [filters.monthYear]);

  const handlePrevMonth = () => setFilters(prev => ({ ...prev, monthYear: format(subMonths(currentMonthDate, 1), 'MMMM yyyy') }));
  const handleNextMonth = () => setFilters(prev => ({ ...prev, monthYear: format(addMonths(currentMonthDate, 1), 'MMMM yyyy') }));
  const handleCurrentMonth = () => setFilters(prev => ({ ...prev, monthYear: format(new Date(), 'MMMM yyyy') }));

  const columns = useMemo(() => [
    { 
      key: 'employeeName', 
      label: 'Employee', 
      sortable: true,
      render: (_: any, row: AttendanceRecord) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.employeeName || `${(row as any).employee?.firstName || 'Unknown'} ${(row as any).employee?.lastName || ''}`.trim() || 'Unknown Employee'}</div>
          <div className="text-xs text-gray-500">{row.employeeCode || (row as any).employee?.employeeCode || 'No Employee Code'}</div>
        </div>
      )
    },
    { key: 'shiftName', label: 'Shift', sortable: true },
    { 
      key: 'checkIn', 
      label: 'Check In', 
      sortable: true,
      render: (val: string, row: AttendanceRecord) => (
        <div className="flex flex-col">
          <span>{val ? (val.includes('T') ? new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : val) : '-'}</span>
          {row.checkInLocation && (
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${row.checkInLatitude},${row.checkInLongitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-primary hover:underline mt-0.5"
            >
              <MapPin size={10} />
              <span className="truncate max-w-[120px]" title={row.checkInLocation}>{row.checkInLocation}</span>
            </a>
          )}
        </div>
      )
    },
    { 
      key: 'checkOut', 
      label: 'Check Out', 
      sortable: true,
      render: (val: string, row: AttendanceRecord) => (
        <div className="flex flex-col">
          <span>{val ? (val.includes('T') ? new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : val) : '-'}</span>
          {row.checkOutLocation && (
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${row.checkOutLatitude},${row.checkOutLongitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-primary hover:underline mt-0.5"
            >
              <MapPin size={10} />
              <span className="truncate max-w-[120px]" title={row.checkOutLocation}>{row.checkOutLocation}</span>
            </a>
          )}
        </div>
      )
    },
    { key: 'workingHours', label: 'Hours', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val: AttendanceStatus) => {
        const displayVal = val ? val.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : '-';
        return (
          <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${
            val === AttendanceStatus.Present ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 
            val === AttendanceStatus.Absent ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}>
            {displayVal}
          </span>
        );
      }
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
      render: (_: any, row: AttendanceRecord) => <ActionCell row={row} />
    }
  ], [navigate, basePath]);

  const ActionCell = ({ row }: { row: AttendanceRecord }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <SmartActionMenu isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
         <button onClick={() => { setIsOpen(false); navigate(`${basePath}/hrms/workforce/attendance/record/${row.id}?mode=view`); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
           <Eye size={14} /> View Details
         </button>
         <button onClick={() => { setIsOpen(false); navigate(`${basePath}/hrms/workforce/attendance/record/${row.id}`); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
           <Edit2 size={14} /> Edit Attendance
         </button>
         <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
         <button onClick={() => setIsOpen(false)} className="w-full text-left px-4 py-2 text-sm text-primary dark:text-secondary hover:bg-primary/5 dark:hover:bg-secondary/10 flex items-center gap-2">
           <AlertCircle size={14} /> Regularize
         </button>
      </SmartActionMenu>
    );
  };

  const presentCount = data.filter(d => d.status === AttendanceStatus.Present).length;
  const leaveCount = data.filter(d => d.status === AttendanceStatus.Leave).length;
  const absentCount = data.filter(d => d.status === AttendanceStatus.Absent).length;
  const totalDays = presentCount + leaveCount + absentCount || 1; // avoid / 0

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6 overflow-hidden">
      
      {/* Row 1: Title, View Toggle & Legend */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Attendance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and manage daily employee attendance</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs font-medium text-gray-600 dark:text-gray-300 hidden md:flex">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Present</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Leave</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Absent</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Half Day</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Holiday</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></span> Weekend</span>
          </div>

          <div className="flex p-0.5 bg-gray-100 dark:bg-[#1f2229] rounded-sm border border-gray-200 dark:border-gray-800">
            <button 
              onClick={() => setView('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                view === 'table' ? 'bg-white dark:bg-black/20 text-primary dark:text-secondary shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LayoutList size={14} /> Table
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                view === 'calendar' ? 'bg-white dark:bg-black/20 text-primary dark:text-secondary shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon size={14} /> Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Filters & Navigation */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="w-48">
          <EmployeeSelector 
            value={filters.employeeId}
            onChange={(val) => setFilters(prev => ({ ...prev, employeeId: val }))}
            placeholder="Employee"
            allowAll
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
            ]}
            value={filters.status}
            onChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
          />
        </div>

        <button 
          onClick={refresh}
          disabled={loading}
          className={`p-2 rounded-sm transition-colors tooltip-trigger ${loading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:text-primary dark:hover:text-secondary hover:bg-primary/10 dark:hover:bg-secondary/10'}`}
          title="Refresh Data"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>

        <div className="ml-auto flex items-center bg-gray-50 dark:bg-white/5 rounded-md border border-gray-200 dark:border-white/10">
           <button onClick={handlePrevMonth} className="px-3 py-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors border-r border-gray-200 dark:border-white/10">
             <ChevronLeft size={16} />
           </button>
           <button onClick={handleCurrentMonth} className="px-4 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-secondary transition-colors min-w-[130px] text-center">
             {filters.monthYear}
           </button>
           <button onClick={handleNextMonth} className="px-3 py-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors border-l border-gray-200 dark:border-white/10">
             <ChevronRight size={16} />
           </button>
        </div>
      </div>

      {/* Summary Metrics & Progress Strip */}
      {view === 'calendar' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance Progress</h3>
             <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{Math.round((presentCount / totalDays) * 100)}% Attendance</span>
          </div>
          
          {/* Progress Strip */}
          <div className="w-full h-2 rounded-full overflow-hidden flex bg-gray-100 dark:bg-gray-800 mb-4">
             <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${(presentCount / totalDays) * 100}%` }} title="Present" />
             <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${(leaveCount / totalDays) * 100}%` }} title="Leave" />
             <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${(absentCount / totalDays) * 100}%` }} title="Absent" />
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-7 gap-3">
            {[
              { status: AttendanceStatus.Present, label: 'Present', count: presentCount, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-900/40' },
              { status: AttendanceStatus.Absent, label: 'Absent', count: absentCount, color: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-500/10 hover:bg-red-100 dark:hover:bg-red-900/40' },
              { status: AttendanceStatus.Leave, label: 'Leave', count: leaveCount, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-900/40' },
              { status: AttendanceStatus.HalfDay, label: 'Half Day', count: data.filter(d => d.status === AttendanceStatus.HalfDay).length, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-900/40' },
              { status: AttendanceStatus.Holiday, label: 'Holidays', count: data.filter(d => d.status === AttendanceStatus.Holiday).length, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-900/40' },
              { status: AttendanceStatus.Weekend, label: 'Weekends', count: data.filter(d => d.status === AttendanceStatus.Weekend).length, color: 'text-gray-600 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-gray-800' },
              { status: 'Late', label: 'Late Entries', count: data.filter(d => d.lateBy && d.lateBy > 0).length, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-900/40' },
            ].map((metric, i) => (
              <div 
                key={i} 
                onClick={() => setFilters(prev => ({ ...prev, status: prev.status === metric.status ? '' : metric.status }))}
                className={`p-2.5 rounded-lg border flex flex-col justify-center items-center text-center shadow-sm cursor-pointer transition-all duration-200 ${metric.color} ${filters.status === metric.status ? 'ring-2 ring-offset-1 ring-current dark:ring-offset-[#181a1f] scale-[1.02]' : 'opacity-80 hover:opacity-100'}`}
              >
                <div className="text-xl font-bold">{metric.count}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider mt-1">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content View */}
      <div className="flex-1 min-h-0 relative border border-gray-200 dark:border-white/10 rounded-md overflow-hidden bg-gray-50/30 dark:bg-[#181a1f] flex flex-row">
        {loading && (
           <div className="absolute inset-0 z-20 bg-white/50 dark:bg-[#181a1f]/50 backdrop-blur-[2px] flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
           </div>
        )}
        
        <div className={`flex-1 transition-all duration-300 overflow-hidden ${view === 'calendar' ? 'flex' : ''}`}>
          {view === 'table' ? (
            <div className="h-full overflow-auto custom-scrollbar bg-white dark:bg-[#181a1f]">
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
            <div className="h-full w-full overflow-y-auto custom-scrollbar">
               <AttendanceCalendar 
                 data={data} 
                 monthYear={filters.monthYear} 
               />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
