import { z } from 'zod';

export const challanSchema = z.object({
  challanNumber: z.string().min(1, 'Challan Number is required'),
  projectId: z.string().min(1, 'Project is required'),
  projectName: z.string().optional(),
  vendorId: z.string().min(1, 'Vendor is required'),
  vendorName: z.string().optional(),
  challanDate: z.string().min(1, 'Challan Date is required'),
  description: z.string().min(1, 'Description is required — specify what was delivered'),
  linkedVendorPoId: z.string().optional(),
  linkedVendorPoNumber: z.string().optional(),
  attachmentName: z.string().optional(),
  ewayBillNo: z.string().optional(),
  remarks: z.string().optional(),
});

export type ChallanFormValues = z.infer<typeof challanSchema>;
