import { useState, useEffect } from 'react';
import CustomSelect, { type SelectOption } from '../ui/CustomSelect';
import { EmployeeService, type Employee } from '../../services/employee.service';

interface EmployeeSelectorProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  allowAll?: boolean;
}

export default function EmployeeSelector({ value, onChange, disabled, className, placeholder = 'Select Employee', allowAll }: EmployeeSelectorProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await EmployeeService.getAll();
        setEmployees(data || []);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const employeeOptions = employees.map(emp => ({
    label: `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Unknown Employee',
    value: emp.id || emp.employeeId || `unknown-${Math.random()}`,
    subtitle: emp.designationId || 'Employee', // Ideally resolve designation name, but ID/placeholder for now
    subLabel: emp.employeeId || (emp.id && typeof emp.id === 'string' ? emp.id.substring(0, 8) : '')
  }));

  const options: SelectOption[] = allowAll 
    ? [{ label: 'All Employees', value: '' }, ...employeeOptions]
    : employeeOptions;

  return (
    <CustomSelect
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
      className={className}
      placeholder={loading ? 'Loading employees...' : placeholder}
    />
  );
}
