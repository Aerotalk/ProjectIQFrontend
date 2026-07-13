import React from 'react';
import { FormProvider } from 'react-hook-form';
import { X, Loader2, Save } from 'lucide-react';
import { useVendorForm } from '../../hooks/useVendorForm';
import type { VendorFormValues } from '../../validators/vendorValidation';
import GSTTreatmentSection from './sections/GSTTreatmentSection';
import VendorIdentitySection from './sections/VendorIdentitySection';
import GSTSection from './sections/GSTSection';
import ContactSection from './sections/ContactSection';
import AddressSection from './sections/AddressSection';
import CommercialSection from './sections/CommercialSection';
import BankDetailsSection from './sections/BankDetailsSection';
import TaxationSection from './sections/TaxationSection';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VendorFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<VendorFormValues>;
  vendorId?: string;
  isSubmitting?: boolean;
}

export default function VendorDrawer({ isOpen, onClose, onSave, mode, initialData, vendorId, isSubmitting }: Props) {
  const form = useVendorForm(initialData);

  // Reset form when drawer opens/closes or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        vendorType: 'Business',
        gstTreatment: 'business_gst',
        sameAsBillingAddress: true,
        status: 'Active',
        displayName: '',
        billingCountry: 'India',
        reverseCharge: false,
        ...initialData
      });
    }
  }, [isOpen, initialData, form]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  const onSubmit = async (data: VendorFormValues) => {
    await onSave(data);
  };

  return (
    <div 
      className="fixed inset-y-0 right-0 w-full max-w-2xl lg:max-w-3xl bg-white dark:bg-[#181a1f] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-white/10 flex flex-col"
      style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Add New Vendor' : mode === 'edit' ? 'Edit Vendor Details' : 'View Vendor Details'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {mode === 'create' ? 'System will generate ID on save.' : `Vendor ID: ${vendorId}`}
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
          <form id="vendor-drawer-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <GSTTreatmentSection readOnly={readOnly} />
            
            <VendorIdentitySection readOnly={readOnly} />
            
            <GSTSection readOnly={readOnly} />
            
            <ContactSection readOnly={readOnly} />
            
            <AddressSection readOnly={readOnly} />
            
            <CommercialSection readOnly={readOnly} />
            
            <BankDetailsSection readOnly={readOnly} />

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
            form="vendor-drawer-form"
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
                Save Vendor
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
