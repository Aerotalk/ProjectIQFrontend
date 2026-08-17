import { z } from 'zod';

export const payrollValidationSchema = z.object({
  // Step 1 - Salary Inputs
  salaryInputs: z.object({
    employee: z.string().optional(),
    payrollPeriod: z.string().optional(),
    payComponent: z.string().optional(),
    amount: z.string().optional(),
    inputType: z.enum(['Addition', 'Override', 'Deduction']).optional(),
    reason: z.string().optional(),
    recurring: z.boolean().optional(),
    recurringUntil: z.string().optional(),
  }).superRefine((data, ctx) => {
    const hasData = !!data.payrollPeriod || !!data.payComponent || !!data.amount;
    if (hasData) {
      if (!data.employee) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["employee"] });
      if (!data.payrollPeriod) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["payrollPeriod"] });
      if (!data.payComponent) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["payComponent"] });
      if (!data.amount) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["amount"] });
      if (!data.inputType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["inputType"] });
    }
  }).optional(),

  // Step 1.5 - Pay Component Setup
  payComponentSetup: z.object({
    components: z.array(
      z.object({
        componentName: z.string().min(1, "Required"),
        code: z.string().min(1, "Required"),
        type: z.string().min(1, "Required"),
        subType: z.string().optional(),
        calculationType: z.string().min(1, "Required"),
        percentageOf: z.string().optional(),
        percentageValue: z.string().optional(),
        maxLimit: z.string().optional(),
        displayOrder: z.string().optional(),
        taxable: z.boolean().optional(),
        proRata: z.boolean().optional(),
        partOfCTC: z.boolean().optional(),
        partOfGross: z.boolean().optional(),
      })
    ).optional(),
  }).optional(),

  // Step 2 - Employee LOP
  employeeLOP: z.object({
    employee: z.string().min(1, "Employee is required"),
    payrollPeriod: z.string().min(1, "Payroll Period is required"),
    lopDays: z.string().min(1, "LOP Days is required"),
    source: z.enum(['Attendance', 'Manual', 'Leave System']),
    reason: z.string().optional(),
  }).optional(),

  // Step 3 - IT Declaration
  itDeclarations: z.object({
    financialYear: z.string().min(1, "Financial Year is required"),
    taxRegime: z.enum(['Old Regime', 'New Regime']),
    items: z.array(
      z.object({
        taxSection: z.string().min(1, "Tax Section is required"),
        description: z.string().min(1, "Description is required"),
        declaredAmount: z.string().min(1, "Declared Amount is required"),
        proofUpload: z.any().optional(),
      })
    ).optional(),
  }).optional(),

  // Step 4 - Reimbursement Claim
  reimbursement: z.object({
    reimbursementType: z.string().min(1, "Reimbursement Type is required"),
    claimPeriod: z.string().min(1, "Claim Period is required"),
    claimedAmount: z.string().min(1, "Claimed Amount is required"),
    billDate: z.string().min(1, "Bill Date is required"),
    billNumber: z.string().min(1, "Bill Number is required"),
    billUpload: z.any().optional(),
    remarks: z.string().optional(),
  }).optional(),

  // Step 5 - FBP Declaration
  fbpDeclarations: z.object({
    financialYear: z.string().optional(),
    items: z.array(
      z.object({
        reimbursementType: z.string().min(1, "Type is required"),
        annualAmount: z.string().min(1, "Amount is required"),
      })
    ).optional(),
  }).superRefine((data, ctx) => {
    const hasItems = data.items && data.items.length > 0;
    if (data.financialYear || hasItems) {
      if (!data.financialYear) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["financialYear"] });
    }
  }).optional(),

  // Step 6 - Payroll Processing
  payrollProcessing: z.object({
    payrollPeriod: z.string().min(1, "Payroll Period is required"),
    employeeScope: z.enum(['All Employees', 'Department', 'Selected Employees']),
    departmentId: z.string().optional(),
    employeeIds: z.array(z.string()).optional(),
    runType: z.enum(['Regular', 'Supplementary', 'Arrears']),
  }).optional(),

  // Step 8 - Salary Hold
  salaryHold: z.object({
    employee: z.string().optional(),
    payrollPeriod: z.string().optional(),
    holdAmount: z.string().optional(),
    reason: z.string().optional(),
  }).superRefine((data, ctx) => {
    const hasData = !!data.payrollPeriod || !!data.holdAmount || !!data.reason;
    if (hasData) {
      if (!data.employee) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["employee"] });
      if (!data.payrollPeriod) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["payrollPeriod"] });
      if (!data.holdAmount) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["holdAmount"] });
      if (!data.reason) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["reason"] });
    }
  }).optional(),

  // Step 9 - Stop Salary Processing
  stopSalary: z.object({
    employee: z.string().optional(),
    stopFromDate: z.string().optional(),
    stopUntilDate: z.string().optional(),
    reason: z.string().optional(),
  }).superRefine((data, ctx) => {
    const hasData = !!data.stopFromDate || !!data.stopUntilDate || !!data.reason;
    if (hasData) {
      if (!data.employee) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["employee"] });
      if (!data.stopFromDate) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["stopFromDate"] });
      if (!data.reason) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["reason"] });
    }
  }).optional(),

  // Step 11 - Final Settlement
  finalSettlement: z.object({
    employee: z.string().optional(),
    settlementDate: z.string().optional(),
    lastWorkingDate: z.string().optional(),
    items: z.array(
      z.object({
        itemType: z.string().min(1, "Item Type is required"),
        description: z.string().optional(),
        amount: z.string().min(1, "Amount is required"),
      })
    ).optional(),
  }).superRefine((data, ctx) => {
    const hasData = !!data.settlementDate || !!data.lastWorkingDate || (data.items && data.items.length > 0);
    if (hasData) {
      if (!data.employee) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["employee"] });
      if (!data.settlementDate) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["settlementDate"] });
      if (!data.lastWorkingDate) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required", path: ["lastWorkingDate"] });
    }
  }).optional(),

  // Step 12 - Payroll Configuration
  payrollConfiguration: z.object({
    // Payslip Templates
    templateName: z.string().optional(),
    layoutHTML: z.string().optional(),
    previewImage: z.any().optional(),
    setAsDefault: z.boolean().optional(),
  }).optional(),

});

export type PayrollFormValues = z.infer<typeof payrollValidationSchema>;
