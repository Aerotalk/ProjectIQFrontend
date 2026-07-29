import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import ClaimDrawer from './components/ClaimDrawer';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus, Search, Filter } from 'lucide-react';
import { mockExpenseClaimsService } from '../../../../services/mockExpenseClaimsService';
import type { ExpenseClaim, ExpenseTemplate } from '../../../../types/expense-claims.types';
import toast from 'react-hot-toast';

export default function ClaimsList() {
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [templates, setTemplates] = useState<ExpenseTemplate[]>([]);

  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [claimsData, tpls] = await Promise.all([
        mockExpenseClaimsService.getClaims(),
        mockExpenseClaimsService.getTemplates()
      ]);
      setClaims(claimsData);
      setTemplates(tpls);
    } catch (e) {
      toast.error('Failed to load claims');
    }
    setLoading(false);
  };

  const handleSave = async (data: any) => {
    try {
      if (drawerMode === 'create') {
        await mockExpenseClaimsService.createClaim({
          templateId: data.template,
          title: data.title,
          currency: data.currency,
          employeeId: 'EMP-001',
          status: 'Draft',
          totalClaimed: 0,
          approvedAmount: 0
        });
        toast.success('Claim Envelope created successfully');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Error saving claim');
    }
  };

  const columns = [
    { key: 'claimNo', label: 'Claim No' },
    { key: 'title', label: 'Title' },
    { key: 'employeeId', label: 'Employee' },
    { 
      key: 'totalClaimed', 
      label: 'Total Claimed',
      render: (val: number, row: any) => `${row.currency} ${val.toFixed(2)}`
    },
    { key: 'status', label: 'Status' },
    { key: 'submittedOn', label: 'Submitted On', render: (val: string) => val ? new Date(val).toLocaleDateString() : '-' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: ExpenseClaim) => (
        <TableRowActionMenu
          actions={[
            { label: 'View / Edit', onClick: () => { setSelectedClaim(row); setDrawerMode('view'); setIsDrawerOpen(true); } },
            { label: 'Delete', onClick: () => mockExpenseClaimsService.deleteClaim(row.id).then(fetchData), danger: true }
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
              placeholder="Search claims..." 
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-white/10 rounded-md bg-transparent text-sm w-64 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="p-2 border border-gray-200 dark:border-white/10 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
            <Filter size={16} />
          </button>
        </div>
        <button 
          onClick={() => { setDrawerMode('create'); setSelectedClaim(null); setIsDrawerOpen(true); }}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          New Claim Envelope
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={claims} />
      </div>

      <ClaimDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
        mode={drawerMode}
        templates={templates}
        initialData={selectedClaim ? {
          template: selectedClaim.templateId,
          title: selectedClaim.title,
          currency: selectedClaim.currency
        } : undefined}
      />
    </div>
  );
}
