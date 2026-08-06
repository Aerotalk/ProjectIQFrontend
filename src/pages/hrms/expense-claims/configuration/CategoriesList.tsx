import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import CategoryDrawer from './components/CategoryDrawer';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus } from 'lucide-react';
import type { ExpenseCategoryConfig } from '../../../../types/expense-claims.types';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';

export default function CategoriesList() {
  const [categories, setCategories] = useState<ExpenseCategoryConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiCategories = await api.get('/hrms/expense-claims/categories');
      let data: ExpenseCategoryConfig[] = [];
      if (Array.isArray(apiCategories)) {
        data = apiCategories.map((c: any) => ({
          id: c.id,
          category: c.category,
          glCode: c.glCode || '',
          receiptRequired: c.receiptRequired ?? false,
          minReceiptAmount: c.minReceiptAmount || 0,
          active: c.active ?? true
        }));
      }
      setCategories(data);
    } catch (e) {
      toast.error('Failed to load categories');
      setCategories([]);
    }
    setLoading(false);
  };

  const handleSave = async (formData: any) => {
    try {
      if (drawerMode === 'create') {
        await api.post('/hrms/expense-claims/categories', {
          category: formData.name,
          glCode: formData.glCode,
          receiptRequired: formData.receiptRequired,
          minReceiptAmount: formData.minReceiptAmount,
          active: formData.active
        });
        toast.success('Category created successfully');
      } else if (drawerMode === 'edit' && selectedCategory) {
        await api.put(`/hrms/expense-claims/categories/${selectedCategory.id}`, {
          category: formData.name,
          glCode: formData.glCode,
          receiptRequired: formData.receiptRequired,
          minReceiptAmount: formData.minReceiptAmount,
          active: formData.active
        });
        toast.success('Category updated successfully');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Error saving category');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/hrms/expense-claims/categories/${id}`);
      toast.success('Category deleted');
      fetchData();
    } catch (e) {
      toast.error('Error deleting category');
    }
  };

  const columns = [
    { key: 'category', label: 'Category' },
    { key: 'glCode', label: 'GL Code' },
    { key: 'receiptRequired', label: 'Receipt Required', render: (val: boolean) => val ? 'Yes' : 'No' },
    { key: 'minReceiptAmount', label: 'Min Receipt Amount', render: (val: number) => `$${(val || 0).toFixed(2)}` },
    { key: 'active', label: 'Status', render: (val: boolean) => val ? 'Active' : 'Inactive' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: ExpenseCategoryConfig) => (
        <TableRowActionMenu
          actions={[
            { label: 'Edit', onClick: () => { setSelectedCategory(row); setDrawerMode('edit'); setIsDrawerOpen(true); } },
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Categories</h3>
        <button 
          onClick={() => { setDrawerMode('create'); setSelectedCategory(null); setIsDrawerOpen(true); }}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Category
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={categories} />
      </div>

      <CategoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
        mode={drawerMode}
        initialData={selectedCategory ? {
          name: selectedCategory.category,
          glCode: selectedCategory.glCode,
          receiptRequired: selectedCategory.receiptRequired,
          minReceiptAmount: selectedCategory.minReceiptAmount,
          active: selectedCategory.active
        } : undefined}
      />
    </div>
  );
}
