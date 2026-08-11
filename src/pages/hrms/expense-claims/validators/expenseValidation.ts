import { z } from 'zod';

export const advanceSchema = z.object({
  employee: z.string().min(1, 'Employee is required'),
  date: z.string().min(1, 'Date is required'),
  tripOrProject: z.string().min(1, 'Trip or Project is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  currency: z.string().min(1, 'Currency is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  requiredDate: z.string().min(1, 'Required Date is required'),
});

export type AdvanceFormValues = z.infer<typeof advanceSchema>;

export const claimSchema = z.object({
  employee: z.string().min(1, 'Employee is required'),
  template: z.string().min(1, 'Template is required'),
  title: z.string().min(1, 'Title or Purpose is required'),
  currency: z.string().min(1, 'Currency is required'),
});

export type ClaimFormValues = z.infer<typeof claimSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  glCode: z.string().min(1, 'GL Code is required'),
  receiptRequired: z.boolean(),
  minReceiptAmount: z.coerce.number().min(0, 'Minimum amount must be positive'),
  active: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const batchSchema = z.object({
  payrollPeriod: z.string().min(1, 'Payroll Period is required'),
  paymentMethod: z.string().min(1, 'Payment Method is required'),
});

export type BatchFormValues = z.infer<typeof batchSchema>;

export const templateSchema = z.object({
  templateName: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  allowedCategories: z.array(z.string()).min(1, 'At least one category is required'),
  active: z.boolean(),
});

export type TemplateFormValues = z.infer<typeof templateSchema>;
