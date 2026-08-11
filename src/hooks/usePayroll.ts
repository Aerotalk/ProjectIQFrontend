import { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/api';

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

export interface PayrollFilters {
  searchTerm: string;
  department: string;
  period: string;
  status: string;
  payout: string;
}

export function usePayroll() {
  const [payrollRuns, setPayrollRuns] = useState<any[]>([]);
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [employees, setEmployees] = useState<{id: string, name: string, empId: string}[]>([]);
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState<PayrollFilters>({
    searchTerm: '',
    department: '',
    period: '',
    status: '',
    payout: '',
  });

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [apiRuns, rawEmployeesData, rawDeptsData] = await Promise.all([
        api.get('/hrms/payroll/runs').catch(() => []),
        api.get('/admin/employees').catch(() => []),
        api.get('/admin/departments').catch(() => [])
      ]);
      
      const employeesData = (rawEmployeesData || []).map((e: any) => ({
        id: e.id,
        name: `${e.firstName} ${e.lastName}`,
        empId: e.employeeCode
      }));

      const deptsData = (rawDeptsData || []).map((d: any) => ({
        id: d.id,
        name: d.departmentName
      }));

      let mappedPayrolls: PayrollRecord[] = [];
      if (Array.isArray(apiRuns) && apiRuns.length > 0) {
        // Fetch details for each run
        const detailPromises = apiRuns.map((r: any) => 
          api.get(`/hrms/payroll/runs/${r.id}/details`).then((details: any) => ({ run: r, details }))
             .catch(() => ({ run: r, details: [] }))
        );
        const runsWithDetails = await Promise.all(detailPromises);
        
        runsWithDetails.forEach(({ run, details }) => {
          if (Array.isArray(details) && details.length > 0) {
            details.forEach((d: any) => {
              mappedPayrolls.push({
                id: d.id,
                employee: d.employee ? `${d.employee.firstName} ${d.employee.lastName}` : 'Unknown',
                empId: d.employee?.employeeCode || 'Unknown',
                dept: d.employee?.department?.departmentName || run.department?.departmentName || 'Unknown',
                period: run.payrollPeriod,
                gross: `₹${(d.gross || 0).toLocaleString('en-IN')}`,
                net: `₹${(d.net || 0).toLocaleString('en-IN')}`,
                status: run.status || 'Draft',
                payout: run.payoutStatus || 'Unpaid'
              });
            });
          }
        });
      }

      setPayrollRuns(apiRuns);
      setPayrolls(mappedPayrolls);
      setEmployees(employeesData);
      setDepartments(deptsData);
    } catch (error) {
      console.error('Failed to fetch payroll data', error);
      setPayrolls([]);
      setPayrollRuns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter(p => {
      const matchSearch = filters.searchTerm === '' || p.empId === filters.searchTerm || p.employee.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchDept = filters.department === '' || p.dept === filters.department;
      const matchPeriod = filters.period === '' || p.period === filters.period;
      const matchStatus = filters.status === '' || p.status === filters.status;
      const matchPayout = filters.payout === '' || p.payout === filters.payout;
      return matchSearch && matchDept && matchPeriod && matchStatus && matchPayout;
    });
  }, [payrolls, filters]);

  const updateFilter = (key: keyof PayrollFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      department: '',
      period: '',
      status: '',
      payout: '',
    });
  };

  return {
    payrolls: filteredPayrolls,
    allPayrolls: payrolls,
    payrollRuns,
    employees,
    departments,
    isLoading,
    filters,
    updateFilter,
    clearFilters,
    refreshData
  };
}
