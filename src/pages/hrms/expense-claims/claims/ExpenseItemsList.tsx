import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Loader2, Receipt, Upload, Paperclip, X } from 'lucide-react';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formStyles } from '../../../../components/ui/form-styles';
import CustomSelect from '../../../../components/ui/CustomSelect';

const itemSchema = z.object({
  expenseDate: z.string().min(1, 'Date is required'),
  categoryId: z.string().min(1, 'Category is required'),
  merchantName: z.string().min(1, 'Merchant name is required'),
  claimAmount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  billNumber: z.string().optional(),
  receiptUrl: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export default function ExpenseItemsList({ 
  claimId, 
  currency, 
  localItems = [], 
  setLocalItems 
}: { 
  claimId: string, 
  currency: string, 
  localItems?: any[], 
  setLocalItems?: React.Dispatch<React.SetStateAction<any[]>> 
}) {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ id: string, category: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema) as any,
    defaultValues: {
      expenseDate: new Date().toISOString().split('T')[0],
      categoryId: '',
      merchantName: '',
      claimAmount: 0,
      description: '',
      billNumber: '',
      receiptUrl: '',
    }
  });

  useEffect(() => {
    if (claimId && claimId !== 'new') {
      fetchItems();
    } else if (claimId === 'new') {
      setItems(localItems);
      setIsLoading(false);
    }
    fetchCategories();
  }, [claimId, localItems]);

  const fetchItems = async () => {
    try {
      const res = await api.get(`/hrms/expense-claims/claims/${claimId}/items`);
      setItems(res || []);
    } catch (err) {
      console.error('Failed to load items');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/hrms/expense-claims/categories');
      setCategories(res || []);
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('module', 'expense_claims');

    try {
      const res = await api.post('/admin/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Assuming the backend File entity returns its ID or a storagePath
      const fileId = res.id;
      // You can store the ID or build a URL based on how your backend serves files
      const url = `${import.meta.env.VITE_API_URL || ''}/api/admin/files/${fileId}`;
      form.setValue('receiptUrl', url);
      toast.success('Receipt uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload receipt');
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    if (claimId === 'new') {
      const newItems = items.filter(i => i.id !== itemId);
      setItems(newItems);
      if (setLocalItems) setLocalItems(newItems);
      toast.success('Item deleted');
      return;
    }

    try {
      await api.delete(`/hrms/expense-claims/claims/${claimId}/items/${itemId}`);
      toast.success('Item deleted');
      fetchItems();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  const onSubmit = async (data: ItemFormValues) => {
    setIsSubmitting(true);
    try {
      if (claimId === 'new') {
        const newItem = { ...data, id: Date.now().toString(), currency };
        const newItems = [...items, newItem];
        setItems(newItems);
        if (setLocalItems) setLocalItems(newItems);
        toast.success('Item added successfully');
        setIsAdding(false);
        form.reset();
        return;
      }

      await api.post(`/hrms/expense-claims/claims/${claimId}/items`, {
        ...data,
        currency
      });
      toast.success('Item added successfully');
      setIsAdding(false);
      form.reset();
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && claimId !== 'new') {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col bg-white dark:bg-[#181a1f] rounded-b-xl">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Receipt size={18} className="text-primary" />
          Line Items
        </h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Line Item
          </button>
        )}
      </div>

      {isAdding && (
        <div className="p-6 bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={formStyles.label}>Date *</label>
                <input type="date" {...form.register('expenseDate')} className={formStyles.field(!!form.formState.errors.expenseDate, false)} />
                {form.formState.errors.expenseDate && <p className="text-red-500 text-xs mt-1">{form.formState.errors.expenseDate.message}</p>}
              </div>
              
              <div>
                <label className={formStyles.label}>Category *</label>
                <CustomSelect
                  options={categories.map(c => ({ label: c.category, value: c.id }))}
                  value={form.watch('categoryId')}
                  onChange={(val) => form.setValue('categoryId', val)}
                />
                {form.formState.errors.categoryId && <p className="text-red-500 text-xs mt-1">{form.formState.errors.categoryId.message}</p>}
              </div>
              
              <div>
                <label className={formStyles.label}>Merchant *</label>
                <input type="text" {...form.register('merchantName')} className={formStyles.field(!!form.formState.errors.merchantName, false)} />
                {form.formState.errors.merchantName && <p className="text-red-500 text-xs mt-1">{form.formState.errors.merchantName.message}</p>}
              </div>
              
              <div>
                <label className={formStyles.label}>Amount ({currency}) *</label>
                <input type="number" step="0.01" {...form.register('claimAmount', { valueAsNumber: true })} className={formStyles.field(!!form.formState.errors.claimAmount, false)} />
                {form.formState.errors.claimAmount && <p className="text-red-500 text-xs mt-1">{form.formState.errors.claimAmount.message}</p>}
              </div>
              
              <div>
                <label className={formStyles.label}>Bill Number</label>
                <input type="text" {...form.register('billNumber')} className={formStyles.field(!!form.formState.errors.billNumber, false)} />
              </div>
              
              <div>
                <label className={formStyles.label}>Receipt Attachment</label>
                <div className="mt-1">
                  {form.watch('receiptUrl') ? (
                    <div className="flex items-center justify-between p-2 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-center text-sm text-green-700">
                        <Paperclip size={16} className="mr-2" />
                        Receipt attached
                      </div>
                      <button 
                        type="button"
                        onClick={() => form.setValue('receiptUrl', '')}
                        className="p-1 text-green-700 hover:bg-green-100 rounded-full"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileUpload} 
                        className="hidden" 
                        accept="image/*,.pdf"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                      >
                        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        {isUploading ? 'Uploading...' : 'Upload Receipt'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className={formStyles.label}>Description *</label>
                <input type="text" {...form.register('description')} className={formStyles.field(!!form.formState.errors.description, false)} />
                {form.formState.errors.description && <p className="text-red-500 text-xs mt-1">{form.formState.errors.description.message}</p>}
              </div>
            </div>
            <div className="flex justify-end pt-2 gap-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-[#5d1944] text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Save Line Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No line items added yet. Click "Add Item" to add an expense.
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 dark:border-white/10 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Merchant</th>
                  <th className="px-4 py-3 font-medium text-center">Receipt</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {items.map((item) => (
                  <tr key={item.id} className="text-sm hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">{item.expenseDate}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {categories.find(c => c.id === item.category?.id || c.id === item.categoryId)?.category || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.merchantName}</td>
                    <td className="px-4 py-3 text-center">
                      {item.receiptUrl ? (
                        <a href={item.receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-md transition-colors" title="View Receipt">
                          <Paperclip size={16} />
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate" title={item.description}>{item.description}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white text-right font-medium">
                      {item.claimAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {item.currency}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-white/5 font-semibold text-gray-900 dark:text-white">
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-right text-sm">Total:</td>
                  <td className="px-4 py-3 text-right">
                    {items.reduce((sum, item) => sum + (item.claimAmount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
