import React from 'react';
import { FormProvider } from 'react-hook-form';
import { X, Loader2, Save } from 'lucide-react';
import { useClientForm } from '../../hooks/useClientForm';
import type { ClientFormValues } from '../../validators/clientValidation';
import GSTTreatmentSection from './sections/GSTTreatmentSection';
import BasicIdentitySection from './sections/BasicIdentitySection';
import GSTSection from './sections/GSTSection';
import ContactSection from './sections/ContactSection';
import AdditionalContacts from './sections/AdditionalContacts';
import AddressSection from './sections/AddressSection';
import CommercialSection from './sections/CommercialSection';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClientFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<ClientFormValues>;
  clientId?: string;
  isSubmitting?: boolean;
}

const defaultEmptyClient: Partial<ClientFormValues> = {
  customerType: 'Business',
  gstTreatment: 'business_gst',
  sameAsBillingAddress: false,
  status: 'Active',
  displayName: '',
  companyName: '',
  firstName: '',
  lastName: '',
  gstin: '',
  panNumber: '',
  placeOfSupply: '',
  sezUnitName: '',
  lutBondNo: '',
  country: '',
  currency: '',
  foreignTaxId: '',
  primaryContactPerson: '',
  designation: '',
  email: '',
  phone: '',
  alternatePhone: '',
  billingAttention: '',
  billingAddressLine1: '',
  billingAddressLine2: '',
  billingCity: '',
  billingState: '',
  billingPinCode: '',
  billingCountry: 'India',
  billingPhone: '',
  shippingAttention: '',
  shippingAddressLine1: '',
  shippingAddressLine2: '',
  shippingCity: '',
  shippingState: '',
  shippingPinCode: '',
  shippingCountry: '',
  shippingPhone: '',
  paymentTerms: '',
  creditLimit: null,
  industry: '',
  notes: ''
};

export default function ClientDrawer({ isOpen, onClose, onSave, mode, initialData, clientId, isSubmitting }: Props) {
  const form = useClientForm(initialData);

  // Reset form when drawer opens/closes or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        ...defaultEmptyClient,
        ...(initialData || {})
      });
    }
  }, [isOpen, initialData, form]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  const onSubmit = async (data: ClientFormValues) => {
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

  return (
    <>
      {/* Drawer Overlay (Hidden/Transparent as requested by user constraints to not use backdrop blur or dark modal overlay? Wait, user said "no floating modals, no dialogs, no backdrop blur". We will just use a transparent block to catch clicks or we can just let it sit on top.)
      Actually, standard right side drawer usually has a very light overlay or none. I will use none, just sliding in from right. */}
      
      <div 
        className="fixed inset-y-0 right-0 w-full max-w-2xl lg:max-w-3xl bg-white dark:bg-[#181a1f] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-white/10 flex flex-col"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Add New Client' : mode === 'edit' ? 'Edit Client Details' : 'View Client Details'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {mode === 'create' ? 'System will generate ID on save.' : `Client ID: ${clientId}`}
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
            <form id="client-drawer-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-48">
              
              <GSTTreatmentSection readOnly={readOnly} />
              
              <BasicIdentitySection readOnly={readOnly} />
              
              <GSTSection readOnly={readOnly} />
              
              <ContactSection readOnly={readOnly} />
              
              <AdditionalContacts readOnly={readOnly} />
              
              <AddressSection readOnly={readOnly} />
              
              <CommercialSection readOnly={readOnly} />

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
              form="client-drawer-form"
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
                  Save Client
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
