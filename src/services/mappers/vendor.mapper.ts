import type { Vendor } from '../../types/vendor.types';

export interface VendorAdditionalContactDto {
  id?: string;
  name: string;
  designation?: string;
  email: string;
  phone: string;
  role: string;
}

export interface VendorBankDetailsDto {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string;
  swiftCode?: string;
}

export interface VendorDto {
  id: string;
  vendorNo?: string;
  vendorType: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  gstTreatment: string;
  gstin?: string;
  panNumber?: string;
  placeOfSupply?: string;
  sezUnitName?: string;
  lutBondNo?: string;
  country?: string;
  currency?: string;
  foreignTaxId?: string;
  primaryContactPerson: string;
  designation?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  additionalContacts?: VendorAdditionalContactDto[];
  billingAddressLine1: string;
  billingAddressLine2?: string;
  billingCity: string;
  billingState?: string;
  billingPinCode?: string;
  billingCountry?: string;
  sameAsBillingAddress: boolean;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPinCode?: string;
  shippingCountry?: string;
  paymentTerms?: string;
  creditLimit?: number;
  notes?: string;
  status: string;
  bankDetails?: VendorBankDetailsDto;
  tdsPercentage?: number;
  reverseCharge?: boolean;
}

export const mapToVendor = (dto: VendorDto): Vendor => {
  return {
    id: dto.id,
    vendorType: dto.vendorType as any,
    companyName: dto.companyName,
    firstName: dto.firstName,
    lastName: dto.lastName,
    displayName: dto.displayName,
    gstTreatment: dto.gstTreatment as any,
    gstin: dto.gstin,
    panNumber: dto.panNumber,
    placeOfSupply: dto.placeOfSupply,
    sezUnitName: dto.sezUnitName,
    lutBondNo: dto.lutBondNo,
    country: dto.country,
    currency: dto.currency,
    foreignTaxId: dto.foreignTaxId,
    primaryContactPerson: dto.primaryContactPerson,
    designation: dto.designation,
    email: dto.email,
    phone: dto.phone,
    alternatePhone: dto.alternatePhone,
    additionalContacts: dto.additionalContacts?.map((c) => ({
      id: c.id,
      name: c.name,
      designation: c.designation,
      email: c.email,
      phone: c.phone,
      role: c.role as any,
    })),
    billingAddressLine1: dto.billingAddressLine1,
    billingAddressLine2: dto.billingAddressLine2,
    billingCity: dto.billingCity,
    billingState: dto.billingState,
    billingPinCode: dto.billingPinCode,
    billingCountry: dto.billingCountry,
    sameAsBillingAddress: dto.sameAsBillingAddress,
    shippingAddressLine1: dto.shippingAddressLine1,
    shippingAddressLine2: dto.shippingAddressLine2,
    shippingCity: dto.shippingCity,
    shippingState: dto.shippingState,
    shippingPinCode: dto.shippingPinCode,
    shippingCountry: dto.shippingCountry,
    paymentTerms: dto.paymentTerms,
    creditLimit: dto.creditLimit,
    notes: dto.notes,
    status: dto.status as 'Active' | 'Inactive',
    bankDetails: dto.bankDetails ? {
      accountName: dto.bankDetails.accountName,
      accountNumber: dto.bankDetails.accountNumber,
      ifscCode: dto.bankDetails.ifscCode,
      bankName: dto.bankDetails.bankName,
      branchName: dto.bankDetails.branchName,
      swiftCode: dto.bankDetails.swiftCode,
    } : undefined,
    tdsPercentage: dto.tdsPercentage,
    reverseCharge: dto.reverseCharge,
  };
};

export const mapToVendorDto = (vendor: Partial<Vendor>): Partial<VendorDto> => {
  const {
    billingAttention,
    billingPhone,
    shippingAttention,
    shippingPhone,
    ...restOfVendor
  } = vendor as any;

  const dto: Partial<VendorDto> = {
    ...restOfVendor,
    additionalContacts: vendor.additionalContacts?.map((c) => ({
      ...c,
      role: c.role,
    })),
    bankDetails: vendor.bankDetails ? {
      ...vendor.bankDetails,
    } : undefined,
  };
  
  return dto;
};
