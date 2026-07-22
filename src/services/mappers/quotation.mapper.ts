import type { Quotation } from '../../types/quotation.types';

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
  salesperson?: string;

  lineItems: QuotationLineItemDto[];

  subTotal: number;
  totalDiscount: number;
  totalTaxableAmount: number;
  totalGstAmount: number;
  deliveryCost?: number;
  grandTotal: number;

  notes?: string;
  termsAndConditions?: string;

  status: string;

  approvedBy?: string;
  approvalDate?: string;
  woPoDocumentUrl?: string;
  createdAt?: string;
}

export const mapToQuotation = (dto: QuotationDto): Quotation => {
  return {
    ...dto,
    status: (dto.status === 'Converted' ? 'Confirmed Lead' : dto.status) as any,
    salesperson: dto.salesperson,
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
    salesperson: restOfQuotation.salesperson,
    lineItems: quotation.lineItems?.map(item => ({
      ...item
    }))
  };
};
