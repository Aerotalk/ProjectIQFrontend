import CustomSelect, { type SelectOption } from '../ui/CustomSelect';

const MOCK_DEPARTMENTS = [
  { id: 'dept-1', name: 'Engineering', head: 'John Doe' },
  { id: 'dept-2', name: 'Human Resources', head: 'Emily Davis' },
  { id: 'dept-3', name: 'Sales', head: 'Mark Wilson' },
  { id: 'dept-4', name: 'Marketing', head: 'Sarah Taylor' },
  { id: 'dept-5', name: 'Finance', head: 'James Anderson' },
];

interface DepartmentSelectorProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export default function DepartmentSelector({ value, onChange, disabled, className, placeholder = 'Select Department' }: DepartmentSelectorProps) {
  const options: SelectOption[] = MOCK_DEPARTMENTS.map(dept => ({
    label: dept.name,
    value: dept.id,
    subtitle: `Head: ${dept.head}`,
    subLabel: dept.id
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
