import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus, Search, Filter } from 'lucide-react';
import type { ExpenseClaim } from '../../../../types/expense-claims.types';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';

export default function ClaimsList() {
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
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
      const apiClaims = await api.get('/hrms/expense-claims/claims');
      
      let claimsData: ExpenseClaim[] = [];
      if (Array.isArray(apiClaims)) {
        claimsData = apiClaims.map((c: any) => ({
          id: c.id,
          claimNo: c.claimNo || `CLM-${c.id.slice(0, 4)}`,
          employeeId: c.employeeName || (c.employee?.firstName ? `${c.employee.firstName} ${c.employee.lastName}` : (c.employeeId || 'EMP-001')),
          departmentId: c.departmentName || c.department?.departmentName,
          templateId: c.templateName || c.template?.id || c.templateId,
          title: c.title,
          totalClaimed: c.totalClaimed || 0,
          approvedAmount: c.approvedAmount || 0,
          status: c.status || 'Draft',
          submittedOn: c.submittedOn || c.createdAt,
          currency: c.currency || 'USD',
          createdAt: c.createdAt,
          updatedAt: c.updatedAt
        }));
      }

      setClaims(claimsData);
    } catch (e) {
      toast.error('Failed to load claims');
      setClaims([]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/hrms/expense-claims/claims/${id}`);
      toast.success('Claim deleted');
      fetchData();
    } catch (e) {
      toast.error('Failed to delete claim');
    }
  };

  const handleSubmit = async (id: string) => {
    try {
      await api.post(`/hrms/expense-claims/claims/${id}/submit`);
      toast.success('Claim submitted for approval');
      fetchData();
    } catch (e) {
      toast.error('Failed to submit claim');
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
            ...(row.status === 'Draft' ? [{ label: 'Submit Claim', onClick: () => handleSubmit(row.id) }] : []),
            { label: 'View / Edit', onClick: () => navigate(`${basePath}/hrms/expense-claims/claim/${row.id}`) },
            { label: 'Delete', onClick: () => handleDelete(row.id), danger: true }
          ]}
        />
      )
    }
  ];

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-[#181a1f] p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-56 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>
        <div className="border border-gray-100 dark:border-white/5 rounded-md overflow-hidden">
          <div className="flex gap-6 px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
            {[80, 160, 100, 90, 70, 90, 40].map((w, i) => (
              <Skeleton key={i} className="h-3.5 rounded" style={{ width: w }} />
            ))}
          </div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-6 px-4 py-4 border-b border-gray-100 dark:border-white/5 last:border-0" style={{ opacity: 1 - i * 0.12 }}>
              {[80, 160, 100, 90, 70, 90, 40].map((w, j) => (
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
          onClick={() => navigate(`${basePath}/hrms/expense-claims/claim/new`)}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          New Claim Envelope
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={claims} />
      </div>
    </div>
  );
}
