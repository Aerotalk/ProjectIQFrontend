import { z } from 'zod';
import { 
  isRequiredGSTIN, 
  isRequiredPAN, 
  isRequiredPlaceOfSupply, 
  isRequiredOverseasFields,
  shouldShowSEZFields
} from '../../clients/utils/gstRules';

export const vendorContactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  designation: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  role: z.enum(['Accounts', 'Sales', 'Technical', 'Other']),
});

export const vendorBankDetailsSchema = z.object({
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  bankName: z.string().optional(),
  branchName: z.string().optional(),
  swiftCode: z.string().optional(),
});

export const getVendorSchema = () => {
  return z.object({
    id: z.string().optional(),
    vendorType: z.enum(['Business', 'Individual']),
    companyName: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    displayName: z.string().min(1, 'Display Name is required').max(100, 'Max 100 characters'),
    gstTreatment: z.enum(['business_gst', 'business_none', 'consumer', 'sez', 'overseas']),

    // GST & Tax
    gstin: z.string().optional(),
    panNumber: z.string().optional(),
    placeOfSupply: z.string().optional(),
    sezUnitName: z.string().optional(),
    lutBondNo: z.string().optional(),
    country: z.string().optional(),
    currency: z.string().optional(),
    foreignTaxId: z.string().optional(),

    // Contact
    primaryContactPerson: z.string().min(1, 'Primary Contact Person is required'),
    designation: z.string().max(80, 'Max 80 characters').optional(),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone is required'),
    alternatePhone: z.string().optional(),
    additionalContacts: z.array(vendorContactSchema).optional(),

    // Address
    billingAttention: z.string().optional(),
    billingAddressLine1: z.string().min(1, 'Billing Address Line 1 is required'),
    billingAddressLine2: z.string().optional(),
    billingCity: z.string().min(1, 'City is required'),
    billingState: z.string().optional(),
    billingPinCode: z.string().optional(),
    billingCountry: z.string().optional(),
    billingPhone: z.string().optional(),

    sameAsBillingAddress: z.boolean(),
    shippingAttention: z.string().optional(),
    shippingAddressLine1: z.string().optional(),
    shippingAddressLine2: z.string().optional(),
    shippingCity: z.string().optional(),
    shippingState: z.string().optional(),
    shippingPinCode: z.string().optional(),
    shippingCountry: z.string().optional(),
    shippingPhone: z.string().optional(),

    // Commercial
    paymentTerms: z.string().optional(),
    creditLimit: z.preprocess((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return Number.isNaN(num) ? undefined : num;
    }, z.number().optional().nullable()),
    notes: z.string().optional(),

    // Bank Details
    bankDetails: z.preprocess((val: any) => {
      if (!val || typeof val !== 'object') return undefined;
      const isEmpty = Object.values(val).every(v => !v || v === '');
      return isEmpty ? undefined : val;
    }, vendorBankDetailsSchema.optional()),

    // Taxation
    tdsPercentage: z.preprocess((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return Number.isNaN(num) ? undefined : num;
    }, z.number().optional().nullable()),
    reverseCharge: z.boolean().optional(),

    status: z.enum(['Active', 'Inactive'])
  }).superRefine((data, ctx) => {
    const t = data.gstTreatment as any;
    
    // Vendor Type check
    if (data.vendorType === 'Business' && !data.companyName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyName'], message: 'Company Name is required for Business' });
    }
    if (data.vendorType === 'Individual' && !data.firstName) {
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

export type VendorFormValues = z.infer<ReturnType<typeof getVendorSchema>>;
