import type { Client } from '../../types/client.types';

// The backend DTO interfaces
export interface ClientDto {
  id: string;
  clientNo?: string;
  customerType: string;
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
  additionalContacts?: ClientAdditionalContactDto[];
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
  industry?: string;
  notes?: string;
  status: string;
}

export interface ClientAdditionalContactDto {
  id?: string;
  name: string;
  designation?: string;
  email: string;
  phone: string;
  role: string;
}

export const mapToClient = (dto: ClientDto): Client => {
  return {
    id: dto.id,
    clientNo: dto.clientNo,
    customerType: dto.customerType as any,
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
    industry: dto.industry,
    notes: dto.notes,
    status: dto.status as 'Active' | 'Inactive',
  };
};

export const mapToClientDto = (client: Partial<Client>): Partial<ClientDto> => {
  // Strip out frontend-only fields that the backend doesn't support to prevent 400 Bad Request
  const {
    billingAttention: _billingAttention,
    billingPhone: _billingPhone,
    shippingAttention: _shippingAttention,
    shippingPhone: _shippingPhone,
    ...restOfClient
  } = client as any;

  const dto: Partial<ClientDto> = {
    ...restOfClient,
    additionalContacts: client.additionalContacts?.map((c) => ({
      ...c,
      role: c.role,
    })),
  };
  return dto;
};
