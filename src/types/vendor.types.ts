import type { GSTTreatment } from './client.types';

export type VendorType = 'Business' | 'Individual';

export interface VendorAdditionalContact {
  id?: string;
  name: string;
  designation?: string;
  email: string;
  phone: string;
  role: 'Accounts' | 'Sales' | 'Technical' | 'Other';
}

export interface VendorBankDetails {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string;
  swiftCode?: string;
}

export interface Vendor {
  id: string; // generated, e.g., VEND-0001
  vendorNo?: string;
  vendorType: VendorType;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  gstTreatment: GSTTreatment;

  // GST & Tax fields
  gstin?: string;
  panNumber?: string;
  placeOfSupply?: string;
  sezUnitName?: string;
  lutBondNo?: string;
  country?: string;
  currency?: string; // Base currency
  foreignTaxId?: string;

  // Contact Details
  primaryContactPerson: string;
  designation?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  additionalContacts?: VendorAdditionalContact[];

  // Address Details
  billingAttention?: string;
  billingAddressLine1: string;
  billingAddressLine2?: string;
  billingCity: string;
  billingState?: string;
  billingPinCode?: string;
  billingCountry?: string; // prefilled 'India' or selected
  billingPhone?: string;

  sameAsBillingAddress: boolean;
  shippingAttention?: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPinCode?: string;
  shippingCountry?: string;
  shippingPhone?: string;

  // Commercial Settings
  paymentTerms?: string;
  creditLimit?: number;
  notes?: string;

  // Bank Details
  bankDetails?: VendorBankDetails;

  // Taxation
  tdsPercentage?: number;
  reverseCharge?: boolean;

  status: 'Active' | 'Inactive';
}
