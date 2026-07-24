import { z } from 'zod';

export const payrollValidationSchema = z.object({
  // Step 1 - Salary Inputs
  salaryInputs: z.object({
    employee: z.string().min(1, "Employee is required"),
    payrollPeriod: z.string().min(1, "Payroll Period is required"),
    payComponent: z.string().min(1, "Pay Component is required"),
    amount: z.string().min(1, "Amount is required"),
    inputType: z.enum(['Addition', 'Override', 'Deduction']),
    reason: z.string().optional(),
    recurring: z.boolean(),
    recurringUntil: z.string().optional(),
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
    financialYear: z.string().min(1, "Financial Year is required"),
    items: z.array(
      z.object({
        reimbursementType: z.string().min(1, "Type is required"),
        annualAmount: z.string().min(1, "Amount is required"),
      })
    ).optional(),
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
    employee: z.string().min(1, "Employee is required"),
    payrollPeriod: z.string().min(1, "Payroll Period is required"),
    holdAmount: z.string().min(1, "Hold Amount is required"),
    reason: z.string().min(1, "Reason is required"),
  }).optional(),

  // Step 9 - Stop Salary Processing
  stopSalary: z.object({
    employee: z.string().min(1, "Employee is required"),
    stopFromDate: z.string().min(1, "Stop From Date is required"),
    stopUntilDate: z.string().optional(),
    reason: z.string().min(1, "Reason is required"),
  }).optional(),

  // Step 11 - Final Settlement
  finalSettlement: z.object({
    employee: z.string().min(1, "Employee is required"),
    settlementDate: z.string().min(1, "Settlement Date is required"),
    lastWorkingDate: z.string().min(1, "Last Working Date is required"),
    items: z.array(
      z.object({
        itemType: z.string().min(1, "Item Type is required"),
        description: z.string().optional(),
        amount: z.string().min(1, "Amount is required"),
      })
    ).optional(),
  }).optional(),

  // Step 12 - Payroll Configuration
  payrollConfiguration: z.object({
    // Pay Component Setup
    componentName: z.string().optional(),
    code: z.string().optional(),
    type: z.string().optional(),
    subType: z.string().optional(),
    calculationType: z.string().optional(),
    percentageOf: z.string().optional(),
    percentageValue: z.string().optional(),
    maxLimit: z.string().optional(),
    taxable: z.boolean().optional(),
    proRata: z.boolean().optional(),
    partOfCTC: z.boolean().optional(),
    partOfGross: z.boolean().optional(),
    displayOrder: z.string().optional(),
    
    // Payslip Templates
    templateName: z.string().optional(),
    layoutHTML: z.string().optional(),
    previewImage: z.any().optional(),
    setAsDefault: z.boolean().optional(),
  }).optional(),

});

export type PayrollFormValues = z.infer<typeof payrollValidationSchema>;
