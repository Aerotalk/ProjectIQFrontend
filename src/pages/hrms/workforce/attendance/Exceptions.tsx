import { useMemo } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { ShieldAlert } from 'lucide-react';

export default function Exceptions() {
  const data = [
    { employee: 'Jane Smith', date: '2026-07-24', exception: 'Late In', status: 'Pending' },
    { employee: 'John Doe', date: '2026-07-23', exception: 'Missing Swipe', status: 'Resolved' },
  ];

  const columns = useMemo(() => [
    { key: 'employee', label: 'Employee', sortable: true },
    { key: 'date', label: 'Exception Date', sortable: true },
    { 
      key: 'exception', 
      label: 'Exception Type', 
      sortable: true,
      render: (val: string) => (
        <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-medium text-xs">
          <ShieldAlert size={12} />
          {val}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val: string) => (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${val === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_val: any, row: any) => (
        row.status === 'Pending' ? (
          <button className="text-xs text-[#792359] hover:underline">Regularize</button>
        ) : <span className="text-gray-400">-</span>
      )
    }
  ], []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Exceptions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage late arrivals, missing swipes, and early outs</p>
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
