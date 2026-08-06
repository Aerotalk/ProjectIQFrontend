import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import AdvanceDrawer from './components/AdvanceDrawer';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus, Search, Filter } from 'lucide-react';
import { mockExpenseClaimsService } from '../../../../services/mockExpenseClaimsService';
import type { ExpenseAdvance } from '../../../../types/expense-claims.types';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';

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
      const apiAdvances = await api.get('/hrms/expense-claims/advances').catch(() => []);
      let data: ExpenseAdvance[] = [];
      if (Array.isArray(apiAdvances) && apiAdvances.length > 0) {
        data = apiAdvances.map((a: any) => ({
          id: a.id,
          advanceNo: a.advanceNo || `ADV-${a.id.slice(0, 4)}`,
          employeeId: a.employee?.firstName ? `${a.employee.firstName} ${a.employee.lastName}` : (a.employeeId || 'EMP-001'),
          tripOrProject: a.tripOrProject || '',
          amount: a.amount || 0,
          currency: a.currency || 'USD',
          requestedDate: a.requestedDate || a.createdAt,
          requiredDate: a.requiredDate || a.createdAt,
          status: a.status || 'Pending',
          disbursed: a.disbursed ?? false,
          outstandingBalance: a.outstandingBalance || a.amount || 0,
          purpose: a.purpose || '',
          createdAt: a.createdAt,
          updatedAt: a.updatedAt
        }));
      } else {
        data = await mockExpenseClaimsService.getAdvances();
      }
      setAdvances(data);
    } catch (e) {
      toast.error('Failed to load advances');
      const fallback = await mockExpenseClaimsService.getAdvances();
      setAdvances(fallback);
    }
    setLoading(false);
  };

  const handleSave = async (data: any) => {
    try {
      if (drawerMode === 'create') {
        await api.post('/hrms/expense-claims/advances', {
          tripOrProject: data.tripOrProject,
          purpose: data.purpose,
          currency: data.currency,
          amount: data.amount,
          requestedDate: data.date,
          requiredDate: data.requiredDate,
          status: 'Pending',
          disbursed: false,
          outstandingBalance: data.amount
        }).catch(async () => {
          await mockExpenseClaimsService.createAdvance({
            ...data,
            employeeId: data.employee,
            requestedDate: new Date().toISOString(),
            status: 'Pending',
            disbursed: false,
            outstandingBalance: data.amount,
          });
        });
        toast.success('Advance request submitted');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Error creating advance');
    }
  };

  const handleDisburse = async (id: string) => {
    try {
      await api.put(`/hrms/expense-claims/advances/${id}/disburse`).catch(() => {});
      toast.success('Advance marked as disbursed');
      fetchData();
    } catch (e) {
      toast.error('Error disbursing advance');
    }
  };

  const columns = [
    { key: 'advanceNo', label: 'Advance No' },
    { key: 'employeeId', label: 'Employee' },
    { key: 'tripOrProject', label: 'Trip / Project' },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (val: number, row: any) => `${row.currency} ${(val || 0).toFixed(2)}`
    },
    { key: 'status', label: 'Status' },
    { key: 'requiredDate', label: 'Required Date', render: (val: string) => val ? new Date(val).toLocaleDateString() : '-' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: ExpenseAdvance) => (
        <TableRowActionMenu
          actions={[
            { label: 'View', onClick: () => { setSelectedAdvance(row); setDrawerMode('view'); setIsDrawerOpen(true); } },
            ...(row.status === 'Approved' && !row.disbursed ? [{ label: 'Disburse', onClick: () => handleDisburse(row.id) }] : [])
          ]}
        />
      )
    }
  ];

  if (loading) {
    return <div className="p-4"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#181a1f] p-4">
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
          requiredDate: selectedAdvance.requiredDate,
          date: selectedAdvance.requestedDate
        } : undefined}
      />
    </div>
  );
}
