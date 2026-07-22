import { z } from 'zod';

export const challanLineItemSchema = z.object({
  id: z.string().optional(),
  itemName: z.string().optional(),
  hsnSac: z.string().optional(),
  description: z.string().optional(),
  dispatchedQuantity: z.preprocess((val: any) => (val === '' || (typeof val === 'number' && Number.isNaN(val)) ? undefined : Number(val)), z.number().min(0, 'Quantity must be non-negative').optional()) as unknown as z.ZodOptional<z.ZodNumber>,
  quantity: z.preprocess((val: any) => (val === '' || (typeof val === 'number' && Number.isNaN(val)) ? undefined : Number(val)), z.number().min(0, 'Quantity must be non-negative').optional()) as unknown as z.ZodOptional<z.ZodNumber>,
  unit: z.string().optional(),
});

export const challanSchema = z.object({
  challanNumber: z.string().min(1, 'Challan Number is required'),
  projectId: z.string().min(1, 'Project is required'),
  projectName: z.string().nullable().optional(),
  vendorId: z.string().min(1, 'Vendor is required'),
  vendorName: z.string().nullable().optional(),
  challanDate: z.string().min(1, 'Challan Date is required'),
  description: z.string().min(1, 'Description is required — specify what was delivered'),
  linkedVendorPoId: z.string().nullable().optional(),
  linkedVendorPoNumber: z.string().nullable().optional(),
  attachmentName: z.string().nullable().optional(),
  ewayBillNo: z.string().nullable().optional(),
  remarks: z.string().nullable().optional(),
  transportMode: z.string().nullable().optional(),
  billingAddress: z.string().nullable().optional(),
  shippingAddress: z.string().nullable().optional(),
  lineItems: z.array(challanLineItemSchema).optional(),
});

export type ChallanFormValues = z.infer<typeof challanSchema>;
