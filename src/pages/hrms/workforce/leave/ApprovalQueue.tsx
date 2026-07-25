import { useMemo } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';

export default function ApprovalQueue() {
  const data = [
    { employee: 'Jane Smith', type: 'Sick Leave', duration: '2 Days', applied: '2026-07-24', status: 'Pending' },
  ];

  const columns = useMemo(() => [
    { key: 'employee', label: 'Employee', sortable: true },
    { key: 'type', label: 'Leave Type', sortable: true },
    { key: 'duration', label: 'Duration', sortable: true },
    { key: 'applied', label: 'Applied On', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val: string) => (
        <span className="px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide bg-orange-100 text-orange-700">
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <button className="text-xs bg-green-500 text-white px-2 py-1 rounded-sm">Approve</button>
          <button className="text-xs bg-red-500 text-white px-2 py-1 rounded-sm">Reject</button>
        </div>
      )
    }
  ], []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Approval Queue</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending leave requests awaiting your approval</p>
        </div>
      </div>
      <div className="flex-1 min-h-0 border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-[#181a1f]">
          <CustomTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}
