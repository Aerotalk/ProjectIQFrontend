import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus } from 'lucide-react';
import type { ExpenseTemplate } from '../../../../types/expense-claims.types';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TemplatesList() {
  const [templates, setTemplates] = useState<ExpenseTemplate[]>([]);
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
      const apiTemplates = await api.get('/hrms/expense-claims/templates');
      
      let tpls: ExpenseTemplate[] = [];
      if (Array.isArray(apiTemplates)) {
        tpls = apiTemplates.map((t: any) => ({
          id: t.id,
          templateName: t.templateName,
          description: t.description || '',
          allowedCategories: [],
          active: t.active ?? true
        }));
      }

      setTemplates(tpls);
    } catch (e) {
      toast.error('Failed to load templates');
      setTemplates([]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/hrms/expense-claims/templates/${id}`);
      toast.success('Template deleted');
      fetchData();
    } catch (e) {
      toast.error('Error deleting template');
    }
  };

  const columns = [
    { key: 'templateName', label: 'Template Name' },
    { key: 'description', label: 'Description' },
    { key: 'active', label: 'Status', render: (val: boolean) => val ? 'Active' : 'Inactive' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: ExpenseTemplate) => (
        <TableRowActionMenu
          actions={[
            { label: 'Edit', onClick: () => navigate(`${basePath}/hrms/expense-claims/configuration/template/${row.id}`) },
            { label: 'Delete', onClick: () => handleDelete(row.id), danger: true }
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Templates</h3>
        <button 
          onClick={() => navigate(`${basePath}/hrms/expense-claims/configuration/template/new`)}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Create Template
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={templates} />
      </div>
    </div>
  );
}
