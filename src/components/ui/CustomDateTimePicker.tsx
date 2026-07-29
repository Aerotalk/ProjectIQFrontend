import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, Clock, X, Check } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { formStyles } from '@/components/ui/form-styles';

interface CustomDateTimePickerProps {
  name?: string;
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  hasError?: boolean;
  withTime?: boolean;
}

const getParsedDate = (dateStr?: string) => {
  if (!dateStr) return undefined;
  try {
    const d = parseISO(dateStr);
    return isNaN(d.getTime()) ? undefined : d;
  } catch {
    return undefined;
  }
};

const to12h = (time24: string): { h: string; m: string; ampm: 'AM' | 'PM' } => {
  if (!time24 || !time24.includes(':')) return { h: '', m: '', ampm: 'AM' };
  const [hStr, mStr] = time24.split(':');
  const hour = parseInt(hStr, 10);
  if (isNaN(hour)) return { h: '', m: '', ampm: 'AM' };
  const ampm: 'AM' | 'PM' = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return { h: String(h12), m: mStr || '00', ampm };
};

const to24hStr = (h: string, m: string, ampm: 'AM' | 'PM') => {
  const hNum = parseInt(h, 10);
  if (isNaN(hNum)) return '';
  let h24 = hNum;
  if (ampm === 'AM' && hNum === 12) h24 = 0;
  if (ampm === 'PM' && hNum !== 12) h24 = hNum + 12;
  return `${String(h24).padStart(2, '0')}:${(m || '00').padStart(2, '0')}`;
};

