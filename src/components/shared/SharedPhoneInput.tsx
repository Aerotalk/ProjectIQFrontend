import { Controller, useFormContext } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface Props {
  name?: string;
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
  defaultCountry?: any; // e.g. "US", "IN"
  className?: string;
}

export default function SharedPhoneInput({ name, value, onChange, disabled, defaultCountry, className = '' }: Props) {
  const formContext = useFormContext();
  
  const phoneInputClasses = `flex w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus-within:ring-2 focus-within:ring-[#792359]/50 transition-colors [&>input]:bg-transparent [&>input]:focus:outline-none [&>input]:w-full ${className}`;

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field: { ref, ...fieldProps } }) => (
          <PhoneInput
            {...fieldProps}
            key={defaultCountry}
            defaultCountry={defaultCountry}
            disabled={disabled}
            international
            className={phoneInputClasses}
          />
        )}
      />
    );
  }

  return (
    <PhoneInput
      value={value}
      onChange={onChange as any}
      key={defaultCountry}
      defaultCountry={defaultCountry}
      disabled={disabled}
      international
      className={phoneInputClasses}
    />
  );
}
