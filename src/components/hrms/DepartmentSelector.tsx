import { useState, useEffect } from 'react';
import CustomSelect, { type SelectOption } from '../ui/CustomSelect';
import { api } from '../../lib/api';

interface DepartmentSelectorProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export default function DepartmentSelector({ value, onChange, disabled, className, placeholder = 'Select Department' }: DepartmentSelectorProps) {
  const [departments, setDepartments] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/admin/departments');
        if (mounted && Array.isArray(response)) {
          setDepartments(response.map(dept => ({
            label: dept.departmentName || 'Unknown Department',
            value: dept.id,
            subtitle: dept.departmentHead?.firstName 
              ? `Head: ${dept.departmentHead.firstName} ${dept.departmentHead.lastName}` 
              : 'No Head Assigned',
            subLabel: dept.id
          })));
        }
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchDepartments();
    return () => { mounted = false; };
  }, []);

  return (
    <CustomSelect
      options={departments}
      value={value}
      onChange={onChange}
      disabled={disabled || isLoading}
      className={className}
      placeholder={isLoading ? 'Loading...' : placeholder}
    />
  );
}
