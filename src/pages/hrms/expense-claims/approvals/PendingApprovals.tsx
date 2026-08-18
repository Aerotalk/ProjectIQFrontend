import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import { Skeleton } from '../../../../components/ui/skeleton';
import Drawer from '../../../../components/ui/Drawer';
import type { ExpenseClaim } from '../../../../types/expense-claims.types';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';

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
      const apiClaims = await api.get('/hrms/expense-claims/claims');
      let data: ExpenseClaim[] = [];
      if (Array.isArray(apiClaims)) {
        data = apiClaims.filter((c: any) => c.status === 'Submitted' || c.status?.includes('Level')).map((c: any) => ({
          id: c.id,
          claimNo: c.claimNo || `CLM-${c.id.slice(0, 4)}`,
          employeeId: c.employee?.firstName ? `${c.employee.firstName} ${c.employee.lastName}` : (c.employeeId || 'EMP-001'),
          departmentId: c.department?.departmentName,
          templateId: c.template?.id || c.templateId,
          title: c.title,
          totalClaimed: c.totalClaimed || 0,
          approvedAmount: c.approvedAmount || 0,
          status: c.status || 'Submitted',
          submittedOn: c.submittedOn || c.createdAt,
          currency: c.currency || 'USD',
          createdAt: c.createdAt,
          updatedAt: c.updatedAt
        }));
      }
      setClaims(data);
    } catch (e) {
      toast.error('Failed to load pending approvals');
      setClaims([]);
    }
    setLoading(false);
  };

  const handleApprove = async (claimId: string, amount: number) => {
    try {
      await api.put(`/hrms/expense-claims/claims/${claimId}/approve`, { approvedAmount: amount });
      toast.success('Claim Approved');
      setSelectedClaim(null);
      fetchData();
    } catch (e) {
      toast.error('Error approving claim');
    }
  };

  const handleReject = async (claimId: string, comment: string) => {
    try {
      await api.put(`/hrms/expense-claims/claims/${claimId}/reject`, { comment });
      toast.success('Claim Rejected');
      setSelectedClaim(null);
      fetchData();
    } catch (e) {
      toast.error('Error rejecting claim');
    }
  };

  const handleSendBack = async (claimId: string, comment: string) => {
    try {
      await api.put(`/hrms/expense-claims/claims/${claimId}/send-back`, { comment });
      toast.success('Claim Sent Back to Employee');
      setSelectedClaim(null);
      fetchData();
    } catch (e) {
      toast.error('Error sending claim back');
    }
  };

  const columns = [
    { key: 'claimNo', label: 'Claim No' },
    { key: 'title', label: 'Title' },
    { key: 'employeeId', label: 'Employee' },
    { 
      key: 'totalClaimed', 
      label: 'Total Claimed',
      render: (val: number, row: any) => `${row.currency} ${(val || 0).toFixed(2)}`
    },
    { key: 'status', label: 'Status' },
    { key: 'submittedOn', label: 'Submitted On', render: (val: string) => val ? new Date(val).toLocaleDateString() : '-' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: ExpenseClaim) => (
        <TableRowActionMenu
          actions={[
            { label: 'Review Claim', onClick: () => setSelectedClaim(row) }
          ]}
        />
      )
    }
  ];

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-[#181a1f] p-4 space-y-4">
        <Skeleton className="h-7 w-52 rounded" />
        <div className="border border-gray-100 dark:border-white/5 rounded-md overflow-hidden">
          <div className="flex gap-6 px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
            {[80, 160, 110, 90, 70, 90, 40].map((w, i) => (
              <Skeleton key={i} className="h-3.5 rounded" style={{ width: w }} />
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-6 px-4 py-4 border-b border-gray-100 dark:border-white/5 last:border-0" style={{ opacity: 1 - i * 0.12 }}>
              {[80, 160, 110, 90, 70, 90, 40].map((w, j) => (
                <Skeleton key={j} className="h-4 rounded" style={{ width: w }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#181a1f] p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Claims Pending Approval</h3>
      </div>

      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={claims} />
      </div>

      {selectedClaim && (
        <Drawer
          isOpen={!!selectedClaim}
          onClose={() => setSelectedClaim(null)}
          title={`Review Claim: ${selectedClaim.claimNo}`}
          width="max-w-xl"
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Claim Details</h4>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-white/5 p-4 rounded-md">
                <div>
                  <span className="text-gray-500 block">Title</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedClaim.title}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Employee</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedClaim.employeeId}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Total Claimed</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedClaim.currency} {selectedClaim.totalClaimed.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Status</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedClaim.status}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-white/10">
              <button
                onClick={() => handleReject(selectedClaim.id, 'Policy violation / insufficient receipts')}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium transition-colors"
              >
                Reject Claim
              </button>
              <button
                onClick={() => handleSendBack(selectedClaim.id, 'Need more information')}
                className="px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-md text-sm font-medium transition-colors"
              >
                Send Back
              </button>
              <button
                onClick={() => handleApprove(selectedClaim.id, selectedClaim.totalClaimed)}
                className="px-4 py-2 bg-primary text-white hover:bg-[#5d1943] rounded-md text-sm font-medium transition-colors"
              >
                Approve Full Amount
              </button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
