import { useState, useMemo } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import AttendanceWizardDrawer from './AttendanceWizardDrawer';
import { useAttendancePeriods } from '../hooks';
import { Settings, Play, CheckCircle, FileText } from 'lucide-react';
import SmartActionMenu from '../../../../components/ui/SmartActionMenu';
import { Input as CustomInput } from '../../../../components/ui/input';
import { ProcessingStatus } from '../types';
import type { AttendancePeriod } from '../types';

export default function ProcessingPeriods() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading, refresh } = useAttendancePeriods({ search: searchTerm });

  const columns = useMemo(() => [
    { 
      key: 'periodName', 
      label: 'Period Name', 
      sortable: true,
      render: (val: string, row: AttendancePeriod) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
            <Settings size={14} className="text-primary" />
            {val}
          </div>
          <div className="text-xs text-gray-500">{row.startDate} to {row.endDate}</div>
        </div>
      )
    },
    { 
      key: 'employeeCount', 
      label: 'Employees', 
      sortable: true,
      render: (val: number) => <span className="font-medium text-gray-700 dark:text-gray-300">{val}</span>
    },
    { 
      key: 'attendanceCount', 
      label: 'Records', 
      sortable: true,
      render: (val: number) => <span className="font-medium text-gray-700 dark:text-gray-300">{val}</span>
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val: ProcessingStatus) => {
        const isProcessed = val === ProcessingStatus.Processed;
        return (
          <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${
            isProcessed ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 
            val === ProcessingStatus.InProgress ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400' :
            'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
          }`}>
            {val}
          </span>
        );
      }
    },
    { 
      key: 'lockedAt', 
      label: 'Locked At', 
      sortable: true,
      render: (val: string) => <span className="text-sm text-gray-600 dark:text-gray-400">{val || '-'}</span>
    },
    {
      key: 'actions',
      label: '',
      render: (_val: any, row: AttendancePeriod) => {
        const ActionCell = () => {
          const [isOpen, setIsOpen] = useState(false);
          const isProcessed = row.status === ProcessingStatus.Processed;
          return (
            <SmartActionMenu isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
              {!isProcessed ? (
                <button onClick={() => { setIsOpen(false); setIsWizardOpen(true); }} className="w-full text-left px-4 py-2 text-sm text-primary dark:text-secondary hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                  <Play size={14} /> Process Attendance
                </button>
              ) : (
                <button onClick={() => { setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" /> View Finalized
                </button>
              )}
            </SmartActionMenu>
          );
        };
        return <ActionCell />;
      }
    }
  ], []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Processing</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Process attendance to finalize payable days for payroll</p>
        </div>
        <button 
          onClick={() => setIsWizardOpen(true)} 
          className="px-4 py-2 bg-primary text-white rounded-sm text-sm font-medium hover:bg-primary-dark transition-colors whitespace-nowrap shadow-sm"
        >
          New Processing Period
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-72">
          <CustomInput 
            placeholder="Search periods..." 
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-[#181a1f]">
          {data.length > 0 ? (
            <CustomTable 
              columns={columns} 
              data={data} 
              loading={loading}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 py-12">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No processing periods found.</p>
            </div>
          )}
        </div>
      </div>

      <AttendanceWizardDrawer isOpen={isWizardOpen} onClose={() => { setIsWizardOpen(false); refresh(); }} />
    </div>
  );
}
