import { useMemo, useState } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import AttendanceWizardDrawer from './AttendanceWizardDrawer';

export default function ProcessingPeriods() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const data = [
    { periodName: 'July 2026', startDate: '2026-07-01', endDate: '2026-07-31', status: 'Open', lockedAt: '-' },
    { periodName: 'June 2026', startDate: '2026-06-01', endDate: '2026-06-30', status: 'Processed', lockedAt: '2026-07-05' },
  ];

  const columns = useMemo(() => [
    { key: 'periodName', label: 'Period Name', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'endDate', label: 'End Date', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val: string) => (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${
          val === 'Processed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {val}
        </span>
      )
    },
    { key: 'lockedAt', label: 'Locked At', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (_val: any, row: any) => (
        row.status === 'Open' ? (
          <button onClick={() => setIsWizardOpen(true)} className="text-xs text-[#792359] hover:underline font-medium">Process Attendance</button>
        ) : (
          <button className="text-xs text-[#792359] hover:underline">View Finalized</button>
        )
      )
    }
  ], []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Processing</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Process attendance to finalize payable days for payroll</p>
        </div>
        <button onClick={() => setIsWizardOpen(true)} className="px-4 py-2 bg-[#792359] text-white rounded-sm text-sm font-medium shadow-sm">
          New Processing Period
        </button>
      </div>
      <div className="flex-1 min-h-0 border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-[#181a1f]">
          <CustomTable columns={columns} data={data} />
        </div>
      </div>

      <AttendanceWizardDrawer isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </div>
  );
}
