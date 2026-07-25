import { useState, useMemo } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import { useLeaveBalances } from '../hooks';
import { Search } from 'lucide-react';
import { Input } from '../../../../components/ui/input';

export default function LeaveBalances() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading } = useLeaveBalances({ search: searchTerm });

  const columns = useMemo(() => [
    { key: 'employeeId', label: 'Employee ID', sortable: true },
    { key: 'leaveTypeId', label: 'Leave Type ID', sortable: true },
    { key: 'openingBalance', label: 'Opening Balance', sortable: true },
    { key: 'granted', label: 'Granted', sortable: true },
    { key: 'availed', label: 'Availed', sortable: true },
    { key: 'encashed', label: 'Encashed', sortable: true },
    { key: 'available', label: 'Available', sortable: true },
    { key: 'updatedOn', label: 'Updated On', sortable: true },
  ], []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f] p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Leave Balances</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">View current leave balances for all employees</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            placeholder="Search employee..." 
            className="pl-9 bg-gray-50 dark:bg-white/[0.02] border-gray-200 dark:border-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-[#181a1f]">
          <CustomTable 
            columns={columns} 
            data={data} 
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
