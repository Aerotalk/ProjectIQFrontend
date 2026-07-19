import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type VendorFormValues } from '../validators/vendorValidation';
import {
  shouldShowGSTIN,
  shouldShowPAN,
  shouldShowPlaceOfSupply,
  shouldShowSEZFields,
  shouldShowOverseasFields
} from '../../clients/utils/gstRules';

export const useVendorForm = (defaultValues?: Partial<VendorFormValues>) => {
  const form = useForm<VendorFormValues>({
    resolver: async (data, context, options) => {
      const { getVendorSchema } = await import('../validators/vendorValidation');
      const dynamicSchema = getVendorSchema();
      const resolver = zodResolver(dynamicSchema) as any;
      return resolver(data, context, options);
    },
    defaultValues: {
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
      ...defaultValues
    },
    mode: 'onChange'
  });

  const { watch, setValue, clearErrors } = form;
  const gstTreatment = watch('gstTreatment');
  const vendorType = watch('vendorType');

  // Handle GST Treatment changes
  useEffect(() => {
    if (!gstTreatment) return;

    // Clear hidden fields when treatment changes to prevent stale data
    if (!shouldShowGSTIN(gstTreatment)) setValue('gstin', undefined);
    if (!shouldShowPAN(gstTreatment)) setValue('panNumber', undefined);
    if (!shouldShowPlaceOfSupply(gstTreatment)) setValue('placeOfSupply', undefined);
    if (!shouldShowSEZFields(gstTreatment)) {
      setValue('sezUnitName', undefined);
      setValue('lutBondNo', undefined);
    }
    if (!shouldShowOverseasFields(gstTreatment)) {
      setValue('country', undefined);
      setValue('currency', undefined);
      setValue('foreignTaxId', undefined);
      setValue('billingCountry', 'IN');
    } else {
      setValue('billingState', undefined);
      setValue('billingPinCode', undefined);
    }

    clearErrors();
  }, [gstTreatment, setValue, clearErrors]);

  // Handle Vendor Type changes
  useEffect(() => {
    if (vendorType === 'Individual') {
      setValue('companyName', undefined);
    } else {
      setValue('firstName', undefined);
      setValue('lastName', undefined);
    }
    clearErrors();
  }, [vendorType, setValue, clearErrors]);

  const companyName = watch('companyName');
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const displayName = watch('displayName');
  const lastGeneratedDisplayName = useRef<string>('');

  // Handle Display Name auto-fill
  useEffect(() => {
    let newGenerated = '';
    if (vendorType === 'Business' && companyName) {
      newGenerated = companyName;
    } else if (vendorType === 'Individual') {
      newGenerated = [firstName, lastName].filter(Boolean).join(' ');
    }
    
    if (newGenerated) {
      if (!displayName || displayName === lastGeneratedDisplayName.current) {
        setValue('displayName', newGenerated, { shouldValidate: true });
        lastGeneratedDisplayName.current = newGenerated;
      }
    }
  }, [companyName, firstName, lastName, vendorType, displayName, setValue]);

  return form;
};
