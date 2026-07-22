import React from 'react';
import { FormProvider } from 'react-hook-form';
import { X, Loader2, Save } from 'lucide-react';
import { useChallanForm } from '../../hooks/useChallanForm';
import type { ChallanFormValues } from '../../validators/challanValidation';
import ChallanFormSection from './sections/ChallanFormSection';
import type { DeliveryChallan } from '@/types/challan.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ChallanFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<DeliveryChallan>;
  challanNumber?: string;
  isSubmitting?: boolean;
  nextNumber?: number;
}

import { toast } from 'sonner';

export default function ChallanDrawer({ isOpen, onClose, onSave, mode, initialData, challanNumber, isSubmitting, nextNumber }: Props) {
  const form = useChallanForm();

  React.useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        form.reset({
          challanNumber: initialData.challanNumber || '',
          projectId: initialData.projectId || '',
          projectName: initialData.projectName || '',
          vendorId: initialData.vendorId || '',
          vendorName: initialData.vendorName || '',
          challanDate: initialData.challanDate || new Date().toISOString().split('T')[0],
          description: initialData.description || '',
          linkedVendorPoId: initialData.linkedVendorPoId || '',
          linkedVendorPoNumber: initialData.linkedVendorPoNumber || '',
          attachmentName: initialData.attachmentName || '',
          remarks: initialData.remarks || '',
          transportMode: initialData.transportMode || '',
          billingAddress: initialData.billingAddress || '',
          shippingAddress: initialData.shippingAddress || '',
          lineItems: initialData.lineItems?.map(item => ({
            id: item.id,
            itemName: item.itemName || '',
            hsnSac: item.hsnSac || '',
            description: item.description || '',
            dispatchedQuantity: item.dispatchedQuantity ?? item.quantity ?? 1,
            unit: item.unit || 'Unit',
          })) || [],
        });
      } else {
        form.reset({
          challanNumber: '',
          projectId: '',
          vendorId: '',
          challanDate: new Date().toISOString().split('T')[0],
          description: '',
          linkedVendorPoId: '',
          attachmentName: '',
          remarks: '',
          transportMode: '',
          billingAddress: '',
          shippingAddress: '',
          lineItems: [],
        });
      }
    }
  }, [isOpen, initialData, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  const onSubmit = async (data: ChallanFormValues) => {
    await onSave(data);
  };

  const handleValidationError = (errors: any) => {
    console.error('Challan Form Validation Errors:', errors);
    const firstError = Object.values(errors)[0] as any;
    toast.error(firstError?.message || 'Please fill in all required fields correctly.');
  };

  const drawerTitle = mode === 'create'
    ? 'Add Delivery Challan'
    : mode === 'edit'
      ? 'Edit Delivery Challan'
      : 'View Delivery Challan';

  const drawerSubtitle = mode === 'create'
    ? 'Record an inbound delivery from a vendor.'
    : `Challan Number: ${challanNumber || initialData?.challanNumber || '—'}`;

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
      <FormProvider {...form}>
        <form id="challan-drawer-form" onSubmit={form.handleSubmit(onSubmit, handleValidationError)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <ChallanFormSection readOnly={readOnly} nextNumber={nextNumber} />
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
                    {mode === 'create' ? 'Save Challan' : 'Update Challan'}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
