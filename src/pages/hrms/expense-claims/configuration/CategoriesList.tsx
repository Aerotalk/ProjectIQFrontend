import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import CategoryDrawer from './components/CategoryDrawer';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus } from 'lucide-react';
import { mockExpenseClaimsService } from '../../../../services/mockExpenseClaimsService';
import type { ExpenseCategoryConfig } from '../../../../types/expense-claims.types';
import toast from 'react-hot-toast';

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
      const data = await mockExpenseClaimsService.getCategories();
      setCategories(data);
    } catch (e) {
      toast.error('Failed to load categories');
    }
    setLoading(false);
  };

  const handleSave = async (data: any) => {
    try {
      if (drawerMode === 'create') {
        await mockExpenseClaimsService.createCategory({
          category: data.name,
          glCode: data.glCode,
          receiptRequired: data.receiptRequired,
          minReceiptAmount: data.minReceiptAmount,
          active: data.active
        });
        toast.success('Category created');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Error creating category');
    }
  };

  const columns = [
    { key: 'category', label: 'Category' },
    { key: 'glCode', label: 'GL Code' },
    { key: 'receiptRequired', label: 'Receipt Required', render: (val: boolean) => val ? 'Yes' : 'No' },
    { key: 'minReceiptAmount', label: 'Min Receipt Amount', render: (val: number) => val ? val.toString() : '0' },
    { key: 'active', label: 'Active', render: (val: boolean) => val ? 'Yes' : 'No' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: ExpenseCategoryConfig) => (
        <TableRowActionMenu
          actions={[
            { label: 'View / Edit', onClick: () => { setSelectedCategory(row); setDrawerMode('view'); setIsDrawerOpen(true); } },
            { label: 'Delete', onClick: () => mockExpenseClaimsService.deleteCategory(row.id).then(fetchData), danger: true }
          ]}
        />
      )
    }
  ];

  if (loading) return <div className="p-4"><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Categories</h3>
        <button 
          onClick={() => { setDrawerMode('create'); setSelectedCategory(null); setIsDrawerOpen(true); }}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943]"
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
