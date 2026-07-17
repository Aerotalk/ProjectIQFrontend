import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface Props {
  name: string;
  disabled?: boolean;
  defaultCountry?: any; // e.g. "US", "IN"
  className?: string;
}

export default function SharedPhoneInput({ name, disabled, defaultCountry, className = '' }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...fieldProps } }) => (
        <PhoneInput
          {...fieldProps}
          key={defaultCountry}
          defaultCountry={defaultCountry}
          disabled={disabled}
          international
          className={`flex w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus-within:ring-2 focus-within:ring-[#792359]/50 transition-colors [&>input]:bg-transparent [&>input]:focus:outline-none [&>input]:w-full ${className}`}
        />
      )}
    />
  );
}
