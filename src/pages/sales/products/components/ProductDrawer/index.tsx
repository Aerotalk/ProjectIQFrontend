import React from 'react';
import { FormProvider } from 'react-hook-form';
import { X, Loader2, Save } from 'lucide-react';
import { useProductForm } from '../../hooks/useProductForm';
import type { ProductFormValues } from '../../validators/productValidation';
import ProductIdentitySection from './sections/ProductIdentitySection';
import PricingSection from './sections/PricingSection';
import TaxationSection from './sections/TaxationSection';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<ProductFormValues>;
  productId?: string;
  isSubmitting?: boolean;
  nextNumber?: number;
}

export default function ProductDrawer({ isOpen, onClose, onSave, mode, initialData, productId, isSubmitting, nextNumber }: Props) {
  const form = useProductForm(initialData);

  // Reset form when drawer opens/closes or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        type: 'Product',
        status: 'Active',
        standardRate: 0,
        unit: 'Pieces',
        gstRate: '18%',
        ...initialData
      });
    }
  }, [isOpen, initialData, form]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await onSave(data);
    } catch (err: any) {
      if (err?.message && typeof err.message === 'object') {
        Object.keys(err.message).forEach((key) => {
          form.setError(key as any, { type: 'server', message: err.message[key] });
        });
      } else if (err?.message && typeof err.message === 'string') {
        import('react-hot-toast').then(({ default: toast }) => {
          toast.error(err.message);
        });
      } else {
        import('react-hot-toast').then(({ default: toast }) => {
          toast.error('An unexpected error occurred while saving.');
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Add New Product/Service' : mode === 'edit' ? 'Edit Product Details' : 'View Product Details'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {mode === 'create' ? 'System will generate ID on save.' : `Item Code: ${initialData?.itemCode || productId}`}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <FormProvider {...form}>
          <form id="product-drawer-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <ProductIdentitySection readOnly={readOnly} nextNumber={nextNumber} />
            
            <PricingSection readOnly={readOnly} />
            
            <TaxationSection readOnly={readOnly} />

          </form>
        </FormProvider>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-sm transition-colors"
        >
          {mode === 'view' ? 'Close' : 'Cancel'}
        </button>
        
        {!readOnly && (
          <button
            type="submit"
            form="product-drawer-form"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#792359] hover:bg-[#52173c] disabled:opacity-70 text-white text-sm font-medium rounded-sm shadow-sm transition-colors flex items-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save {form.watch('type') === 'Service' ? 'Service' : 'Product'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
