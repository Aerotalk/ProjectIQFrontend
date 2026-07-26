import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import BatchDrawer from './components/BatchDrawer';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus } from 'lucide-react';
import { mockExpenseClaimsService } from '../../../../services/mockExpenseClaimsService';
import type { ClaimBatch } from '../../../../types/expense-claims.types';
import toast from 'react-hot-toast';

export default function BatchProcessingMain() {
  const [batches, setBatches] = useState<ClaimBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await mockExpenseClaimsService.getBatches();
      setBatches(data);
    } catch (e) {
      toast.error('Failed to load batches');
    }
    setLoading(false);
  };

  const handleSave = async (data: any) => {
    try {
      if (drawerMode === 'create') {
        await mockExpenseClaimsService.createBatch({
          payrollPeriod: data.payrollPeriod,
          paymentMethod: data.paymentMethod,
          status: 'Draft',
          claimsCount: 5,
          totalAmount: 1250.00,
          createdBy: 'Finance Admin',
        });
        toast.success('Batch created successfully');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Failed to create batch');
    }
  };

  const columns = [
    { key: 'batchNo', label: 'Batch No' },
    { key: 'payrollPeriod', label: 'Payroll Period' },
    { key: 'claimsCount', label: 'Claims' },
    { key: 'totalAmount', label: 'Total Amount', render: (val: number) => `$${val.toFixed(2)}` },
    { key: 'status', label: 'Status' },
    { key: 'paidOn', label: 'Paid On', render: (val: string) => val ? new Date(val).toLocaleDateString() : '-' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <TableRowActionMenu
          actions={[
            { label: 'View Details', onClick: () => { setSelectedBatch(row); setDrawerMode('view'); setIsDrawerOpen(true); } },
            { label: 'Export Bank File', onClick: () => toast.success('File downloaded') }
          ]}
        />
      )
    }
  ];

  if (loading) return <div className="p-4"><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Batch Processing</h3>
        <button 
          onClick={() => { setDrawerMode('create'); setSelectedBatch(null); setIsDrawerOpen(true); }}
          className="flex items-center px-4 py-2 bg-[#792359] text-white text-sm font-medium rounded-md hover:bg-[#5d1943]"
        >
          <Plus size={16} className="mr-2" />
          Create Batch
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={batches} />
      </div>

      <BatchDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
        mode={drawerMode}
        initialData={selectedBatch ? {
          payrollPeriod: selectedBatch.payrollPeriod,
          paymentMethod: selectedBatch.paymentMethod
        } : undefined}
      />
    </div>
  );
}
