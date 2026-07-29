import { z } from 'zod';

export const expenseSchema = z.object({
  expenseNo: z.string().nullable().optional(),
  projectId: z.string().min(1, 'Project is required'),
  projectName: z.string().nullable().optional(),
  expenseDate: z.string().min(1, 'Expense Date is required').refine(dateStr => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Parse as local time — new Date("yyyy-MM-dd") treats the string as UTC midnight,
    // which is ahead of local midnight in timezones like IST (UTC+5:30) and causes
    // today's date to fail the "future date" check.
    const [year, month, day] = dateStr.split('-').map(Number);
    const selected = new Date(year, month - 1, day);
    return selected <= today;
  }, { message: 'Expense Date cannot be in the future' }),
  category: z.enum([
    'Travel', 'Accommodation', 'Petty Cash', 'Material',
    'Labour (non-vendor)', 'Communication', 'Miscellaneous'
  ]),
  description: z.string().min(3, 'Description must be meaningful and specific'),
  amount: z.number({ message: 'Amount must be a number' }).min(1, 'Amount must be at least ₹1'),
  paidBy: z.string().min(1, 'Paid By is required (Company / Employee name)'),
  receiptName: z.string().nullable().optional(),
  isGstApplicable: z.boolean(),
  gstAmount: z.number().nullable().optional(),
  isInputCreditClaimable: z.boolean().nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.isGstApplicable) {
    if (data.gstAmount === undefined || data.gstAmount === null || data.gstAmount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'GST Amount is required and must be greater than 0',
        path: ['gstAmount'],
      });
    }
  }
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
