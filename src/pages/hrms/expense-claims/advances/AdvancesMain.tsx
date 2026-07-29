import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import AdvanceDrawer from './components/AdvanceDrawer';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus, Search, Filter } from 'lucide-react';
import { mockExpenseClaimsService } from '../../../../services/mockExpenseClaimsService';
import type { ExpenseAdvance } from '../../../../types/expense-claims.types';
import toast from 'react-hot-toast';

export default function AdvancesMain() {
  const [advances, setAdvances] = useState<ExpenseAdvance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedAdvance, setSelectedAdvance] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await mockExpenseClaimsService.getAdvances();
      setAdvances(data);
    } catch (e) {
      toast.error('Failed to load advances');
    }
    setLoading(false);
  };

  const handleSave = async (data: any) => {
    try {
      if (drawerMode === 'create') {
        await mockExpenseClaimsService.createAdvance({
          ...data,
          employeeId: data.employee,
          requestedDate: new Date().toISOString(),
          status: 'Pending',
          disbursed: false,
          outstandingBalance: data.amount,
        });
        toast.success('Advance request submitted');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Error creating advance');
    }
  };

  const columns = [
    { key: 'advanceNo', label: 'Advance No' },
    { key: 'employeeId', label: 'Employee' },
    { key: 'tripOrProject', label: 'Trip / Project' },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (val: number, row: any) => `${row.currency} ${val.toFixed(2)}`
    },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <TableRowActionMenu
          actions={[
            { label: 'View Details', onClick: () => { setSelectedAdvance(row); setDrawerMode('view'); setIsDrawerOpen(true); } }
          ]}
        />
      )
    }
  ];

  if (loading) {
    return <div className="p-4"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search advances..." 
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-white/10 rounded-md bg-transparent text-sm w-64 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="p-2 border border-gray-200 dark:border-white/10 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
            <Filter size={16} />
          </button>
        </div>
        <button 
          onClick={() => { setDrawerMode('create'); setSelectedAdvance(null); setIsDrawerOpen(true); }}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Request Advance
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={advances} />
      </div>

      <AdvanceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
        mode={drawerMode}
        initialData={selectedAdvance ? {
          employee: selectedAdvance.employeeId,
          tripOrProject: selectedAdvance.tripOrProject,
          purpose: selectedAdvance.purpose,
          currency: selectedAdvance.currency,
          amount: selectedAdvance.amount,
          date: selectedAdvance.requestedDate,
          requiredDate: selectedAdvance.requiredDate
        } : undefined}
      />
    </div>
  );
}
