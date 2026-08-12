import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { payrollValidationSchema, type PayrollFormValues } from '../validators/payrollValidation';

export function usePayrollForm(initialData?: Partial<PayrollFormValues>) {
  return useForm<PayrollFormValues>({
    resolver: zodResolver(payrollValidationSchema),
    defaultValues: {
      salaryInputs: {
        employee: '',
        payrollPeriod: '',
        payComponent: '',
        amount: '',
        inputType: 'Addition',
        recurring: false,
      },
      payComponentSetup: {
        components: [],
      },
      employeeLOP: {
        employee: '',
        payrollPeriod: '',
        lopDays: '',
        source: 'Attendance',
      },
      itDeclarations: {
        financialYear: '',
        taxRegime: 'Old Regime',
        items: [],
      },
      reimbursement: {
        reimbursementType: '',
        claimPeriod: '',
        claimedAmount: '',
        billDate: '',
        billNumber: '',
      },
      fbpDeclarations: {
        financialYear: '',
        items: [],
      },
      payrollProcessing: {
        payrollPeriod: '',
        employeeScope: 'All Employees',
        runType: 'Regular',
        employeeIds: [],
      },
      salaryHold: {
        employee: '',
        payrollPeriod: '',
        holdAmount: '',
        reason: '',
      },
      stopSalary: {
        employee: '',
        stopFromDate: '',
        reason: '',
      },
      finalSettlement: {
        employee: '',
        settlementDate: '',
        lastWorkingDate: '',
        items: [],
      },
      payrollConfiguration: {
        setAsDefault: false,
      },
      ...initialData,
    },
    mode: 'onChange',
  });
}
