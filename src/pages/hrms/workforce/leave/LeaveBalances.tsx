import { useState, useMemo } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { useLeaveBalances } from '../hooks';
import { Input as CustomInput } from '../../../../components/ui/input';
import { Wallet } from 'lucide-react';
import type { LeaveBalance } from '../types';

export default function LeaveBalances() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading } = useLeaveBalances({ search: searchTerm });

  const columns = useMemo(() => [
    { 
      key: 'employeeName', 
      label: 'Employee', 
      sortable: true,
      render: (_: any, row: LeaveBalance) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.employeeName}</div>
          <div className="text-xs text-gray-500">{row.department}</div>
        </div>
      )
    },
    { 
      key: 'leaveTypeName', 
      label: 'Leave Type', 
      sortable: true,
      render: (val: string, row: LeaveBalance) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{val}</div>
          <div className="text-xs text-gray-500">{row.year}</div>
        </div>
      )
    },
    { key: 'openingBalance', label: 'Opening', sortable: true },
    { key: 'granted', label: 'Granted', sortable: true },
    { key: 'availed', label: 'Availed', sortable: true },
    { 
      key: 'available', 
      label: 'Available', 
      sortable: true,
      render: (val: number) => (
        <span className={`font-semibold ${val > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {val}
        </span>
      )
    }
  ], []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Leave Balances</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">View current leave balances for all employees</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-72">
          <CustomInput 
            placeholder="Search employee..." 
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
              <Wallet size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No leave balances found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
