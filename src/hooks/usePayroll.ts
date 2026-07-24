import { useState, useEffect, useMemo } from 'react';
import { mockPayrollService, type PayrollRecord } from '../services/mockPayrollService';
import { api } from '../lib/api';

export interface PayrollFilters {
  searchTerm: string;
  department: string;
  period: string;
  status: string;
  payout: string;
}

export function usePayroll() {
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

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [payrollsData, rawEmployeesData, rawDeptsData] = await Promise.all([
          mockPayrollService.fetchPayrolls(),
          api.get('/admin/employees'),
          api.get('/admin/departments')
        ]);
        
        const employeesData = rawEmployeesData.map((e: any) => ({
          id: e.id,
          name: `${e.firstName} ${e.lastName}`,
          empId: e.employeeCode
        }));

        const deptsData = rawDeptsData.map((d: any) => ({
          id: d.id,
          name: d.departmentName
        }));

        if (isMounted) {
          setPayrolls(payrollsData);
          setEmployees(employeesData);
          setDepartments(deptsData);
        }
      } catch (error) {
        console.error('Failed to fetch payroll data', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
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
    employees,
    departments,
    isLoading,
    filters,
    updateFilter,
    clearFilters
  };
}
