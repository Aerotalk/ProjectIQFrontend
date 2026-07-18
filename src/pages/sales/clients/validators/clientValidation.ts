import { z } from 'zod';
import { 
  isRequiredGSTIN, 
  isRequiredPAN, 
  isRequiredPlaceOfSupply, 
  isRequiredOverseasFields,
  shouldShowSEZFields
} from '../utils/gstRules';

export const contactSchema = z.object({
  id: z.string().nullable().optional(),
  name: z.string().min(1, 'Name is required'),
  designation: z.string().nullable().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  role: z.enum(['Billing', 'Purchase', 'Technical', 'Other']),
});

export const getClientSchema = () => {
  return z.object({
    id: z.string().nullable().optional(),
    customerType: z.enum(['Business', 'Individual']),
    companyName: z.string().nullable().optional(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    displayName: z.string().min(1, 'Display Name is required').max(100, 'Max 100 characters'),
    gstTreatment: z.enum(['business_gst', 'business_none', 'consumer', 'sez', 'overseas']),

    // GST & Tax
    gstin: z.string().nullable().optional(),
    panNumber: z.string().nullable().optional(),
    placeOfSupply: z.string().nullable().optional(),
    registeredGstAddress: z.string().nullable().optional(),
    sezUnitName: z.string().nullable().optional(),
    lutBondNo: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    currency: z.string().nullable().optional(),
    foreignTaxId: z.string().nullable().optional(),

    // Contact
    primaryContactPerson: z.string().min(1, 'Primary Contact Person is required'),
    designation: z.string().max(80, 'Max 80 characters').nullable().optional(),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone is required'),
    alternatePhone: z.string().nullable().optional(),
    additionalContacts: z.array(contactSchema).nullable().optional(),

    // Address
    billingAttention: z.string().nullable().optional(),
    billingAddressLine1: z.string().min(1, 'Billing Address Line 1 is required'),
    billingAddressLine2: z.string().nullable().optional(),
    billingCity: z.string().min(1, 'City is required'),
    billingState: z.string().nullable().optional(),
    billingPinCode: z.string().nullable().optional(),
    billingCountry: z.string().nullable().optional(),
    billingPhone: z.string().nullable().optional(),

    sameAsBillingAddress: z.preprocess((val) => {
      if (val === 'true') return true;
      if (val === 'false' || val === null || val === undefined) return false;
      return val;
    }, z.boolean()),
    shippingAttention: z.string().nullable().optional(),
    shippingAddressLine1: z.string().nullable().optional(),
    shippingAddressLine2: z.string().nullable().optional(),
    shippingCity: z.string().nullable().optional(),
    shippingState: z.string().nullable().optional(),
    shippingPinCode: z.string().nullable().optional(),
    shippingCountry: z.string().nullable().optional(),
    shippingPhone: z.string().nullable().optional(),

    // Commercial
    paymentTerms: z.string().nullable().optional(),
    creditLimit: z.preprocess((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return Number.isNaN(num) ? undefined : num;
    }, z.number().nullable().optional().nullable()),
    industry: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    status: z.enum(['Active', 'Inactive'])
  }).superRefine((data, ctx) => {
    const t = data.gstTreatment as any;
    
    // Customer Type check
    if (data.customerType === 'Business' && !data.companyName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyName'], message: 'Company Name is required for Business' });
    }
    if (data.customerType === 'Individual' && !data.firstName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['firstName'], message: 'First Name is required for Individual' });
    }

    // GST Rules
    if (isRequiredGSTIN(t) && !data.gstin) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['gstin'], message: 'GSTIN is required' });
    }
    if (data.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(data.gstin)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['gstin'], message: 'Invalid GSTIN format' });
    }

    if (isRequiredPAN(t) && !data.panNumber) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['panNumber'], message: 'PAN Number is required' });
    }
    if (data.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.panNumber)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['panNumber'], message: 'Invalid PAN format' });
    }

    if (isRequiredPlaceOfSupply(t) && !data.placeOfSupply) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['placeOfSupply'], message: 'Place of Supply is required' });
    }

    if (shouldShowSEZFields(t) && !data.sezUnitName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sezUnitName'], message: 'SEZ Unit Name is required' });
    }

    if (isRequiredOverseasFields(t)) {
      if (!data.country) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['country'], message: 'Country is required' });
      if (!data.currency) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['currency'], message: 'Currency is required' });
    }

    // Address Rules
    if (t !== 'overseas') {
      if (!data.billingState) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['billingState'], message: 'State is required' });
      if (!data.billingPinCode) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['billingPinCode'], message: 'PIN Code is required' });
      if (data.billingPinCode && !/^[0-9]{6}$/.test(data.billingPinCode)) {
         ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['billingPinCode'], message: 'Invalid PIN Code (6 digits)' });
      }
    }
  });
};

export type ClientFormValues = z.infer<ReturnType<typeof getClientSchema>>;
