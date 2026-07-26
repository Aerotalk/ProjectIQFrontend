import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import { Skeleton } from '../../../../components/ui/skeleton';
import Drawer from '../../../../components/ui/Drawer';
import { mockExpenseClaimsService } from '../../../../services/mockExpenseClaimsService';
import type { ExpenseClaim } from '../../../../types/expense-claims.types';
import toast from 'react-hot-toast';

export default function PendingApprovals() {
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<ExpenseClaim | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await mockExpenseClaimsService.getClaims();
      // Mock filter for pending approval for the current user
      setClaims(data.filter(c => c.status === 'Submitted' || c.status.includes('Level')));
    } catch (e) {
      toast.error('Failed to load pending approvals');
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!selectedClaim) return;
    try {
      await mockExpenseClaimsService.approveClaim(selectedClaim.id, selectedClaim.totalClaimed, 'REV-001', 'Approved');
      toast.success('Claim approved');
      setSelectedClaim(null);
      fetchData();
    } catch (e) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async () => {
    if (!selectedClaim) return;
    try {
      await mockExpenseClaimsService.rejectClaim(selectedClaim.id, 'REV-001', 'Rejected');
      toast.success('Claim rejected');
      setSelectedClaim(null);
      fetchData();
    } catch (e) {
      toast.error('Rejection failed');
    }
  };

  const columns = [
    { key: 'claimNo', label: 'Claim No' },
    { key: 'employeeId', label: 'Employee' },
    { 
      key: 'totalClaimed', 
      label: 'Amount',
      render: (val: number, row: any) => `${row.currency} ${val.toFixed(2)}`
    },
    { key: 'submittedOn', label: 'Submitted', render: (val: string) => val ? new Date(val).toLocaleDateString() : '-' },
    { key: 'status', label: 'Current Level' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: ExpenseClaim) => (
        <TableRowActionMenu
          actions={[
            { label: 'View & Action', onClick: () => setSelectedClaim(row) }
          ]}
        />
      )
    }
  ];

  if (loading) return <div className="p-4"><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Approvals</h3>
      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={claims} />
      </div>

      <Drawer
        isOpen={!!selectedClaim}
        onClose={() => setSelectedClaim(null)}
        title={`Approval Action - ${selectedClaim?.claimNo}`}
        size="lg"
      >
        <div className="p-6 space-y-6">
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-md">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Employee:</span> {selectedClaim?.employeeId}</div>
              <div><span className="text-gray-500">Amount:</span> {selectedClaim?.currency} {selectedClaim?.totalClaimed.toFixed(2)}</div>
              <div><span className="text-gray-500">Title:</span> {selectedClaim?.title}</div>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-white/10 rounded-md p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Expense Items</h4>
            <p className="text-sm text-gray-500">No items mock data available for this view.</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#181a1f] flex justify-end space-x-3">
          <button 
            onClick={handleReject}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            Reject
          </button>
          <button 
            onClick={handleApprove}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Approve
          </button>
        </div>
      </Drawer>
    </div>
  );
}
