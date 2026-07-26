import { useState, useEffect } from 'react';
import CustomSelect, { type SelectOption } from '../ui/CustomSelect';
import { EmployeeService, type Employee } from '../../services/employee.service';

interface EmployeeSelectorProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export default function EmployeeSelector({ value, onChange, disabled, className, placeholder = 'Select Employee' }: EmployeeSelectorProps) {
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

  const options: SelectOption[] = employees.map(emp => ({
    label: `${emp.firstName} ${emp.lastName}`,
    value: emp.id,
    subtitle: emp.designationId || 'Employee', // Ideally resolve designation name, but ID/placeholder for now
    subLabel: emp.employeeId || emp.id.substring(0, 8)
  }));

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
