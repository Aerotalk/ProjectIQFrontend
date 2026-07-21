import React from 'react';
import { FormProvider } from 'react-hook-form';
import { X, Loader2, Save } from 'lucide-react';
import { usePOForm } from '../../hooks/usePOForm';
import type { POFormValues } from '../../validators/poValidation';
import POHeaderSection from './sections/POHeaderSection';
import POLineItemsSection from './sections/POLineItemsSection';
import POTotalsSection from './sections/POTotalsSection';
import type { PurchaseOrder } from '@/types/po.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: POFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<PurchaseOrder>;
  poNumber?: string;
  isSubmitting?: boolean;
  nextNumber?: number;
}

export default function PODrawer({ isOpen, onClose, onSave, mode, initialData, poNumber, isSubmitting, nextNumber }: Props) {
  const form = usePOForm();

  React.useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        form.reset({
          poNumber: initialData.poNumber || '',
          projectId: initialData.projectId || '',
          projectName: initialData.projectName || '',
          vendorId: initialData.vendorId || '',
          vendorName: initialData.vendorName || '',
          poDate: initialData.poDate || new Date().toISOString().split('T')[0],
          description: initialData.description || '',
          expectedDelivery: initialData.expectedDelivery || '',
          attachmentName: initialData.attachmentName || '',
          lineItems: (initialData.lineItems || []).map(li => ({
            id: li.id,
            productId: li.productId,
            itemName: li.itemName,
            description: li.description,
            quantity: li.quantity,
            unit: li.unit,
            rate: li.rate || 0,
            discount: li.discount || 0,
            taxableAmount: li.taxableAmount || 0,
            gstRate: li.gstRate || 0,
            gstAmount: li.gstAmount || 0,
            totalAmount: li.totalAmount || 0,
          })),
          subTotal: initialData.subTotal || 0,
          totalDiscount: initialData.totalDiscount || 0,
          totalTaxableAmount: initialData.totalTaxableAmount || 0,
          totalGstAmount: initialData.totalGstAmount || 0,
          deliveryCost: initialData.deliveryCost || 0,
          grandTotal: initialData.grandTotal || 0,
          status: (initialData.status as POFormValues['status']) || 'Draft',
          internalNotes: initialData.internalNotes || '',
        });
      } else {
        form.reset({
          poNumber: '',
          poDate: new Date().toISOString().split('T')[0],
          status: 'Draft',
          lineItems: [],
          subTotal: 0,
          totalDiscount: 0,
          totalTaxableAmount: 0,
          totalGstAmount: 0,
          deliveryCost: 0,
          grandTotal: 0,
          projectId: '',
          vendorId: '',
          description: '',
          expectedDelivery: '',
          attachmentName: '',
          internalNotes: '',
        });
      }
    }
  }, [isOpen, initialData, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  const onSubmit = async (data: POFormValues) => {
    await onSave(data);
  };

  const drawerTitle = mode === 'create'
    ? 'Create Purchase Order'
    : mode === 'edit'
      ? 'Edit Purchase Order'
      : 'View Purchase Order';

  const drawerSubtitle = mode === 'create'
    ? 'PO Number will be auto-generated on save.'
    : `PO Number: ${poNumber || initialData?.poNumber || '—'}`;

  if (!isOpen) return null;

  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Drawer Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02] shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {drawerTitle}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {drawerSubtitle}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <FormProvider {...form}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <form id="po-drawer-form" onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
            <POHeaderSection readOnly={readOnly} nextNumber={nextNumber} />
            <POLineItemsSection readOnly={readOnly} />
            <POTotalsSection readOnly={readOnly} />
          </form>
        </FormProvider>
      </div>

      {/* Drawer Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3 shrink-0">
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
            form="po-drawer-form"
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
                {mode === 'create' ? 'Save Purchase Order' : 'Update Purchase Order'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
