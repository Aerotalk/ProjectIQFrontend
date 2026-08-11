import { useState, useEffect } from 'react';
import CustomSelect, { type SelectOption } from '../ui/CustomSelect';
import { WorkforceService } from '../../pages/hrms/workforce/services';

interface LeaveTypeSelectorProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export default function LeaveTypeSelector({ value, onChange, disabled, className, placeholder = 'Select Leave Type' }: LeaveTypeSelectorProps) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    WorkforceService.getLeaveTypes().then((res: any) => {
      const list = Array.isArray(res) ? res : (res?.data || []);
      setOptions(list.filter((l: any) => l.active !== false).map((leave: any) => ({
        label: leave.name,
        value: leave.id,
        subtitle: leave.category,
        subLabel: leave.code
      })));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  return (
    <CustomSelect
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      isLoading={loading}
    />
  );
}
