import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus } from 'lucide-react';
import type { ClaimBatch } from '../../../../types/expense-claims.types';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BatchProcessingMain() {
  const [batches, setBatches] = useState<ClaimBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiBatches = await api.get('/hrms/expense-claims/batches');
      let data: ClaimBatch[] = [];
      if (Array.isArray(apiBatches)) {
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
      }
      setBatches(data);
    } catch (e) {
      toast.error('Failed to load batches');
      setBatches([]);
    }
    setLoading(false);
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await api.put(`/hrms/expense-claims/batches/${id}/pay`);
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
            { label: 'View / Edit', onClick: () => navigate(`${basePath}/hrms/expense-claims/batch/${row.id}`) },
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
          onClick={() => navigate(`${basePath}/hrms/expense-claims/batch/new`)}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Create Payment Batch
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={batches} />
      </div>
    </div>
  );
}
