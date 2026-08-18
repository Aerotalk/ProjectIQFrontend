import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Clock, MonitorSmartphone, AlertCircle } from 'lucide-react';
import { Input as CustomInput } from '../../../../components/ui/input';
import CustomSelect from '../../../../components/ui/CustomSelect';
import { WorkforceService } from '../services';
import type { AttendanceRecord } from '../types';
import { AttendanceStatus } from '../types';
import toast from 'react-hot-toast';

export default function AttendanceFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode') === 'view' ? 'view' : 'edit';
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  const readOnly = mode === 'view';

  const [record, setRecord] = useState<AttendanceRecord | null>(null);
  const [punchLogs, setPunchLogs] = useState<any[]>([]);
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState<AttendanceStatus | undefined>(undefined);
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [checkOutTime, setCheckOutTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await WorkforceService.getAttendanceRecordById(id!);
      setRecord(data);
      setRemarks(data.remarks || '');
      setStatus((data.status as AttendanceStatus) || undefined);
      setCheckInTime(data.checkIn || '');
      setCheckOutTime(data.checkOut || '');

      try {
        const logsData = await WorkforceService.getAttendanceLogsForRecord(id!);
        setPunchLogs(logsData || []);
      } catch (logErr) {
        console.warn('Failed to fetch punch logs', logErr);
      }
    } catch (e) {
      toast.error('Failed to fetch attendance details');
      navigate(`${basePath}/hrms/workforce/attendance/daily`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!record) return;
    try {
      setIsSubmitting(true);
      await WorkforceService.updateAttendanceRecord(record.id, {
        status,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        remarks
      });
      toast.success('Attendance record updated successfully');
      navigate(`${basePath}/hrms/workforce/attendance/daily`);
    } catch (err: any) {
      toast.error('Error saving attendance record');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-[#121212]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!record) return null;

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#121212] overflow-hidden">
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`${basePath}/hrms/workforce/attendance/daily`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'edit' ? 'Edit Attendance' : 'Attendance Details'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {record.attendanceDate || record.date} • {record.shiftName || 'General'}
            </p>
          </div>
        </div>
        
        {!readOnly && (
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate(`${basePath}/hrms/workforce/attendance/daily`)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 shadow-sm transition-colors disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="w-full space-y-6">
          
          <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
            {/* Employee Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-lg mb-6 border border-gray-100 dark:border-white/5">
              <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-light font-semibold text-lg">
                {(record.employeeName || (record as any).employee?.firstName) ? (record.employeeName || (record as any).employee?.firstName).charAt(0).toUpperCase() : 'E'}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {record.employeeName || `${(record as any).employee?.firstName || 'Unknown'} ${(record as any).employee?.lastName || ''}`.trim()}
                </h3>
                <p className="text-sm text-gray-500">{record.employeeCode || (record as any).employee?.employeeCode || 'No Employee Code'}</p>
              </div>
            </div>

            {/* Time Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 border border-gray-200 dark:border-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">First Check In</span>
                  <Clock size={14} className="text-gray-400" />
                </div>
                {mode === 'edit' ? (
                  <CustomInput type="time" value={checkInTime} onChange={(e: any) => setCheckInTime(e.target.value)} className="w-full" />
                ) : (
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {record.checkIn ? (record.checkIn.includes('T') ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : record.checkIn) : '--:--'}
                  </div>
                )}
              </div>
              <div className="p-4 border border-gray-200 dark:border-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Check Out</span>
                  <Clock size={14} className="text-gray-400" />
                </div>
                {mode === 'edit' ? (
                  <CustomInput type="time" value={checkOutTime} onChange={(e: any) => setCheckOutTime(e.target.value)} className="w-full" />
                ) : (
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {record.checkOut ? (record.checkOut.includes('T') ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : record.checkOut) : '--:--'}
                  </div>
                )}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg space-y-4 mb-6 border border-gray-100 dark:border-white/5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Working Hours</span>
                <span className="font-semibold text-gray-900 dark:text-white bg-white dark:bg-black/20 px-2 py-1 rounded-md">{record.workingHours || record.hours || 0} hrs</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Late By</span>
                <span className={`font-semibold bg-white dark:bg-black/20 px-2 py-1 rounded-md ${record.lateBy ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                  {record.lateBy || 0} mins
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Early Exit</span>
                <span className={`font-semibold bg-white dark:bg-black/20 px-2 py-1 rounded-md ${record.earlyExit ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
                  {record.earlyExit || 0} mins
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Source</span>
                <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-semibold bg-white dark:bg-black/20 px-2 py-1 rounded-md">
                  <MonitorSmartphone size={14} />
                  {record.attendanceSource || 'Web'}
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            {punchLogs.length > 0 && (
              <div className="mb-6 p-5 border border-gray-100 dark:border-white/10 rounded-xl bg-white dark:bg-[#13141a]">
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-primary" /> Activity Timeline
                </h3>
                <div className="relative border-l-2 border-gray-100 dark:border-white/10 ml-3 pl-5 space-y-6">
                  {punchLogs.map((log: any, idx: number) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-[27px] w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#13141a] ${log.direction === 'In' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          Punched {log.direction}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'} • {log.locationLabel || log.source || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exceptions */}
            {record.exceptionType && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg mb-6">
                <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-red-800 dark:text-red-400">Exception: {record.exceptionType}</h4>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    This attendance record requires regularization.
                  </p>
                </div>
              </div>
            )}

            {/* Edit Mode Fields */}
            {mode === 'edit' && (
              <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-white/5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Manual Adjustment</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                    <CustomSelect
                      options={[
                        { value: AttendanceStatus.Present, label: 'Present' },
                        { value: AttendanceStatus.Absent, label: 'Absent' },
                        { value: AttendanceStatus.HalfDay, label: 'Half Day' },
                        { value: AttendanceStatus.Leave, label: 'Leave' }
                      ]}
                      value={status || ''}
                      onChange={(val) => setStatus(val as AttendanceStatus)}
                      placeholder="Select Status"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add remarks for this manual edit..."
                    className="w-full px-3 py-2 bg-white dark:bg-[#13141a] border border-gray-200 dark:border-white/10 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary custom-scrollbar min-h-[100px] resize-none"
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
