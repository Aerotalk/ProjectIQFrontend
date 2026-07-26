import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus } from 'lucide-react';
import TemplateDrawer from './components/TemplateDrawer';
import { mockExpenseClaimsService } from '../../../../services/mockExpenseClaimsService';
import type { ExpenseTemplate, ExpenseCategoryConfig } from '../../../../types/expense-claims.types';
import toast from 'react-hot-toast';

export default function TemplatesList() {
  const [templates, setTemplates] = useState<ExpenseTemplate[]>([]);
  const [categories, setCategories] = useState<ExpenseCategoryConfig[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [data, cats] = await Promise.all([
        mockExpenseClaimsService.getTemplates(),
        mockExpenseClaimsService.getCategories()
      ]);
      setTemplates(data);
      setCategories(cats);
    } catch (e) {
      toast.error('Failed to load templates');
    }
    setLoading(false);
  };

  const handleSave = async (data: any) => {
    try {
      if (drawerMode === 'create') {
        await mockExpenseClaimsService.createTemplate(data);
        toast.success('Template created successfully');
      } else if (drawerMode === 'edit' && selectedTemplate) {
        await mockExpenseClaimsService.updateTemplate(selectedTemplate.id, data);
        toast.success('Template updated successfully');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Failed to save template');
    }
  };

  const columns = [
    { key: 'templateName', label: 'Template Name' },
    { key: 'description', label: 'Description' },
    { key: 'allowedCategories', label: 'Categories Count', render: (val: string[]) => val?.length || 0 },
    { key: 'active', label: 'Active', render: (val: boolean) => val ? 'Yes' : 'No' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <TableRowActionMenu actions={[{ label: 'Edit', onClick: () => { setSelectedTemplate(row); setDrawerMode('edit'); setIsDrawerOpen(true); } }]} />
      )
    }
  ];

  if (loading) return <div className="p-4"><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Templates</h3>
        <button onClick={() => { setDrawerMode('create'); setSelectedTemplate(null); setIsDrawerOpen(true); }} className="flex items-center px-4 py-2 bg-[#792359] text-white text-sm font-medium rounded-md hover:bg-[#5d1943]">
          <Plus size={16} className="mr-2" />
          Add Template
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={templates} />
      </div>

      <TemplateDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
        mode={drawerMode}
        initialData={selectedTemplate || undefined}
        categories={categories}
      />
    </div>
  );
}
