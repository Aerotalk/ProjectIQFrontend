import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ReviewerAssignment() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<{ id: string, firstName: string, lastName: string }[]>([]);
  const [templates, setTemplates] = useState<{ id: string, templateName: string }[]>([]);
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
      const [assignRes, empRes, tmplRes] = await Promise.all([
        api.get('/hrms/expense-claims/reviewer-assignments'),
        api.get('/admin/employees'),
        api.get('/hrms/expense-claims/templates')
      ]);
      setAssignments(assignRes || []);
      setEmployees(empRes || []);
      setTemplates(tmplRes || []);
    } catch (err) {
      toast.error('Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeName = (id: string) => {
    if (!id) return '-';
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
  };

  const getTemplateName = (id: string) => {
    return templates.find(t => t.id === id)?.templateName || 'Unknown';
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a1f]">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reviewer Assignments</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Map employees to their respective approvers for expense templates.</p>
        </div>
        <button
          onClick={() => navigate(`${basePath}/hrms/expense-claims/configuration/reviewer-assignment/new`)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-[#5d1944] text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
        >
          <Plus size={16} />
          Assign Reviewers
        </button>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        {assignments.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No reviewer assignments found. Click "Assign Reviewers" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 dark:border-white/10 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Employee</th>
                  <th className="px-4 py-3 font-medium">Template</th>
                  <th className="px-4 py-3 font-medium">L1 Approver</th>
                  <th className="px-4 py-3 font-medium">L2 Approver</th>
                  <th className="px-4 py-3 font-medium">L3 Approver</th>
                  <th className="px-4 py-3 font-medium text-right">Escalation (Days)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="text-sm hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{getEmployeeName(assignment.employee?.id || assignment.employeeId)}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{getTemplateName(assignment.template?.id || assignment.templateId)}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{getEmployeeName(assignment.reviewer1?.id || assignment.reviewer1Id)}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{getEmployeeName(assignment.reviewer2?.id || assignment.reviewer2Id)}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{getEmployeeName(assignment.reviewer3?.id || assignment.reviewer3Id)}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-right">{assignment.autoEscalationDays}</td>
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
