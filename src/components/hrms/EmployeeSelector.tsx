import CustomSelect, { type SelectOption } from '../ui/CustomSelect';

const MOCK_EMPLOYEES = [
  { id: 'emp-1', name: 'John Doe', designation: 'Software Engineer', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 'emp-2', name: 'Jane Smith', designation: 'Product Manager', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 'emp-3', name: 'Robert Johnson', designation: 'QA Tester', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 'emp-4', name: 'Emily Davis', designation: 'HR Executive', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 'emp-5', name: 'Michael Brown', designation: 'Backend Developer', avatar: 'https://i.pravatar.cc/150?u=5' },
];

interface EmployeeSelectorProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export default function EmployeeSelector({ value, onChange, disabled, className, placeholder = 'Select Employee' }: EmployeeSelectorProps) {
  const options: SelectOption[] = MOCK_EMPLOYEES.map(emp => ({
    label: emp.name,
    value: emp.id,
    subtitle: emp.designation,
    subLabel: emp.id
  }));

  return (
    <CustomSelect
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
    />
  );
}
