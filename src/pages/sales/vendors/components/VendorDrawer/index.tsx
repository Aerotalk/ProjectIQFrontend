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
        sameAsBillingAddress: false,
        status: 'Active',
        displayName: '',
        billingAttention: '',
        billingAddressLine1: '',
        billingAddressLine2: '',
        billingCity: '',
        billingState: '',
        billingPinCode: '',
        billingPhone: '',
        billingCountry: 'IN',
        shippingAttention: '',
        shippingAddressLine1: '',
        shippingAddressLine2: '',
        shippingCity: '',
        shippingState: '',
        shippingPinCode: '',
        shippingPhone: '',
        shippingCountry: 'IN',
        reverseCharge: false,
        ...initialData
      });
    }
  }, [isOpen, initialData, form]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  const onSubmit = async (data: VendorFormValues) => {
    try {
      await onSave(data);
    } catch (err: any) {
      if (err?.message && typeof err.message === 'object') {
        // Backend validation errors format mapping
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

  const onError = (errors: any) => {
    console.error("Form validation errors:", errors);
    const firstKey = Object.keys(errors)[0];
    const firstError = errors[firstKey] as any;
    let msg = firstError?.message;
    if (!msg && firstError) {
       // if it's a nested object like bankDetails
       const subKey = Object.keys(firstError)[0];
       msg = firstError[subKey]?.message || 'Invalid input';
    }
    import('react-hot-toast').then(({ default: toast }) => {
      toast.error(`${firstKey}: ${msg || 'Please fix the validation errors.'}`);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">
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
          <form id="vendor-drawer-form" onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6 pb-48">
            
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
                {mode === 'edit' ? 'Update Vendor' : 'Save Vendor'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
