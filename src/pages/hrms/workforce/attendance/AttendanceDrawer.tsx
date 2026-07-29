import { useState } from 'react';
import { X, Clock, MonitorSmartphone, AlertCircle, Save } from 'lucide-react';
import type { AttendanceRecord } from '../types';
import { Input as CustomInput } from '../../../../components/ui/input';
import CustomSelect from '../../../../components/ui/CustomSelect';
import { Button } from '../../../../components/ui/button';

interface AttendanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
  mode: 'view' | 'edit';
}

export default function AttendanceDrawer({ isOpen, onClose, record, mode }: AttendanceDrawerProps) {
  const [remarks, setRemarks] = useState('');

  if (!isOpen || !record) return null;

  return (
    <>
      <div className={`w-[360px] lg:w-[420px] bg-white dark:bg-[#181a1f] border-l border-gray-200 dark:border-white/10 shadow-lg flex flex-col transform transition-transform duration-300 overflow-hidden ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute right-0'}`}>
        <div className="flex items-center justify-between p-5 lg:p-6 border-b border-gray-100 dark:border-white/5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {mode === 'edit' ? 'Edit Attendance' : 'Attendance Details'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {record.date} • {record.shiftName}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 lg:p-6 custom-scrollbar">
          <div className="space-y-6">
            
            {/* Employee Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-secondary/10 flex items-center justify-center text-primary dark:text-secondary font-semibold text-lg">
                {record.employeeName.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{record.employeeName}</h3>
                <p className="text-sm text-gray-500">{record.employeeCode}</p>
              </div>
            </div>

            {/* Time Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 dark:border-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</span>
                  <Clock size={14} className="text-gray-400" />
                </div>
                {mode === 'edit' ? (
                  <CustomInput type="time" defaultValue={record.checkIn} className="w-full" />
                ) : (
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{record.checkIn || '--:--'}</div>
                )}
              </div>
              <div className="p-4 border border-gray-200 dark:border-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</span>
                  <Clock size={14} className="text-gray-400" />
                </div>
                {mode === 'edit' ? (
                  <CustomInput type="time" defaultValue={record.checkOut} className="w-full" />
                ) : (
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{record.checkOut || '--:--'}</div>
                )}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Working Hours</span>
                <span className="font-medium text-gray-900 dark:text-white">{record.workingHours || 0} hrs</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Late By</span>
                <span className={`font-medium ${record.lateBy ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                  {record.lateBy || 0} mins
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Early Exit</span>
                <span className={`font-medium ${record.earlyExit ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
                  {record.earlyExit || 0} mins
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Source</span>
                <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-medium">
                  <MonitorSmartphone size={14} />
                  {record.attendanceSource}
                </div>
              </div>
            </div>

            {/* Exceptions */}
            {record.exceptionType && (
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg">
                <AlertCircle size={16} className="text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-400">Exception: {record.exceptionType}</h4>
                  <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                    This attendance record requires regularization.
                  </p>
                </div>
              </div>
            )}

            {/* Edit Mode Fields */}
            {mode === 'edit' && (
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                  <CustomSelect
                    options={[
                      { value: 'Present', label: 'Present' },
                      { value: 'Absent', label: 'Absent' },
                      { value: 'Half Day', label: 'Half Day' }
                    ]}
                    value={record.status}
                    onChange={() => {}}
                    placeholder="Select Status"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add remarks for this manual edit..."
                    className="w-full px-3 py-2 bg-white dark:bg-[#13141a] border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-secondary custom-scrollbar min-h-[100px] resize-none"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        {mode === 'edit' && (
          <div className="p-5 lg:p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-[#681d4b] text-white">
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
