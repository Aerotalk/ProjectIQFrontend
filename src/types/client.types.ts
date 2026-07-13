export type GSTTreatment =
  | 'business_gst'
  | 'business_none'
  | 'consumer'
  | 'sez'
  | 'overseas';

export type CustomerType = 'Business' | 'Individual';

export interface AdditionalContact {
  id?: string;
  name: string;
  designation?: string;
  email: string;
  phone: string;
  role: 'Billing' | 'Purchase' | 'Technical' | 'Other';
}

export interface Client {
  id: string; // generated, e.g., CUST-0001
  customerType: CustomerType;
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
  currency?: string;
  foreignTaxId?: string;

  // Contact Details
  primaryContactPerson: string;
  designation?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  additionalContacts?: AdditionalContact[];

  // Address Details
  billingAddressLine1: string;
  billingAddressLine2?: string;
  billingCity: string;
  billingState?: string;
  billingPinCode?: string;
  billingCountry?: string; // prefilled 'India' or selected

  sameAsBillingAddress: boolean;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPinCode?: string;
  shippingCountry?: string;

  // Commercial Settings
  paymentTerms?: string;
  creditLimit?: number;
  industry?: string;
  notes?: string;
  status: 'Active' | 'Inactive';
}
