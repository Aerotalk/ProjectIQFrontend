import type { Quotation, QuotationLineItem } from '../../types/quotation.types';

export interface QuotationLineItemDto {
  id?: string;
  productId: string;
  itemName: string;
  description?: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  gstRate: number;
  taxableAmount: number;
  gstAmount: number;
  totalAmount: number;
}

export interface QuotationDto {
  id: string;
  quotationNo: string;
  clientId: string;
  clientName?: string;
  date: string;
  validUntil: string;
  subject?: string;
  reference?: string;

  lineItems: QuotationLineItemDto[];

  subTotal: number;
  totalDiscount: number;
  totalTaxableAmount: number;
  totalGstAmount: number;
  grandTotal: number;

  notes?: string;
  termsAndConditions?: string;

  status: string;

  approvedBy?: string;
  approvalDate?: string;
  woPoDocumentUrl?: string;
}

export const mapToQuotation = (dto: QuotationDto): Quotation => {
  return {
    ...dto,
    status: dto.status as any,
    lineItems: dto.lineItems.map(item => ({
      ...item
    }))
  };
};

export const mapToQuotationDto = (quotation: Partial<Quotation>): Partial<QuotationDto> => {
  const {
    date,
    validUntil,
    approvalDate,
    ...restOfQuotation
  } = quotation as any;

  // Ensure dates are formatted as LocalDateTime strings for the backend
  const formatDateTime = (val?: string) => {
    if (!val) return undefined;
    // If it's already an ISO string with 'T', leave it or just ensure it
    if (val.includes('T')) return val;
    return `${val}T00:00:00`;
  };

  return {
    ...restOfQuotation,
    date: formatDateTime(date),
    validUntil: formatDateTime(validUntil),
    approvalDate: formatDateTime(approvalDate),
    lineItems: quotation.lineItems?.map(item => ({
      ...item
    }))
  };
};
