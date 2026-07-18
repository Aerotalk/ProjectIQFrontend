import { z } from 'zod';

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
});

export type ChallanFormValues = z.infer<typeof challanSchema>;
