import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getVendorSchema, type VendorFormValues } from '../validators/vendorValidation';
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
      const dynamicSchema = getVendorSchema();
      return zodResolver(dynamicSchema)(data, context, options);
    },
    defaultValues: {
      vendorType: 'Business',
      gstTreatment: 'business_gst',
      sameAsBillingAddress: true,
      status: 'Active',
      displayName: '',
      billingCountry: 'India',
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
      setValue('billingCountry', 'India');
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

  return form;
};
