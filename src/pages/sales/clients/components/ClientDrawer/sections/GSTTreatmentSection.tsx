import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { GST_TREATMENTS } from '../../../constants/gstTreatments';
import type { GSTTreatment } from '../../../../../../types/client.types';
import { Card } from '../../../../../../components/ui/card';

interface Props {
  readOnly?: boolean;
}

export default function GSTTreatmentSection({ readOnly }: Props) {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-200 dark:border-white/10 pb-2">
        Step 1 — GST Treatment
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Select the GST treatment type. The form adapts instantly based on this selection.
      </p>

      <Controller
        name="gstTreatment"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GST_TREATMENTS.map((treatment) => {
              const isSelected = field.value === treatment.value;
              return (
                <Card
                  key={treatment.value}
                  onClick={() => {
                    if (!readOnly) field.onChange(treatment.value);
                  }}
                  className={`relative flex cursor-pointer p-4 transition-colors
                    ${isSelected 
                      ? 'border-[#792359] bg-[#792359]/5 dark:bg-[#792359]/10 ring-2 ring-[#792359]' 
                      : 'hover:border-[#792359]/50'
                    }
                    ${readOnly ? 'pointer-events-none opacity-80' : ''}
                  `}
                >
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {treatment.label}
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        {treatment.description}
                      </span>
                    </span>
                  </span>
                </Card>
              );
            })}
          </div>
        )}
      />
    </div>
  );
}
