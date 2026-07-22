import { useFormContext } from 'react-hook-form';
import { AddressFormGroup } from '@/components/shared/SharedAddressSection';
import { FormSection } from '@/components/ui/FormLayout';

interface Props {
  readOnly?: boolean;
}

export default function AddressTab({ readOnly }: Props) {
  const { watch, setValue } = useFormContext();
  watch('sameAsPresentAddress');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FormSection title="Address Details" className="pt-0 border-t-0 space-y-6">
        <AddressFormGroup
          prefix="present"
          title="Present Address"
          readOnly={readOnly}
          optionalFields={true}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="sameAsPresentAddress"
            {...useFormContext().register('sameAsPresentAddress')}
            disabled={readOnly}
            className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]"
            onChange={(e) => {
              const checked = e.target.checked;
              setValue('sameAsPresentAddress', checked);
              if (checked) {
                const values = watch();
                setValue('permanentCountry', values.presentCountry);
                setValue('permanentState', values.presentState);
                setValue('permanentCity', values.presentCity);
                setValue('permanentAddressLine1', values.presentAddressLine1);
                setValue('permanentAddressLine2', values.presentAddressLine2);
                setValue('permanentPinCode', values.presentPinCode);
                setValue('permanentPhone', values.presentPhone);
              }
            }}
          />
          <label htmlFor="sameAsPresentAddress" className="text-sm text-gray-700 dark:text-gray-300">
            Same as Present Address
          </label>
        </div>

        <AddressFormGroup
          prefix="permanent"
          title="Permanent Address"
          readOnly={readOnly}
          optionalFields={true}
        />
      </FormSection>
    </div>
  );
}
