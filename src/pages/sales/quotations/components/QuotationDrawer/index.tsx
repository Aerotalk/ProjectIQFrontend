import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { X, Loader2, Save } from 'lucide-react';
import { useQuotationForm } from '../../hooks/useQuotationForm';
import { numberToWords } from '@/lib/utils';
import type { QuotationFormValues } from '../../validators/quotationValidation';
import HeaderSection from './sections/HeaderSection';
import LineItemsSection from './sections/LineItemsSection';
import TotalsSection from './sections/TotalsSection';
import WorkflowSection from './sections/WorkflowSection';
import QuotationPreviewPanel from '../QuotationPreviewPanel';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ClientService } from '@/services/client.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: QuotationFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<QuotationFormValues>;
  quotationNo?: string;
  isSubmitting?: boolean;
  nextNumber?: number;
}

export default function QuotationDrawer({ isOpen, onClose, onSave, mode, initialData, quotationNo, isSubmitting, nextNumber }: Props) {
  const form = useQuotationForm(initialData);
  const { selectedCompanyId: companyId, user } = useAuth();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Reset form when drawer opens or selected quotation changes
  const initialId = initialData?.id;
  React.useEffect(() => {
    if (isOpen) {
      if (initialData && (initialData.id || initialData.clientId || initialData.lineItems?.length)) {
        form.reset({
          date: initialData.date || new Date().toISOString().split('T')[0],
          validUntil: initialData.validUntil || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: initialData.status || 'Draft',
          clientId: initialData.clientId || '',
          clientName: initialData.clientName || '',
          templateName: initialData.templateName || 'quotation.html',
          subject: initialData.subject || '',
          reference: initialData.reference || '',
          salesperson: initialData.salesperson || '',
          billingAddress: initialData.billingAddress || '',
          shippingAddress: initialData.shippingAddress || '',
          lineItems: initialData.lineItems?.map(item => ({
            ...item,
            discount: item.discount || 0,
            discountType: item.discountType || 'FLAT'
          })) || [],
          subTotal: initialData.subTotal || 0,
          totalDiscount: initialData.totalDiscount || 0,
          totalTaxableAmount: initialData.totalTaxableAmount || 0,
          totalGstAmount: initialData.totalGstAmount || 0,
          deliveryCost: initialData.deliveryCost || 0,
          grandTotal: initialData.grandTotal || 0,
          notes: initialData.notes || '',
          termsAndConditions: initialData.termsAndConditions || ''
        });
      } else {
        form.reset({
          date: new Date().toISOString().split('T')[0],
          validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'Draft',
          templateName: 'quotation.html',
          clientId: '',
          clientName: '',
          subject: '',
          reference: '',
          salesperson: user?.username || '',
          billingAddress: '',
          shippingAddress: '',
          lineItems: [],
          subTotal: 0,
          totalDiscount: 0,
          totalTaxableAmount: 0,
          totalGstAmount: 0,
          deliveryCost: 0,
          grandTotal: 0,
          notes: '',
          termsAndConditions: ''
        });
      }
    }
  }, [isOpen, initialId]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  const onSubmit = async (data: QuotationFormValues) => {
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

  const handlePreview = async () => {
    try {
      setIsLoadingPreview(true);
      const data = form.getValues();
      const templateName = (data as any).templateName;
      if (!templateName) {
        import('react-hot-toast').then(({ default: toast }) => toast.error('Please select a template first.'));
        setIsLoadingPreview(false);
        return;
      }

      const templateRes = await api.get(`/admin/templates/${templateName}`);
      let company = null;
      if (companyId) {
        const companyRes = await api.get(`/admin/companies/${companyId}`);
        company = companyRes;
      }

      let client = null;
      if (data.clientId && companyId) {
        const clients = await ClientService.getClients(companyId);
        client = clients.find(c => c.id === data.clientId);
      }

      let logoBase64 = '';
      const logoId = company?.invoiceLogoId || company?.logoFileId;
      if (logoId) {
        try {
          const blob = await api.get(`/admin/files/${logoId}`, { responseType: 'blob' });
          if (blob) {
            logoBase64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          }
        } catch (e) {
          console.error('Failed to pre-fetch logo', e);
        }
      }

      const lineItems = data.lineItems || [];
      const companyState = company?.addresses?.[0]?.state?.trim().toLowerCase() || '';
      const clientState = client?.billingState?.trim().toLowerCase() || '';
      const isSameState = companyState && clientState && companyState === clientState;
      const isIgst = data.taxType === 'IGST' || (data.taxType !== 'CGST_SGST' && !isSameState);

      const taxGroups: Record<number, { taxable: number, taxAmount: number }> = {};
      lineItems.forEach((item: any) => {
        const gstRate = item.gstRate || 0;
        const taxable = item.taxableAmount ?? (item.rate * (item.quantity || 1));
        const gstAmount = item.gstAmount ?? (taxable * gstRate / 100);
        if (gstRate > 0) {
          if (!taxGroups[gstRate]) taxGroups[gstRate] = { taxable: 0, taxAmount: 0 };
          taxGroups[gstRate].taxable += taxable;
          taxGroups[gstRate].taxAmount += gstAmount;
        }
      });

      const taxBreakdown: any[] = [];
      Object.keys(taxGroups).forEach(rateStr => {
        const rate = Number(rateStr);
        const group = taxGroups[rate];
        if (isIgst) {
          taxBreakdown.push({
            tax_type: 'IGST',
            taxable_amount: group.taxable.toFixed(2),
            tax_rate: rate,
            tax_amount: group.taxAmount.toFixed(2)
          });
        } else {
          const halfRate = rate / 2;
          const halfAmount = (group.taxAmount / 2).toFixed(2);
          taxBreakdown.push({
            tax_type: 'CGST',
            taxable_amount: group.taxable.toFixed(2),
            tax_rate: halfRate,
            tax_amount: halfAmount
          });
          taxBreakdown.push({
            tax_type: 'SGST',
            taxable_amount: group.taxable.toFixed(2),
            tax_rate: halfRate,
            tax_amount: halfAmount
          });
        }
      });

      let signatureBase64 = '';
      const stampId = company?.stampFileId;
      if (stampId) {
        try {
          const blob = await api.get(`/admin/files/${stampId}`, { responseType: 'blob' });
          if (blob) {
            signatureBase64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          }
        } catch (e) {
          console.error('Failed to pre-fetch signature', e);
        }
      }

      const previewPayload = {
        primary_color_hex: '#792359',
        company_name: company?.name || company?.companyName || 'Company Name',
        company_logo_url: logoBase64 || '',
        company_address_line1: company?.addresses?.[0]?.addressLine1 || '',
        company_address_line2: company?.addresses?.[0]?.addressLine2 || '',
        company_phone: company?.phone || '',
        company_email: company?.email || '',
        company_gstin: company?.gstNumber || '',
        company_pan: company?.panNumber || '',
        client_name: client?.displayName || data.clientName || 'Client Name',
        client_address_line1: client?.billingAddressLine1 || '',
        client_address_line2: client?.billingCity || '',
        client_phone: client?.phone || '',
        client_state: client?.billingState || '',
        client_email: client?.email || '',
        estimate_number: data.quotationNo || data.id,
        estimate_date: data.date ? new Date(data.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
        place_of_supply: client?.billingState || '',
        items: lineItems.map((item: any, idx: number) => {
          const lineTaxable = item.taxableAmount ?? (item.rate * (item.quantity || 1));
          return {
            item_index: idx + 1,
            item_name: item.itemName,
            item_description: item.description || '',
            item_hsn: item.hsnSac || '',
            item_quantity: item.quantity,
            item_unit: item.unit || 'Unit',
            item_price: item.rate.toFixed(2),
            item_amount: lineTaxable.toFixed(2)
          };
        }),
        sub_total: data.subTotal.toFixed(2),
        discount: (Number(data.totalDiscount) || 0).toFixed(2),
        has_discount: Number(data.totalDiscount) > 0,
        taxable_amount: data.totalTaxableAmount.toFixed(2),
        total_tax: data.totalGstAmount.toFixed(2),
        delivery_cost: (Number(data.deliveryCost) || 0).toFixed(2),
        has_delivery_cost: Number(data.deliveryCost) > 0,
        grand_total: data.grandTotal.toFixed(2),
        amount_in_words: numberToWords(data.grandTotal),
        terms_and_conditions: data.termsAndConditions || company?.termsAndConditions || 'Terms and conditions apply',
        company_signature_url: signatureBase64,
        bank_name: company?.bankAccounts?.[0]?.bankName || '',
        bank_account_no: company?.bankAccounts?.[0]?.accountNumber || '',
        bank_ifsc: company?.bankAccounts?.[0]?.ifscCode || '',
        bank_account_holder: company?.bankAccounts?.[0]?.accountHolderName || company?.bankAccounts?.[0]?.accountName || '',
        has_taxes: data.totalGstAmount > 0,
        taxes: taxBreakdown
      };

      setPreviewTemplate(templateRes);
      setPreviewData(previewPayload);
      setIsPreviewOpen(true);
    } catch (err: any) {
      import('react-hot-toast').then(({ default: toast }) => toast.error('Failed to generate preview.'));
    } finally {
      setIsLoadingPreview(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Create Quotation' : mode === 'edit' ? 'Edit Quotation' : 'View Quotation'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {mode === 'create' ? 'System will generate Quotation No on save.' : `Quotation No: ${initialData?.quotationNo || quotationNo}`}
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
          <form id="quotation-drawer-form" onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">

            <HeaderSection readOnly={readOnly} nextNumber={nextNumber} />

            <LineItemsSection readOnly={readOnly} />

            <TotalsSection readOnly={readOnly} />

            {mode !== 'create' && <WorkflowSection readOnly={readOnly} />}

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

        <button
          type="button"
          onClick={handlePreview}
          disabled={isLoadingPreview}
          className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 disabled:opacity-70 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-sm shadow-sm transition-colors flex items-center gap-2"
        >
          {isLoadingPreview ? (
            <><Loader2 size={16} className="animate-spin" /> Loading...</>
          ) : (
            'Preview'
          )}
        </button>

        {!readOnly && (
          <button
            type="submit"
            form="quotation-drawer-form"
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
                Save Quotation
              </>
            )}
          </button>
        )}
      </div>

      <QuotationPreviewPanel
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        templateContent={previewTemplate}
        data={previewData}
        filename={`Quotation_${form.getValues('quotationNo')}.pdf`}
      />
    </div>
  );
}
