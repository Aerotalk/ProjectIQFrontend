import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PoliciesList() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ id: string, category: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [policiesRes, categoriesRes] = await Promise.all([
        api.get('/hrms/expense-claims/policies'),
        api.get('/hrms/expense-claims/categories')
      ]);
      setPolicies(policiesRes || []);
      setCategories(categoriesRes || []);
    } catch (err) {
      toast.error('Failed to load policies');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.category || 'Unknown';
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f]">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Policies</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Define limits and rules for expense categories based on grades.</p>
        </div>
        <button
          onClick={() => navigate(`${basePath}/hrms/expense-claims/configuration/policy/new`)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-[#5d1944] text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
        >
          <Plus size={16} />
          Add Policy
        </button>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        {policies.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No policies defined yet. Click "Add Policy" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 dark:border-white/10 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Grade</th>
                  <th className="px-4 py-3 font-medium text-right">Max Claim Limit</th>
                  <th className="px-4 py-3 font-medium">Limit Type</th>
                  <th className="px-4 py-3 font-medium text-right">Period Limit</th>
                  <th className="px-4 py-3 font-medium text-right">Backdated Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {policies.map((policy) => (
                  <tr key={policy.id} className="text-sm hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{getCategoryName(policy.category?.id || policy.categoryId)}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{policy.grade}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white text-right font-medium">
                      {policy.maxClaim.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded text-xs font-medium">
                        {policy.limitType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-right">
                      {policy.periodLimit ? policy.periodLimit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-right">
                      {policy.backdatedDays} days
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
