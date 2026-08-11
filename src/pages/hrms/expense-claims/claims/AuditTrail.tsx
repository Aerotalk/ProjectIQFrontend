import { useState, useEffect } from 'react';
import { Loader2, Activity } from 'lucide-react';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';

export default function AuditTrail() {
  const [logs, setLogs] = useState<any[]>([]);
  const [employees, setEmployees] = useState<{ id: string, firstName: string, lastName: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [logsRes, empRes] = await Promise.all([
        api.get('/hrms/expense-claims/audit-logs'),
        api.get('/admin/employees').catch(() => [])
      ]);
      setLogs(logsRes || []);
      setEmployees(empRes || []);
    } catch (err) {
      toast.error('Failed to load audit trail');
    } finally {
      setIsLoading(false);
    }
  };

  const getReviewerName = (id?: string) => {
    if (!id) return 'System';
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f]">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity size={18} className="text-primary" />
            Global Audit Trail
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Showing all activity for expense claims, advances, and batches.</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        {logs.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No activity logs found.
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 dark:border-white/10 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Date & Time</th>
                  <th className="px-4 py-3 font-medium">Entity Type</th>
                  <th className="px-4 py-3 font-medium">Entity ID</th>
                  <th className="px-4 py-3 font-medium">Action Performed</th>
                  <th className="px-4 py-3 font-medium">Status Change</th>
                  <th className="px-4 py-3 font-medium">Performed By</th>
                  <th className="px-4 py-3 font-medium">Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {logs.map((log) => (
                  <tr key={log.id} className="text-sm hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">{formatDate(log.date || log.createdAt)}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded text-xs font-medium">
                        {log.entityType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono text-xs" title={log.entityId}>
                      {log.entityId?.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{log.action}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.status || '-'}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{getReviewerName(log.reviewerId || log.userId)}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-xs truncate" title={log.comment}>
                      {log.comment || '-'}
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
