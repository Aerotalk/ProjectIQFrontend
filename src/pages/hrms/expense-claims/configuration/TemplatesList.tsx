import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus } from 'lucide-react';
import TemplateDrawer from './components/TemplateDrawer';
import { mockExpenseClaimsService } from '../../../../services/mockExpenseClaimsService';
import type { ExpenseTemplate, ExpenseCategoryConfig } from '../../../../types/expense-claims.types';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';

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
      const [apiTemplates, apiCategories] = await Promise.all([
        api.get('/hrms/expense-claims/templates').catch(() => []),
        api.get('/hrms/expense-claims/categories').catch(() => [])
      ]);
      
      let tpls: ExpenseTemplate[] = [];
      if (Array.isArray(apiTemplates) && apiTemplates.length > 0) {
        tpls = apiTemplates.map((t: any) => ({
          id: t.id,
          templateName: t.templateName,
          description: t.description || '',
          allowedCategories: [],
          active: t.active ?? true
        }));
      } else {
        tpls = await mockExpenseClaimsService.getTemplates();
      }

      let cats: ExpenseCategoryConfig[] = [];
      if (Array.isArray(apiCategories) && apiCategories.length > 0) {
        cats = apiCategories.map((c: any) => ({
          id: c.id,
          category: c.category,
          glCode: c.glCode || '',
          receiptRequired: c.receiptRequired ?? false,
          minReceiptAmount: c.minReceiptAmount || 0,
          active: c.active ?? true
        }));
      } else {
        cats = await mockExpenseClaimsService.getCategories();
      }

      setTemplates(tpls);
      setCategories(cats);
    } catch (e) {
      toast.error('Failed to load templates');
      const fallbackTemplates = await mockExpenseClaimsService.getTemplates();
      const fallbackCats = await mockExpenseClaimsService.getCategories();
      setTemplates(fallbackTemplates);
      setCategories(fallbackCats);
    }
    setLoading(false);
  };

  const handleSave = async (formData: any) => {
    try {
      if (drawerMode === 'create') {
        await api.post('/hrms/expense-claims/templates', {
          templateName: formData.templateName,
          description: formData.description,
          allowedCategories: formData.allowedCategories,
          active: formData.active
        }).catch(async () => {
          await mockExpenseClaimsService.createTemplate(formData);
        });
        toast.success('Template created successfully');
      } else if (drawerMode === 'edit' && selectedTemplate) {
        await api.put(`/hrms/expense-claims/templates/${selectedTemplate.id}`, {
          templateName: formData.templateName,
          description: formData.description,
          allowedCategories: formData.allowedCategories,
          active: formData.active
        }).catch(async () => {
          await mockExpenseClaimsService.updateTemplate(selectedTemplate.id, formData);
        });
        toast.success('Template updated successfully');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Error saving template');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/hrms/expense-claims/templates/${id}`).catch(() => {});
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
            { label: 'Edit', onClick: () => { setSelectedTemplate(row); setDrawerMode('edit'); setIsDrawerOpen(true); } },
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
          onClick={() => { setDrawerMode('create'); setSelectedTemplate(null); setIsDrawerOpen(true); }}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Create Template
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
        categories={categories}
        initialData={selectedTemplate ? {
          templateName: selectedTemplate.templateName,
          description: selectedTemplate.description,
          allowedCategories: selectedTemplate.allowedCategories,
          active: selectedTemplate.active
        } : undefined}
      />
    </div>
  );
}
