import { z } from 'zod';

export const expenseSchema = z.object({
  expenseNo: z.string().optional(),
  projectId: z.string().min(1, 'Project is required'),
  projectName: z.string().optional(),
  expenseDate: z.string().min(1, 'Expense Date is required').refine(dateStr => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(dateStr);
    return selected <= today;
  }, { message: 'Expense Date cannot be in the future' }),
  category: z.enum([
    'Travel', 'Accommodation', 'Petty Cash', 'Material',
    'Labour (non-vendor)', 'Communication', 'Miscellaneous'
  ]),
  description: z.string().min(3, 'Description must be meaningful and specific'),
  amount: z.number({ message: 'Amount must be a number' }).min(1, 'Amount must be at least ₹1'),
  paidBy: z.string().min(1, 'Paid By is required (Company / Employee name)'),
  receiptName: z.string().optional(),
  isGstApplicable: z.boolean(),
  gstAmount: z.number().optional(),
  isInputCreditClaimable: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.isGstApplicable) {
    if (data.gstAmount === undefined || data.gstAmount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'GST Amount is required and must be greater than 0',
        path: ['gstAmount'],
      });
    }
  }
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
