export interface PayrollRecord {
  id: string;
  employee: string;
  empId: string;
  dept: string;
  period: string;
  gross: string;
  net: string;
  status: string;
  payout: string;
}

const mockPayrolls: PayrollRecord[] = [
  { id: '1', employee: 'John Doe', empId: 'EMP001', dept: 'Engineering', period: 'July 2026', gross: '₹1,50,000', net: '₹1,15,000', status: 'Processed', payout: 'Paid' },
  { id: '2', employee: 'Jane Smith', empId: 'EMP002', dept: 'Marketing', period: 'July 2026', gross: '₹1,20,000', net: '₹95,000', status: 'Processing', payout: 'Pending' },
  { id: '3', employee: 'Alice Johnson', empId: 'EMP003', dept: 'Sales', period: 'July 2026', gross: '₹1,80,000', net: '₹1,40,000', status: 'Processed', payout: 'Paid' },
  { id: '4', employee: 'Bob Brown', empId: 'EMP004', dept: 'Engineering', period: 'August 2026', gross: '₹1,50,000', net: '₹1,15,000', status: 'Draft', payout: 'Unpaid' },
];

export const mockPayrollService = {
  fetchPayrolls: async (): Promise<PayrollRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockPayrolls]), 400); // Simulate network delay
    });
  },

  fetchEmployees: async (): Promise<{id: string, name: string, empId: string}[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { id: 'EMP001', name: 'John Doe', empId: 'EMP001' },
        { id: 'EMP002', name: 'Jane Smith', empId: 'EMP002' },
        { id: 'EMP003', name: 'Alice Johnson', empId: 'EMP003' },
        { id: 'EMP004', name: 'Bob Brown', empId: 'EMP004' },
      ]), 200);
    });
  },

  fetchDepartments: async (): Promise<{id: string, name: string}[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { id: 'D001', name: 'Engineering' },
        { id: 'D002', name: 'Marketing' },
        { id: 'D003', name: 'Sales' },
        { id: 'D004', name: 'HR' },
      ]), 200);
    });
  }
};
