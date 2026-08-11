import { useState, useEffect } from 'react';
import { Loader2, CheckSquare } from 'lucide-react';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ApprovalsHistory() {
  const [claims, setClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/hrms/expense-claims/claims');
      const allClaims = res || [];
      // Filter out Draft and Pending to show only ones that have some history/action
      const historyClaims = allClaims.filter((c: any) => 
        c.status && c.status !== 'Draft' && c.status !== 'Pending'
      );
      setClaims(historyClaims);
    } catch (err) {
      toast.error('Failed to load approval history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Approved':
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Sent Back':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f]">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckSquare size={18} className="text-primary" />
            Approval History
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review previously approved or rejected expense claims.</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        {claims.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No approval history found.
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 dark:border-white/10 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Claim No</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Employee</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {claims.map((claim) => (
                  <tr key={claim.id} className="text-sm hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{claim.claimNo || `CLM-${claim.id?.slice(0,4)}`}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatDate(claim.createdAt || claim.submittedOn)}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {claim.employee?.firstName ? `${claim.employee.firstName} ${claim.employee.lastName}` : 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[200px] truncate" title={claim.title}>{claim.title}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white text-right font-medium">
                      {(claim.approvedAmount || claim.totalClaimed || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {claim.currency}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => navigate(`/companydashboard/hrms/expense-claims/claims/${claim.id}`)}
                        className="text-primary hover:text-primary-dark font-medium text-xs"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