function DateTimePickerCore({
  value,
  onChange,
  disabled,
  hasError,
  withTime,
  placeholder,
  className,
}: {
  value?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  withTime?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropUp, setDropUp] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [ampm, setAmPm] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    if (!isOpen) return;

    const parts = (value || '').split('T');
    const date = getParsedDate(parts[0]);
    const time = to12h(parts[1] || '');

    setSelectedDate(date);
    setHour(time.h);
    setMinute(time.m);
    setAmPm(time.ampm);
  }, [isOpen, value]);

  // Derive date and time directly from value prop — no local state needed
  const parts = (value || '').split('T');
  // const datePart = parts[0] || '';
  const timePart = parts[1] || '';

  // Click outside → close
  // useEffect(() => {
  //   const handler = (e: MouseEvent) => {
  //     if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
  //       setIsOpen(false);
  //     }
  //   };
  //   document.addEventListener('mousedown', handler);
  //   return () => document.removeEventListener('mousedown', handler);
  // }, []);

  // Flip up if near bottom of viewport
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropUp(window.innerHeight - rect.bottom < 400);
    }
  }, [isOpen]);

  // When date is picked, keep existing time (default 12:00 PM if none)
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    setSelectedDate(date);

    const dateStr = format(date, 'yyyy-MM-dd');

    if (withTime) {
      const time = to24hStr(hour || '12', minute || '00', ampm);
      onChange(`${dateStr}T${time}`);
    } else {
      onChange(dateStr);
    }
  };

  // When hour input changes, update the value
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');

    if (parseInt(v) > 12) v = '12';

    setHour(v);

    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const time = to24hStr(v || '12', minute || '00', ampm);

      onChange(`${dateStr}T${time}`);
    }
  };

  // When minute input changes, update the value
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');

    if (parseInt(v) > 59) v = '59';

    setMinute(v);

    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const time = to24hStr(hour || '12', v || '00', ampm);

      onChange(`${dateStr}T${time}`);
    }
  };

  const handleAmPm = (value: 'AM' | 'PM') => {
    setAmPm(value);

    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const time = to24hStr(hour || '12', minute || '00', value);

      onChange(`${dateStr}T${time}`);
    }
  };

  const handleClear = () => {
    setSelectedDate(undefined);
    setHour('');
    setMinute('');
    setAmPm('AM');
    onChange('');
  };

  const timeDisplay =
    hour && minute
      ? `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${ampm}`
      : '--:-- --';

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(o => !o)}
        className={cn(
          formStyles.field(hasError, disabled),
          'flex items-center gap-2 cursor-pointer text-left w-full',
          isOpen && 'border-[#792359] ring-2 ring-[#792359]/20',
          className
        )}
      >
        <CalendarIcon
          size={15}
          className={cn('shrink-0', selectedDate ? 'text-[#792359]' : 'text-gray-400')}
        />
        <span className={cn('flex-1 text-sm', !selectedDate && 'text-gray-400')}>
          {selectedDate ? format(selectedDate, 'dd MMM yyyy') : (placeholder || 'Pick a date')}
        </span>
        {withTime && (
          <>
            <span className="text-gray-300 dark:text-white/20 select-none">|</span>
            <Clock
              size={14}
              className={cn('shrink-0', timePart ? 'text-[#792359]' : 'text-gray-400')}
            />
            <span className={cn('text-sm tabular-nums', !timePart && 'text-gray-400')}>
              {timeDisplay}
            </span>
          </>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          className={cn(
            'absolute left-0 z-[99999] w-auto min-w-full bg-white dark:bg-[#181a1f]',
            'border border-gray-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden',
            'animate-in fade-in duration-150',
            dropUp
              ? 'bottom-[calc(100%+4px)] slide-in-from-bottom-2'
              : 'top-[calc(100%+4px)] slide-in-from-top-2'
          )}
        >
          {/* Calendar */}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            captionLayout="dropdown"
            autoFocus
          />

          {/* Time picker */}
          {withTime && (
            <div className="border-t border-gray-100 dark:border-white/10 px-3 py-3 bg-gray-50/60 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#792359] shrink-0" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Time
                </span>
                <div className="ml-auto flex items-center gap-1.5">
                  {/* HH:MM inputs */}
                  <div className="flex items-center bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 rounded-sm px-2 py-1.5 gap-1">
                    <input
                      id="dt-hr-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="12"
                      value={hour}
                      onChange={handleHourChange}
                      onFocus={e => e.target.select()}
                      className="w-6 text-center text-sm bg-transparent text-gray-900 dark:text-white outline-none tabular-nums"
                    />
                    <span className="text-gray-400 font-bold text-sm select-none">:</span>
                    <input
                      id="dt-min-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="00"
                      value={minute}
                      onChange={handleMinChange}
                      onFocus={e => e.target.select()}
                      className="w-6 text-center text-sm bg-transparent text-gray-900 dark:text-white outline-none tabular-nums"
                    />
                  </div>
                  {/* AM / PM */}
                  <div className="flex rounded-sm border border-gray-200 dark:border-white/10 overflow-hidden text-xs font-semibold">
                    {(['AM', 'PM'] as const).map(ap => (
                      <button
                        key={ap}
                        type="button"
                        onClick={() => handleAmPm(ap)}
                        className={cn(
                          'px-2.5 py-1.5 transition-colors',
                          ap === 'PM' && 'border-l border-gray-200 dark:border-white/10',
                          ampm === ap
                            ? 'bg-[#792359] text-white'
                            : 'bg-white dark:bg-[#0f1115] text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                        )}
                      >
                        {ap}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-100 dark:border-white/10 px-3 py-2 flex items-center justify-between bg-white dark:bg-[#181a1f]">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={12} /> Clear
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#792359] hover:bg-[#52173c] transition-colors px-2.5 py-1.5 rounded-sm"
            >
              <Check size={11} /> Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomDateTimePicker({
  name,
  value,
  onChange,
  disabled,
  className,
  placeholder,
  hasError,
  withTime = true,
}: CustomDateTimePickerProps) {
  const formContext = useFormContext();

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field, fieldState }) => (
          <DateTimePickerCore
            value={field.value}
            onChange={field.onChange}
            disabled={disabled}
            hasError={!!fieldState.error || hasError}
            withTime={withTime}
            placeholder={placeholder}
            className={className}
          />
        )}
      />
    );
  }

  return (
    <DateTimePickerCore
      value={value}
      onChange={onChange || (() => { })}
      disabled={disabled}
      hasError={hasError}
      withTime={withTime}
      placeholder={placeholder}
      className={className}
    />
  );
}
