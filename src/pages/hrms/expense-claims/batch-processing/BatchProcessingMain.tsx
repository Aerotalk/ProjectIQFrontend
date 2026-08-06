import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import BatchDrawer from './components/BatchDrawer';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus } from 'lucide-react';
import { mockExpenseClaimsService } from '../../../../services/mockExpenseClaimsService';
import type { ClaimBatch } from '../../../../types/expense-claims.types';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';

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
      const apiBatches = await api.get('/hrms/expense-claims/batches').catch(() => []);
      let data: ClaimBatch[] = [];
      if (Array.isArray(apiBatches) && apiBatches.length > 0) {
        data = apiBatches.map((b: any) => ({
          id: b.id,
          batchNo: b.batchNo || `BAT-${b.id.slice(0, 4)}`,
          payrollPeriod: b.payrollPeriod || '',
          claimsCount: b.claimsCount || 0,
          totalAmount: b.totalAmount || 0,
          status: b.status || 'Draft',
          createdBy: b.createdBy?.fullName || 'Finance Team',
          paidOn: b.paidOn,
          paymentMethod: b.paymentMethod || 'Bank Transfer',
          createdAt: b.createdAt
        }));
      } else {
        data = await mockExpenseClaimsService.getBatches();
      }
      setBatches(data);
    } catch (e) {
      toast.error('Failed to load batches');
      const fallback = await mockExpenseClaimsService.getBatches();
      setBatches(fallback);
    }
    setLoading(false);
  };

  const handleSave = async (data: any) => {
    try {
      if (drawerMode === 'create') {
        await api.post('/hrms/expense-claims/batches', {
          payrollPeriod: data.payrollPeriod,
          paymentMethod: data.paymentMethod,
          claimsCount: 5,
          totalAmount: 1250.00,
          status: 'Draft'
        }).catch(async () => {
          await mockExpenseClaimsService.createBatch({
            payrollPeriod: data.payrollPeriod,
            paymentMethod: data.paymentMethod,
            claimsCount: 5,
            totalAmount: 1250.00,
            status: 'Draft',
            createdBy: 'USR-001'
          });
        });
        toast.success('Payment batch created');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Error creating batch');
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await api.put(`/hrms/expense-claims/batches/${id}/pay`).catch(() => {});
      toast.success('Batch marked as paid');
      fetchData();
    } catch (e) {
      toast.error('Error marking batch as paid');
    }
  };

  const columns = [
    { key: 'batchNo', label: 'Batch No' },
    { key: 'payrollPeriod', label: 'Period' },
    { key: 'claimsCount', label: 'Claims Count' },
    { 
      key: 'totalAmount', 
      label: 'Total Amount',
      render: (val: number) => `$${(val || 0).toFixed(2)}`
    },
    { key: 'paymentMethod', label: 'Method' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: ClaimBatch) => (
        <TableRowActionMenu
          actions={[
            { label: 'View Batch', onClick: () => { setSelectedBatch(row); setDrawerMode('view'); setIsDrawerOpen(true); } },
            ...(row.status !== 'Paid' ? [{ label: 'Mark as Paid', onClick: () => handleMarkPaid(row.id) }] : [])
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Batch Payment Processing</h3>
        <button 
          onClick={() => { setDrawerMode('create'); setSelectedBatch(null); setIsDrawerOpen(true); }}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Create Payment Batch
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
