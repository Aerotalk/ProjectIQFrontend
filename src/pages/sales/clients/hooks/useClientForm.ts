import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getClientSchema, type ClientFormValues } from '../validators/clientValidation';
import { 
  shouldShowGSTIN, 
  shouldShowPAN, 
  shouldShowPlaceOfSupply, 
  shouldShowSEZFields,
  shouldShowOverseasFields,
  shouldShowRegisteredGstAddress
} from '../utils/gstRules';

export const useClientForm = (defaultValues?: Partial<ClientFormValues>) => {
  const form = useForm<ClientFormValues>({
    resolver: async (data, context, options) => {
      const dynamicSchema = getClientSchema();
      return zodResolver(dynamicSchema)(data, context, options);
    },
    defaultValues: {
      customerType: 'Business',
      gstTreatment: 'business_gst',
      sameAsBillingAddress: false,
      status: 'Active',
      displayName: '',
      billingCountry: 'IN',
      shippingCountry: 'IN',
      ...defaultValues
    },
    mode: 'onChange'
  });

  const { watch, setValue, clearErrors } = form;
  const gstTreatment = watch('gstTreatment');
  const customerType = watch('customerType');

  // Handle GST Treatment changes
  useEffect(() => {
    if (!gstTreatment) return;

    // Clear hidden fields when treatment changes to prevent stale data
    if (!shouldShowGSTIN(gstTreatment)) setValue('gstin', '');
    if (!shouldShowPAN(gstTreatment)) setValue('panNumber', '');
    if (!shouldShowPlaceOfSupply(gstTreatment)) setValue('placeOfSupply', '');
    if (!shouldShowRegisteredGstAddress(gstTreatment)) setValue('registeredGstAddress', '');
    if (!shouldShowSEZFields(gstTreatment)) {
      setValue('sezUnitName', '');
      setValue('lutBondNo', '');
    }
    if (!shouldShowOverseasFields(gstTreatment)) {
      setValue('country', '');
      setValue('currency', '');
      setValue('foreignTaxId', '');
      setValue('billingCountry', 'IN');
    } else {
      setValue('billingState', '');
      setValue('billingPinCode', '');
    }

    clearErrors();
  }, [gstTreatment, setValue, clearErrors]);

  const companyName = watch('companyName');
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const displayName = watch('displayName');
  const lastGeneratedDisplayName = useRef<string>('');

  // Handle Customer Type changes
  useEffect(() => {
    if (customerType === 'Individual') {
      setValue('companyName', '');
    } else {
      setValue('firstName', '');
      setValue('lastName', '');
    }
    clearErrors();
  }, [customerType, setValue, clearErrors]);

  // Handle Display Name auto-fill
  useEffect(() => {
    let newGenerated = '';
    if (customerType === 'Business' && companyName) {
      newGenerated = companyName;
    } else if (customerType === 'Individual') {
      newGenerated = [firstName, lastName].filter(Boolean).join(' ');
    }
    
    if (newGenerated) {
      // Update if empty OR if the current value matches the last generated value (meaning user hasn't manually overridden it)
      if (!displayName || displayName === lastGeneratedDisplayName.current) {
        setValue('displayName', newGenerated, { shouldValidate: true });
        lastGeneratedDisplayName.current = newGenerated;
      }
    }
  }, [companyName, firstName, lastName, customerType, displayName, setValue]);

  return form;
};
