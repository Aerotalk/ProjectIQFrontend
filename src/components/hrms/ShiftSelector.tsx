import { useState, useEffect } from 'react';
import CustomSelect, { type SelectOption } from '../ui/CustomSelect';
import { WorkforceService } from '../../pages/hrms/workforce/services';

interface ShiftSelectorProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export default function ShiftSelector({ value, onChange, disabled, className, placeholder = 'Select Shift' }: ShiftSelectorProps) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    WorkforceService.getShifts().then((res: any) => {
      setOptions(res.data.map((shift: any) => ({
        label: shift.shiftName,
        value: shift.id,
        subtitle: `${shift.startTime} - ${shift.endTime}`,
        subLabel: shift.shiftCode
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
